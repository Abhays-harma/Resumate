'use client'

import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit2, LoaderCircle, Pencil, Trash2 } from 'lucide-react';
import { useResumeInfoContext } from '@/context/resume-info-provider';
import { ProjectType } from '@/types/resume.type';
import { generateThumbnail } from '@/lib/helper';
import useUpdateDocument from '@/features/use-update-document';
import { toast } from '@/hooks/use-toast';
import useGetProjects from '@/features/use-get-projects';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  handleNext?: () => void;
}

const ProjectForm: React.FC<Props> = ({ handleNext }) => {
  const [isPending, setIsPending] = useState(false);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');

  const { resumeInfo, onUpdate } = useResumeInfoContext()
  const { mutateAsync, isPending: isUpdatePending } = useUpdateDocument()
  const { data, refetch, isLoading } = useGetProjects()

  const initialProject: ProjectType = {
    id: undefined,
    title: '',
    organization: '',
    description: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    technologies: [],
    projectLink: ''
  }

  const [project, setProject] = useState<ProjectType>(initialProject)
  const projects = resumeInfo?.projects
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement
    const { name, value, type } = target
    const checked = ("checked" in target) ? target.checked : false;
    if (name === 'currentlyWorking') {
      setIsCurrentlyWorking(checked)
    }

    setProject({ ...project, [name]: type === 'checkbox' ? checked : value })
  }, [project, isCurrentlyWorking])

  const handleAddTechnology = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && techInput.trim() !== '') {
      e.preventDefault();
      if (!technologies.includes(techInput.trim())) {
        setTechnologies([...technologies, techInput.trim()]);
      }
      setTechInput('');
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const newProject = { ...project, technologies: technologies }
    console.log("project is : ", newProject);

    const updatedProjects = [...(resumeInfo?.projects ?? []), newProject];

    onUpdate({
      ...resumeInfo,
      projects: updatedProjects,
      title: resumeInfo?.title || 'Untitled Resume',
      status: resumeInfo?.status ?? 'private',
      summary: resumeInfo?.summary || '',
    })

    const thumbnail = await generateThumbnail()
    const currentNo = resumeInfo?.currentPosition ? resumeInfo?.currentPosition + 1 : 1

    await mutateAsync(
      {
        thumbnail: thumbnail,
        currentPosition: currentNo,
        projects: updatedProjects,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Updated project successfully',
          })
          setProject(initialProject)
          refetch();
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Error in updating project',
            variant: 'destructive'
          })
        }
      }
    )

  }, [project, resumeInfo, onUpdate, projects, refetch]);

  return (
    <div className='flex flex-col gap-2' >
      <div>
        <div className='w-full'>
          <h2 className='font-bold text-lg'>Project Details</h2>
          <p className='text-sm'>Add information about your projects</p>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-2 gap-3 mt-5'>
              <div>
                <Label className='text-sm'>Project Title</Label>
                <Input value={project?.title ?? ''}
                  onChange={handleChange} name='title' required autoComplete='off' />
              </div>
              <div>
                <Label className='text-sm'>Organization/Client</Label>
                <Input value={project?.organization ?? ''} onChange={handleChange} name='organization' required autoComplete='off' />
              </div>
              <div>
                <Label className='text-sm'>Start Date</Label>
                <Input value={project?.startDate ?? ''} onChange={handleChange} type="date" name='startDate' required autoComplete='off' />
              </div>
              <div>
                <Label className='text-sm'>End Date</Label>
                <Input disabled={isCurrentlyWorking} value={project?.endDate ?? ''} onChange={handleChange} type="date" name='endDate' autoComplete='off' />
              </div>
              <div className='col-span-2'>
                <div className="flex items-center space-x-2 mb-3">
                  <Input
                    type="checkbox"
                    name='currentlyWorking'
                    className="w-4 h-4"
                    checked={project?.currentlyWorking}
                    onChange={handleChange}
                  />
                  <Label htmlFor="currentProject" className="text-sm">
                    Currently Working
                  </Label>
                </div>
              </div>
              <div className='col-span-2'>
                <Label className='text-sm'>Technologies Used</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {technologies.map((tech, index) => (
                    <span key={index} className="bg-gray-200 dark:bg-gray-700 text-sm px-2 py-1 rounded flex items-center space-x-2">
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTechnology(tech)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ❌
                      </button>
                    </span>
                  ))}
                </div>
                <Input
                  name='technologies'
                  placeholder='Type technology and press ENTER'
                  autoComplete='off'
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleAddTechnology}
                />
              </div>
              <div className='col-span-2'>
                <Label className='text-sm'>Project Description</Label>
                <Textarea
                  className='mt-5 dark:border-gray-800 min-h-36'
                  required
                  value={project?.description ?? ''}
                  onChange={handleChange}
                  name='description'
                />
              </div>
              <div className='col-span-2'>
                <Label className='text-sm'>Project URL</Label>
                <Input value={project?.projectLink ?? ''} onChange={handleChange} name='projectLink' type="url" placeholder='https://...' autoComplete='off' />
              </div>
            </div>
            <Button disabled={isPending} className='mt-4 dark:text-white' type='submit'>
              {isUpdatePending && <LoaderCircle className='animate-spin' size='15px' />}
              Add
            </Button>
          </form>
        </div>
      </div>
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">Your Projects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resumeInfo?.projects?.map((project, index) => (
            <div style={{ backgroundColor: `${resumeInfo?.themeColor}20`, }} key={index} className="bg-white rounded-lg shadow p-4">
              <div className="mb-2">
                <span className="font-medium">{project.title}</span>
                <span className="mx-2">•</span>
                <span className="text-gray-600">{project.organization}</span>
              </div>
              <div className="flex gap-2">
                <Button variant='outline' className="dark:text-white px-2 py-1 text-sm" >
                  <div className='flex justify-center items-center gap-1' >
                    <Pencil className=' text-primary hover:text-secondary ' size='4px' />
                    <p className='text-[12px]' >Edit</p>
                  </div>
                </Button>
                <Button
                  variant="outline" className="dark:text-white px-1 py-1 text-[10px]" >
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
        </div>

        {resumeInfo?.projects?.length === 0 && (
          <div className="text-gray-500 text-center py-4">
            No projects added yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectForm;
