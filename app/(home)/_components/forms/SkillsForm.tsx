import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResumeInfoContext } from '@/context/resume-info-provider'
import useDeleteSkill from '@/features/use-delete-skill'
import useGetSkills from '@/features/use-get-skills'
import useUpdateDocument from '@/features/use-update-document'
import { toast } from '@/hooks/use-toast'
import { generateThumbnail } from '@/lib/helper'
import { SkillType } from '@/types/resume.type'
import { LoaderCircle, Pencil, Trash2 } from 'lucide-react'
import React, { FC, useCallback, useState } from 'react'

interface Prop {
    handleNext: () => void,
}

const initialSkill = {
    name: '',
    rating: 0,
}

const SkillsForm: FC<Prop> = ({ handleNext }) => {
    const [skill, setSkill] = useState<SkillType>(initialSkill)
    const { resumeInfo, onUpdate } = useResumeInfoContext()
    const { mutateAsync, isPending } = useUpdateDocument()
    const [isEdit, setIsEdit] = useState(false)
    const [editingSkillId, seteditingSkillId] = useState<number | undefined>(undefined)
    const [isOpen, setIsOpen] = useState(false)
    const [deletingId, setDeletingId] = useState<number | undefined>(undefined)
    const { data, isLoading, refetch } = useGetSkills()
    const skills = data?.skills ?? resumeInfo?.skills ?? [];
    const { mutate, isPending: isDeletePending } = useDeleteSkill()


    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
    
        setSkill((prev) => ({
            ...prev,
            [name]: name === "rating" ? Number(value) || 0 : value,
        }));
    }, []);
    

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("rating type : ", typeof skill?.rating);

        const updatedSkills = [...(resumeInfo?.skills ?? []), skill]
        const updatedInfo = {
            ...resumeInfo,
            skills: updatedSkills,
            title: resumeInfo?.title || 'Untitled Resume',
            status: resumeInfo?.status ?? 'private',
            summary: resumeInfo?.summary || '',
        }

        onUpdate(updatedInfo)

        try {
            const thumbnail = await generateThumbnail()
            const currentNo = resumeInfo?.currentPosition || 1
            await mutateAsync({
                skills: updatedSkills,
                thumbnail,
                currentPosition: currentNo,
            }, {
                onSuccess: () => {
                    toast({
                        title: 'Success',
                        description: 'Updated Successfully',
                    })
                    setSkill(initialSkill)
                    refetch()
                    const skillSection = document.getElementById('skills-sections')
                    if (skillSection) {
                        skillSection.scrollIntoView({ behavior: 'smooth' })
                    }
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Error in updating skill',
                        variant: 'destructive',
                    })
                }
            })
        } catch {
            toast({
                title: 'Error',
                description: 'Error in updating skill',
                variant: 'destructive',
            })
        }
    }, [skill, resumeInfo, onUpdate, mutateAsync, refetch])

    const handleEditSubmit = useCallback(async (e: { preventDefault: () => void }) => {
        e.preventDefault()
        const newSkill = { ...skill }
        const updatedSkills = resumeInfo?.skills?.filter((skill) => skill?.id != editingSkillId)
        const newUpdatedSkills = [...(updatedSkills ?? []), newSkill]

        onUpdate({
            ...resumeInfo,
            skills: newUpdatedSkills,
            title: resumeInfo?.title || 'Untitled Resume',
            status: resumeInfo?.status ?? 'private',
            summary: resumeInfo?.summary || '',
        })

        const thumbnail = await generateThumbnail();
        const currentNo = resumeInfo?.currentPosition ? resumeInfo?.currentPosition : 1;
        await mutateAsync(
            {
                skills: newUpdatedSkills,
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
                    setSkill(initialSkill)
                    setIsEdit(false)


                    const skillSection = document.getElementById('skills-sections')
                    if (skillSection) {
                        skillSection.scrollIntoView({ behavior: 'smooth' })
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
    }, [skill, resumeInfo, onUpdate, skills, isEdit])

    const handleDelete = useCallback(() => {
        if (deletingId) {
            const updatedSkills = resumeInfo?.skills?.filter((skill) => skill.id !== deletingId) ?? [];
            mutate(deletingId, {
                onSuccess: () => {
                    toast({
                        title: 'Success',
                        description: 'Deleted Successfully'
                    })
                    onUpdate({
                        ...resumeInfo,
                        skills: updatedSkills,
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
    }, [deletingId, resumeInfo, onUpdate, mutate, skill, skills])

    const handleEdit = useCallback((skill: SkillType) => {
        seteditingSkillId(skill?.id)
        setSkill({
            ...skill,
            id: skill?.id,
            docId: skill?.docId,
            name: skill?.name,
            rating: skill?.rating,
        })
        setIsEdit(true)
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [skill, isEdit])

    return (
        <div>
            {isEdit === false ? (
                <>
                    <div>
                        <h2 className='font-bold text-lg'>Skills</h2>
                        <p className='text-sm'>Enter your skills</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className='my-5 grid grid-cols-2 gap-3'>
                            <div>
                                <Label>Skill</Label>
                                <Input
                                    name='name'
                                    placeholder=''
                                    required
                                    value={skill.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>Rating</Label>
                                <Input
                                    type='number'
                                    name='rating'
                                    min={0}
                                    max={5}
                                    placeholder='Enter rating (0-5)'
                                    required
                                    value={skill.rating}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className='mt-2'>
                            <Button type='submit' disabled={isPending}>
                                {isPending && <LoaderCircle className='animate-spin' size='15px' />}
                                Add
                            </Button>
                        </div>
                    </form>
                </>
            ) : (
                <div className='bg-primary/5 p-2 border border-primary rounded-lg' >
                    <div>
                        <h2 className='font-bold text-lg'>Edit Skill</h2>
                    </div>
                    <form onSubmit={handleEditSubmit}>
                        <div className='my-5 grid grid-cols-2 gap-3'>
                            <div>
                                <Label>Skill</Label>
                                <Input
                                    name='name'
                                    placeholder=''
                                    required
                                    value={skill.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>Rating</Label>
                                <Input
                                    type='number'
                                    name='rating'
                                    min={0}
                                    max={10}
                                    placeholder='Enter rating (0-10)'
                                    required
                                    value={skill.rating}
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
                                seteditingSkillId(undefined)
                                setSkill(initialSkill)
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
                            <p>Fetching Skills...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 id='skills-sections' className='font-bold text-xl ' >Your Skills</h2>
                        <div className='grid grid-cols-1 lg:grid-cols-2  gap-3 '>
                            {data?.skills && data?.skills?.length > 0 ? (
                                <>
                                    {data?.skills?.map((skill, index) => (
                                        <div key={index} className='border p-2 my-5 rounded-lg hover:border-primary hover:shadow-sm transition-all bg-primary/5 ' >
                                            <div className='flex justify-between items-center' >
                                                <h5 className='font-bold text-lg' >{skill?.name}</h5>
                                            </div>
                                            <div className='flex gap-3 mt-2 justify-start items-start' >
                                                <Button onClick={() => handleEdit(skill as SkillType)} variant='outline' className="dark:text-white px-2 py-1 text-sm" >
                                                    <div className='flex justify-center items-center gap-1' >
                                                        <Pencil className=' text-primary hover:text-secondary ' size='4px' />
                                                        <p className='text-[12px]' >Edit</p>
                                                    </div>
                                                </Button>
                                                <Button onClick={() => {
                                                    setDeletingId(skill.id!)
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
                                        <p className='text-sm' >No skills to show...</p>
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

export default SkillsForm
