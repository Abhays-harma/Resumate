'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoaderCircle, Pencil, Trash2, X } from 'lucide-react'
import React, { FC, useCallback, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react';

import JoditEditor from 'jodit-react';
import { useResumeInfoContext } from '@/context/resume-info-provider'
import { generateThumbnail } from '@/lib/helper'
import useUpdateDocument from '@/features/use-update-document'
import { ExperienceType } from '@/types/resume.type'
import { toast } from '@/hooks/use-toast'
import useGetExperiences from '@/features/use-get-experiences'
import useDeleteExperience from '@/features/use-delete-experience'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface Prop {
  handleNext: () => void,
}

const ExperienceForm: FC<Prop> = ({ handleNext }) => {

  const editor = useRef(null)
  const [content, setContent] = useState('');

  const { resumeInfo, onUpdate } = useResumeInfoContext()
  const { mutateAsync, isPending } = useUpdateDocument()
  const { data, isLoading, refetch } = useGetExperiences()
  const { mutate, isPending: isDeletePending } = useDeleteExperience()
  const [isOpen, setIsOpen] = useState(false)

  const config = {
    readonly: false,
    enableDragAndDropFileToEditor: true,
    buttons: [
      'source',
      '|',
      'bold',
      'italic',
      'underline',
      '|',
      'ul',
      'ol',
      '|',
      'font',
      'fontsize',
      'brush',
      'paragraph',
      '|',
      'image',
      'table',
      'link',
      '|',
      'left',
      'center',
      'right',
      'justify',
      '|',
      'undo',
      'redo',
      '|',
      'hr',
      'eraser',
      'fullsize',
    ],
    uploader: { insertImageAsBase64URI: true },
    removeButtons: ['brush', 'file'],
    showXPathInStatusbar: false,
    showCharsCounter: false,
    showWordsCounter: false,
    toolbarAdaptive: true,
    toolbarSticky: true,
    style: {
      background: '#27272E',
      color: 'rgba(255,255,255,0.5)',
    },
  };

  const initialExperience: ExperienceType = {
    id: undefined,
    title: '',
    companyName: '',
    city: '',
    state: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    workSummary: '',
  };

  const [experience, setExperience] = useState<ExperienceType>(initialExperience);
  const experiences = data?.experiences || resumeInfo?.experiences || [];

  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false)
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    const checked = ("checked" in target) ? target.checked : false;
    if (name === 'currentlyWorking') {
      setIsCurrentlyWorking(checked)
    }
    setExperience({ ...experience, [name]: type === 'checkbox' ? checked : value });
  }, [experience, isCurrentlyWorking]);

  const [editingExpId, seteditingExpId] = useState<number | undefined>(undefined);

  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [isEdit, setIsEdit] = useState(false)
  const handleEdit = useCallback((exp: ExperienceType) => {
    seteditingExpId(exp?.id)
    setExperience({
      ...experience,
      id: exp?.id,
      docId: exp?.docId,
      title: exp?.title,
      companyName: exp?.companyName,
      city: exp?.city,
      state: exp?.state,
      startDate: exp?.startDate,
      endDate: exp?.endDate,
      currentlyWorking: exp?.currentlyWorking,
      workSummary: exp?.workSummary
    })
    setContent(exp?.workSummary || '')
    setIsEdit(true)
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [isEdit, experience])



  const handleEditSubmit = useCallback(async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const newExperience = { ...experience, workSummary: content }
    const updatedExperiences = resumeInfo?.experiences?.filter((exp) => exp?.id != editingExpId)
    const newUpdatedExperiences = [...(updatedExperiences ?? []), newExperience]

    const thumbnail = await generateThumbnail();
    const currentNo = resumeInfo?.currentPosition ? resumeInfo?.currentPosition : 1;

    await mutateAsync(
      {
        experience: newUpdatedExperiences,
        thumbnail: thumbnail,
        currentPosition: currentNo,
      },
      {
        onSuccess: () => {
          onUpdate({
            ...resumeInfo,
            experiences: newUpdatedExperiences,
            title: resumeInfo?.title || 'Untitled Resume',
            status: resumeInfo?.status ?? 'private',
            summary: resumeInfo?.summary || '',
          })
          toast({
            title: 'Success',
            description: 'Updated Successfully',
          })
          refetch()
          setExperience(initialExperience)
          setContent('')
          setIsEdit(false)


          const experiencesSection = document.getElementById('experiences-section')
          if (experiencesSection) {
            experiencesSection.scrollIntoView({ behavior: 'smooth' })
          }
        },

        onError: () => {
          toast({
            title: 'Error',
            description: 'Error in updating experience',
            variant: 'destructive',
          })
        }
      }
    )
  }, [experience, content, resumeInfo, onUpdate, experiences, isEdit])

  const handleDelete = useCallback(() => {
    if (deletingId) {
      const updatedExperiences = resumeInfo?.experiences?.filter((exp) => exp.id !== deletingId) ?? [];
      mutate(deletingId, {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Deleted Successfully'
          })
          onUpdate({
            ...resumeInfo,
            experiences: updatedExperiences,
            title: resumeInfo?.title || 'Untitled Resume',
            status: resumeInfo?.status ?? 'private',
            summary: resumeInfo?.summary || '',
          });
          refetch();
          setDeletingId(null)
          setIsOpen(false)
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Error in deleting experience',
            variant: 'destructive'
          })
          setDeletingId(null)
          setIsOpen(false)
        }
      })
    }
  }, [deletingId, resumeInfo, onUpdate, mutate])

  const handleSubmit = useCallback(async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const newExperience = { ...experience, workSummary: content };
    const updatedExperiences = [...(resumeInfo?.experiences ?? []), newExperience];

    onUpdate({
      ...resumeInfo,
      experiences: updatedExperiences,
      title: resumeInfo?.title || 'Untitled Resume',
      status: resumeInfo?.status ?? 'private',
      summary: resumeInfo?.summary || '',
    });
    const thumbnail = await generateThumbnail()
    const currentNo = resumeInfo?.currentPosition ? resumeInfo.currentPosition + 1 : 1
    await mutateAsync(
      {
        thumbnail: thumbnail,
        currentPosition: currentNo,
        experience: updatedExperiences,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Updated experience successfully',
          })
          setExperience(initialExperience)
          setContent('')
          refetch();
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Error in updating experience',
            variant: 'destructive'
          })
        }
      }
    )
  }, [experience, content, resumeInfo, onUpdate, experiences, refetch])

  return (
    <div className='w-full' >
      {isEdit === false ? (
        <>
          <div className='w-full' >
            <h5 className='font-bold text-lg' >Professional Experience</h5>
          </div>
          <form onSubmit={handleSubmit} >
            <div className=' grid grid-cols-2 gap-3' >
              <div>
                <Label className='text-sm' >Position Title</Label>
                <Input
                  required
                  placeholder=''
                  name='title'
                  value={experience?.title ?? ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label className='text-sm' >Company Name</Label>
                <Input
                  required
                  placeholder=''
                  name='companyName'
                  value={experience?.companyName ?? ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label className='text-sm' >City</Label>
                <Input
                  required
                  placeholder=''
                  name='city'
                  value={experience?.city ?? ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label className='text-sm' >State</Label>
                <Input
                  required
                  placeholder=''
                  name='state'
                  value={experience?.state ?? ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label className='text-sm' >Start Date</Label>
                <Input
                  required
                  placeholder=''
                  name='startDate'
                  type='date'
                  value={experience?.startDate ?? ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label className='text-sm' >End Date</Label>
                <Input
                  placeholder=''
                  name='endDate'
                  type='date'
                  value={experience?.endDate ?? ''}
                  onChange={handleChange}
                  disabled={
                    isCurrentlyWorking
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="checkbox"
                  name='currentlyWorking'
                  className="w-4 h-4"
                  checked={experience?.currentlyWorking}
                  onChange={handleChange}
                />
                <Label className="text-sm">
                  Currently Working
                </Label>
              </div>
            </div>
            <div className='my-5'>
              <Label className='text-sm' >Work Summary</Label>
              <JoditEditor
                ref={editor}
                value={content}
                onBlur={newContent => setContent(newContent)}
                onChange={newContent => { }}
                config={config}
              />
            </div>
            <Button
              disabled={
                isPending || resumeInfo?.status === 'archived' ? true : false
              }
              className=' dark:text-white ' type='submit'>
              {isPending && <LoaderCircle className='animate-spin' size='15px' />}
              Add
            </Button>
          </form>
        </>
      ) : (
        <div className='bg-primary/5 p-2 border border-primary rounded-lg' >
          <div className='w-full' >
            <h5 className='font-bold text-lg' >Edit Experience</h5>
          </div>
          <form onSubmit={handleEditSubmit} >
            <div className=' grid grid-cols-2 gap-3' >
              <div>
                <Label className='text-sm' >Position Title</Label>
                <Input
                  required
                  placeholder=''
                  name='title'
                  value={experience?.title ?? ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label className='text-sm' >Company Name</Label>
                <Input
                  required
                  placeholder=''
                  name='companyName'
                  value={experience?.companyName ?? ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label className='text-sm' >City</Label>
                <Input
                  required
                  placeholder=''
                  name='city'
                  value={experience?.city ?? ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label className='text-sm' >State</Label>
                <Input
                  required
                  placeholder=''
                  name='state'
                  value={experience?.state ?? ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label className='text-sm' >Start Date</Label>
                <Input
                  required
                  placeholder=''
                  name='startDate'
                  type='date'
                  value={experience?.startDate ?? ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label className='text-sm' >End Date</Label>
                <Input
                  placeholder=''
                  name='endDate'
                  type='date'
                  value={experience?.endDate ?? ''}
                  onChange={handleChange}
                  disabled={
                    isCurrentlyWorking
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="checkbox"
                  name='currentlyWorking'
                  className="w-4 h-4"
                  checked={experience?.currentlyWorking}
                  onChange={handleChange}
                />
                <Label className="text-sm">
                  Currently Working
                </Label>
              </div>
            </div>
            <div className='my-5'>
              <Label className='text-sm' >Work Summary</Label>
              <JoditEditor
                ref={editor}
                value={content}
                onBlur={newContent => setContent(newContent)}
                onChange={newContent => { }}
                config={config}
              />
            </div>
            <div className='flex justify-start items-center gap-2' >
              <Button
                disabled={
                  isPending || resumeInfo?.status === 'archived' ? true : false
                }
                className=' dark:text-white ' type='submit'>
                {isPending && <LoaderCircle className='animate-spin' size='15px' />}
                Save Changes
              </Button>
              <Button onClick={() => {
                setIsEdit(false)
                seteditingExpId(undefined)
                setExperience(initialExperience)
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
      <div className='w-full my-5' >
        {isLoading ? (
          <div className='flex justify-center items-center gap-2' >
            <LoaderCircle className='animate-spin' size='30px' />
            <p>Fetching Experiences</p>
          </div>
        ) : (
          <>
            <div className='flex gap-1 justify-start items-center' >
              <h2 id='experiences-section' className='text-xl font-bold' >Your Experiences</h2>
              <ChevronDown />
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2  gap-3 ' >

              {data?.experiences && data?.experiences?.length > 0 ? (
                <>
                  {data?.experiences?.map((exp, index) => (
                    <div key={index} className='border p-2 my-5 rounded-lg hover:border-primary hover:shadow-sm transition-all bg-primary/5 ' >
                      <div className='flex justify-between items-center' >
                        <h5 className='font-bold text-lg' >{exp.title}</h5>
                      </div>
                      <p className='text-[15px]' >{exp.companyName}</p>
                      <div className='flex gap-3 mt-2 justify-start items-start' >
                        <Button onClick={() => handleEdit(exp as ExperienceType)} variant='outline' className="dark:text-white px-2 py-1 text-sm" >
                          <div className='flex justify-center items-center gap-1' >
                            <Pencil className=' text-primary hover:text-secondary ' size='4px' />
                            <p className='text-[12px]' >Edit</p>
                          </div>
                        </Button>
                        <Button onClick={() => {
                          setDeletingId(exp.id!)
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

export default ExperienceForm