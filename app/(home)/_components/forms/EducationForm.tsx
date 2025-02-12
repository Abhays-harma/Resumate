import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useResumeInfoContext } from '@/context/resume-info-provider'
import useDeleteEducation from '@/features/use-delete-education'
import useGetEducations from '@/features/use-get-educations'
import useUpdateDocument from '@/features/use-update-document'
import { toast } from '@/hooks/use-toast'
import { generateThumbnail } from '@/lib/helper'
import { EducationType } from '@/types/resume.type'
import { LoaderCircle, Pencil, Trash2 } from 'lucide-react'
import React, { FC, useCallback, useState } from 'react'

interface Prop {
    handleNext: () => void,
}

const initialEducation = {
    universityName: '',
    degree: '',
    major: '',
    startDate: '',
    endDate: '',
    description: '',
}

const EducationForm: FC<Prop> = ({ handleNext }) => {
    const { resumeInfo, onUpdate } = useResumeInfoContext()
    const { mutateAsync, isPending } = useUpdateDocument()
    const { data, isLoading, refetch } = useGetEducations()
    const { mutate, isPending: isDeletePending } = useDeleteEducation()
    const [education, setEducation] = useState<EducationType>(initialEducation)
    const educations = data?.educations ?? resumeInfo?.educations ?? [];



    const [deletingId, setDeletingId] = useState<number | undefined>(undefined)
    const [isOpen, setIsOpen] = useState(false)
    const [editingEduId, seteditingEduId] = useState<number | undefined>(undefined);
    const [isEdit, setIsEdit] = useState(false)

    const handleEdit = useCallback((edu: EducationType) => {
        seteditingEduId(edu?.id)
        setEducation({
            ...education,
            id: edu?.id,
            docId: edu?.docId,
            universityName: edu?.universityName,
            degree: edu?.degree,
            major: edu?.major,
            startDate: edu?.startDate,
            endDate: edu?.endDate,
            description: edu?.description,
        })
        setIsEdit(true)
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [isEdit, education])

    const handleSubmit = useCallback(async (e: { preventDefault: () => void }) => {
        e.preventDefault()
        // console.log("Education is  : ", education)
        const updatedEducations = [...(resumeInfo?.educations ?? []), education]

        onUpdate({
            ...resumeInfo,
            educations: updatedEducations,
            title: resumeInfo?.title || 'Untitled Resume',
            status: resumeInfo?.status ?? 'private',
            summary: resumeInfo?.summary || '',
        })

        const thumbnail = await generateThumbnail()
        const currentNo = resumeInfo?.currentPosition ? resumeInfo?.currentPosition : 1

        await mutateAsync(
            {
                education: updatedEducations,
                thumbnail: thumbnail,
                currentPosition: currentNo,
            },
            {
                onSuccess: () => {
                    toast({
                        title: 'Success',
                        description: 'Updated Successfully'
                    })
                    setEducation(initialEducation)
                    refetch();
                    const educationSection = document.getElementById('educations-sections')
                    if (educationSection) {
                        educationSection.scrollIntoView({ behavior: 'smooth' })
                    }
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Error in updating education',
                        variant: 'destructive',
                    })
                }
            }
        )

    }, [education, resumeInfo, onUpdate, educations,refetch])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement
        const { name, value, type } = target
        setEducation({ ...education, [name]: value })
    }, [education])

    const handleEditSubmit = useCallback(async (e: { preventDefault: () => void }) => {
        e.preventDefault()
        const newEducation = { ...education }
        const updatedEducations = resumeInfo?.educations?.filter((edu) => edu?.id != editingEduId)
        const newUpdatedEducations = [...(updatedEducations ?? []), newEducation]

        onUpdate({
            ...resumeInfo,
            educations: newUpdatedEducations,
            title: resumeInfo?.title || 'Untitled Resume',
            status: resumeInfo?.status ?? 'private',
            summary: resumeInfo?.summary || '',
        })

        const thumbnail = await generateThumbnail();
        const currentNo = resumeInfo?.currentPosition ? resumeInfo?.currentPosition : 1;
        await mutateAsync(
            {
                education: newUpdatedEducations,
                thumbnail: thumbnail,
                currentPosition: currentNo,
            },
            {
                onSuccess: () => {
                    toast({
                        title: 'Success',
                        description: 'Updated Successfully',
                    })
                    refetch()
                    setEducation(initialEducation)
                    setIsEdit(false)


                    const educationSection = document.getElementById('educations-sections')
                    if (educationSection) {
                        educationSection.scrollIntoView({ behavior: 'smooth' })
                    }
                },

                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Error in updating education',
                        variant: 'destructive',
                    })
                }
            }
        )
    }, [education, resumeInfo, onUpdate, educations, isEdit])

    const handleDelete = useCallback(() => {
        if (deletingId) {
            const updatedEducations = resumeInfo?.educations?.filter((edu) => edu.id !== deletingId) ?? [];
            mutate(deletingId, {
                onSuccess: () => {
                    toast({
                        title: 'Success',
                        description: 'Deleted Successfully'
                    })
                    onUpdate({
                        ...resumeInfo,
                        educations: updatedEducations,
                        title: resumeInfo?.title || 'Untitled Resume',
                        status: resumeInfo?.status ?? 'private',
                        summary: resumeInfo?.summary || '',
                    });
                    refetch();
                    setDeletingId(undefined)
                    setIsOpen(false)
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Error in deleting experience',
                        variant: 'destructive'
                    })
                    setDeletingId(undefined)
                    setIsOpen(false)
                }
            })
        }
    }, [deletingId, resumeInfo, onUpdate, mutate, education, educations])


    return (
        <div>
            {isEdit === false ? (
                <div>
                    <div>
                        <h2 className='font-bold text-lg' >Education</h2>
                        <p className='text-sm'>Enter your educational details</p>
                    </div>
                    <form onSubmit={handleSubmit} >
                        <div className='grid grid-cols-2 gap-3' >
                            <div className='col-span-2' >
                                <Label className='text-sm' >University Name</Label>
                                <Input
                                    name='universityName'
                                    value={education?.universityName}
                                    required
                                    placeholder=''
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='' >
                                <Label className='text-sm' >Degree</Label>
                                <Input
                                    name='degree'
                                    value={education?.degree}
                                    required
                                    placeholder=''
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='' >
                                <Label className='text-sm' >Major</Label>
                                <Input
                                    name='major'
                                    value={education?.major}
                                    required
                                    placeholder=''
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='' >
                                <Label className='text-sm' >Start Date</Label>
                                <Input
                                    name='startDate'
                                    required
                                    value={education?.startDate}
                                    placeholder=''
                                    type='date'
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='' >
                                <Label className='text-sm' >End Date</Label>
                                <Input
                                    name='endDate'
                                    value={education?.endDate}
                                    required
                                    placeholder=''
                                    type='date'
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='col-span-2' >
                                <Label className='text-sm' >Description</Label>
                                <Textarea
                                    name='description'
                                    required
                                    value={education?.description}
                                    className=' dark:border-gray-800 min-h-36'
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <Button
                            type='submit'
                            className='mt-2 dark:text-white'
                        >
                            {isPending && <LoaderCircle className='animate-spin' size='15px' />}
                            Add
                        </Button>
                    </form>
                </div>
            ) : (
                <div className='bg-primary/5 p-2 border border-primary rounded-lg'>
                    <div className='w-full' >
                        <h2 className='font-bold text-lg' >Edit Education</h2>
                    </div>
                    <form onSubmit={handleEditSubmit} >
                        <div className='grid grid-cols-2 gap-3' >
                            <div className='col-span-2' >
                                <Label className='text-sm' >University Name</Label>
                                <Input
                                    name='universityName'
                                    value={education?.universityName}
                                    required
                                    placeholder=''
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='' >
                                <Label className='text-sm' >Degree</Label>
                                <Input
                                    name='degree'
                                    value={education?.degree}
                                    required
                                    placeholder=''
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='' >
                                <Label className='text-sm' >Major</Label>
                                <Input
                                    name='major'
                                    value={education?.major}
                                    required
                                    placeholder=''
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='' >
                                <Label className='text-sm' >Start Date</Label>
                                <Input
                                    name='startDate'
                                    required
                                    value={education?.startDate}
                                    placeholder=''
                                    type='date'
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='' >
                                <Label className='text-sm' >End Date</Label>
                                <Input
                                    name='endDate'
                                    value={education?.endDate}
                                    required
                                    placeholder=''
                                    type='date'
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='col-span-2' >
                                <Label className='text-sm' >Description</Label>
                                <Textarea
                                    name='description'
                                    required
                                    value={education?.description}
                                    className=' dark:border-gray-800 min-h-28'
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className='flex justify-start items-center gap-2 mt-2 ' >
                            <Button
                                type='submit'
                                disabled={
                                    isPending || resumeInfo?.status === 'archived' ? true : false
                                }
                            >
                                {isPending && <LoaderCircle className='animate-spin' size='15px' />}
                                Save Changes
                            </Button>
                            <Button onClick={() => {
                                setIsEdit(false)
                                seteditingEduId(undefined)
                                setEducation(initialEducation)
                                window.scrollTo({
                                    top: 0,
                                    behavior: 'smooth'
                                })
                            }}
                                type='button'
                                variant='destructive' >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            )}
            <Dialog open={isOpen} onOpenChange={setIsOpen} >
                <DialogTrigger asChild>
                    {/* Trigger is managed by the Delete button */}
                </DialogTrigger>
                <DialogContent className='rounded-lg mx-auto max-w-sm  ' >
                    <DialogTitle>Are you sure you want to delete this experience?</DialogTitle>
                    <DialogDescription>This action cannot be undone.</DialogDescription>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleDelete} variant="destructive">
                            {isDeletePending && (
                                <LoaderCircle
                                    className='animate-spin' />
                            )}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className='my-5 w-full' >
                {isLoading ? (
                    <div>
                        <div className='flex justify-center items-center gap-2' >
                            <LoaderCircle className='animate-spin' size='30px' />
                            <p>Fetching Educations</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 id='educations-sections' className='font-bold text-xl ' >Your Educations</h2>
                        <div className='grid grid-cols-1 lg:grid-cols-2  gap-3 '>
                            {data?.educations && data?.educations?.length > 0 ? (
                                <>
                                    {data?.educations?.map((edu, index) => (
                                        <div key={index} className='border p-2 my-5 rounded-lg hover:border-primary hover:shadow-sm transition-all bg-primary/5 ' >
                                            <div className='flex justify-between items-center' >
                                                <h5 className='font-bold text-lg' >{edu?.universityName}</h5>
                                            </div>
                                            <p className="text-[15px]">{edu?.degree}, {edu?.major}</p>
                                            <div className='flex gap-3 mt-2 justify-start items-start' >
                                                <Button onClick={() => handleEdit(edu as EducationType)} variant='outline' className="dark:text-white px-2 py-1 text-sm" >
                                                    <div className='flex justify-center items-center gap-1' >
                                                        <Pencil className=' text-primary hover:text-secondary ' size='4px' />
                                                        <p className='text-[12px]' >Edit</p>
                                                    </div>
                                                </Button>
                                                <Button onClick={() => {
                                                    setDeletingId(edu.id!)
                                                    setIsOpen(true)
                                                }} variant="outline" className="dark:text-white px-1 py-1 text-[10px]" >
                                                    <div className='flex justify-center items-center gap-1' >
                                                        <Trash2
                                                            className='text-rose-600 hover:text-rose-500 '
                                                            size='4px'
                                                        />

                                                        <p className='text-[12px]' >Delete</p>
                                                    </div>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <div>
                                        <p className='text-sm' >No experiences to show...</p>
                                    </div>
                                </>

                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default EducationForm