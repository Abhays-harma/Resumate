import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, LoaderCircle, Pencil, Sparkles, Trash2 } from 'lucide-react';
import { useResumeInfoContext } from '@/context/resume-info-provider';
import { ProjectType } from '@/types/resume.type';
import { generateThumbnail } from '@/lib/helper';
import useUpdateDocument from '@/features/use-update-document';
import { toast } from '@/hooks/use-toast';
import useGetProjects from '@/features/use-get-projects';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import useDeleteProject from '@/features/use-delete-project';
import { chatSession } from '@/lib/gemini';

interface Props {
  handleNext?: () => void;
}

interface Summary {
  level: string;
  data: string;
}

interface Response {
  summaries: Summary[];
}

const ProjectForm: React.FC<Props> = ({ handleNext }) => {
  const { resumeInfo, onUpdate } = useResumeInfoContext();
  const { mutateAsync, isPending: isUpdatePending } = useUpdateDocument();
  const { data, refetch, isLoading } = useGetProjects();
  const { mutate: deleteProject, isPending: isDeletePending } = useDeleteProject();

  const [isOpen, setIsOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | undefined>(undefined);

  const initialProject: ProjectType = {
    id: undefined,
    title: '',
    organization: '',
    description: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    technologies: [],
    projectLink: '',
  };

  const [project, setProject] = useState<ProjectType>(initialProject);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [aiGeneratedSummary, setaiGeneratedSummary] = useState<Response | undefined>(undefined);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    const checked = ("checked" in target) ? target.checked : false;

    if (name === 'currentlyWorking') {
      setProject((prev) => ({ ...prev, [name]: checked }));
    } else {
      setProject((prev) => ({ ...prev, [name]: value || '' }));
    }
  }, []);

  const handleAddTechnology = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && techInput.trim() !== '') {
      e.preventDefault();
      if (!technologies.includes(techInput.trim())) {
        setTechnologies((prev) => [...prev, techInput.trim()]);
      }
      setTechInput('');
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setTechnologies((prev) => prev.filter((t) => t !== tech));
  };

  const handleEdit = (project: ProjectType) => {
    setEditingProjectId(project.id);
    setProject({
      ...project,
      title: project.title || '',
      organization: project.organization || '',
      description: project.description || '',
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      projectLink: project.projectLink || '',
    });
    setTechnologies(project.technologies || []);
    setIsEdit(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const newProject = { ...project, technologies };

    const updatedProjects = [...(resumeInfo?.projects ?? []), newProject];

    const thumbnail = await generateThumbnail();
    const currentNo = resumeInfo?.currentPosition ? resumeInfo.currentPosition : 1;

    await mutateAsync(
      {
        projects: updatedProjects,
        thumbnail: thumbnail,
        currentPosition: currentNo,
      },
      {
        onSuccess: () => {
          onUpdate({
            ...resumeInfo,
            projects: updatedProjects,
            title: resumeInfo?.title || 'Untitled Resume',
            status: resumeInfo?.status ?? 'private',
            summary: resumeInfo?.summary || '',
          });
          toast({
            title: 'Success',
            description: isEdit ? 'Project updated successfully' : 'Project added successfully',
          });
          setProject(initialProject);
          setTechnologies([]);
          setIsEdit(false);
          refetch();
        },
        onError: () => {
          toast({
            title: 'Error',
            description: isEdit ? 'Error updating project' : 'Error adding project',
            variant: 'destructive',
          });
        },
      }
    );
  }, [project, technologies, resumeInfo, isEdit, editingProjectId, onUpdate, mutateAsync, refetch]);

  const handleDelete = useCallback(() => {
    if (deletingId) {
      const updatedProjects = resumeInfo?.projects?.filter((p) => p.id !== deletingId) || [];
      deleteProject(deletingId, {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Project deleted successfully',
          });
          onUpdate({
            ...resumeInfo,
            projects: updatedProjects,
            title: resumeInfo?.title || 'Untitled Resume',
            status: resumeInfo?.status ?? 'private',
            summary: resumeInfo?.summary || '',
          });
          refetch();
          setDeletingId(null);
          setIsOpen(false);
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Error deleting project',
            variant: 'destructive',
          });
          setDeletingId(null);
          setIsOpen(false);
        },
      });
    }
  }, [deletingId, resumeInfo, onUpdate, deleteProject, refetch]);

  const prompt = `Project Title: ${project?.title}  
Organization: ${project?.organization}  
Start Date: ${project?.startDate}  
End Date: ${project?.currentlyWorking ? "Present" : project?.endDate}
Technologies:${technologies}  

Based on the project details, please generate concise and complete summaries in JSON format. Ensure the output contains a summaries array, where each item is an object with two fields: level and data.  

The level field represents experience levels: Fresher, Mid, or Experienced.  
The data field contains a very short summary limited to 1 to 2 lines in paragraph form, incorporating relevant programming languages, technologies, frameworks, and methodologies without any placeholders or gaps.  

Each summary should be engaging, reflect a personal tone, and highlight unique strengths and aspirations aligned with the role and industry standards.  

Example response structure:  
{
    "summaries": [
        {
            "level": "Fresher",
            "data": "Developed a dynamic web application using React and Firebase, demonstrating strong front-end development skills and API integration."
        },
        {
            "level": "Mid",
            "data": "Led the backend development of a scalable platform using Node.js, PostgreSQL, and Redis, optimizing performance and security."
        },
        {
            "level": "Experienced",
            "data": "Architected a high-traffic enterprise solution leveraging microservices, Kubernetes, and cloud infrastructure, enhancing system reliability."
        }
    ]
}`;

  const generateProjectSummary = async () => {
    try {
      if (!project.title || !project.organization || !project.startDate || !project.endDate) {
        toast({
          title: 'Error',
          description: 'Please fill in the title, organization, start date, and end date to proceed.',
          variant: 'destructive',
        });
        return;
      }
      setLoading(true);
      const result = await chatSession.sendMessage(prompt);
      const responseText = result.response.text();
      const responseObject: Response = JSON.parse(responseText);
      setaiGeneratedSummary(responseObject);
    } catch (error) {
      console.error("Error in generateSummary: ", error);
      toast({
        title: 'Error',
        description: 'Something went wrong while generating the summary.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSummarySelect = (summary: string) => {
    setProject((prev) => ({ ...prev, description: summary }));
    setaiGeneratedSummary(undefined);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-bold text-lg">Project Details</h2>
        <p className="text-sm">Add information about your projects</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div>
            <Label className="text-sm">Project Title</Label>
            <Input
              value={project.title}
              onChange={handleChange}
              name="title"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <Label className="text-sm">Organization/Client</Label>
            <Input
              value={project.organization}
              onChange={handleChange}
              name="organization"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <Label className="text-sm">Start Date</Label>
            <Input
              value={project.startDate}
              onChange={handleChange}
              type="date"
              name="startDate"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <Label className="text-sm">End Date</Label>
            <Input
              value={project.endDate}
              onChange={handleChange}
              type="date"
              name="endDate"
              disabled={project.currentlyWorking}
              autoComplete="off"
            />
          </div>
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-3">
              <Input
                type="checkbox"
                name="currentlyWorking"
                className="w-4 h-4"
                checked={project.currentlyWorking}
                onChange={handleChange}
              />
              <Label className="text-sm">Currently Working</Label>
            </div>
          </div>
          <div className="col-span-2">
            <Label className="text-sm">Technologies Used</Label>
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
              placeholder="Type technology and press ENTER"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={handleAddTechnology}
            />
          </div>
          <div className="col-span-2">
            <Label className="text-sm">Project Description</Label>
            <Textarea
              value={project.description}
              onChange={handleChange}
              name="description"
              required
              className="min-h-36"
            />
          </div>
          <div>
            <Button
              type='button'
              variant='outline'
              onClick={generateProjectSummary}
              disabled={loading}
            >
              {loading ? (
                <LoaderCircle className="animate-spin" size="15px" />
              ) : (
                <Sparkles className="text-primary" size="15px" />
              )}
              Generate with AI
            </Button>
          </div>
          {aiGeneratedSummary && (
            <div className="col-span-2">
              <div className="flex flex-col gap-3">
                {aiGeneratedSummary.summaries.map((summary, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded-lg cursor-pointer hover:border-primary hover:shadow-sm transition-all bg-primary/5"
                    onClick={() => handleSummarySelect(summary.data)}
                  >
                    <h5 className="font-bold text-lg">{summary.level}</h5>
                    <p className="text-sm">{summary.data}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="col-span-2">
            <Label className="text-sm">Project URL</Label>
            <Input
              value={project.projectLink}
              onChange={handleChange}
              name="projectLink"
              type="url"
              placeholder="https://..."
              autoComplete="off"
            />
          </div>
        </div>
        <Button disabled={isUpdatePending} className="mt-4 dark:text-white" type="submit">
          {isUpdatePending && <LoaderCircle className="animate-spin" size="15px" />}
          {isEdit ? 'Update Project' : 'Add'}
        </Button>
        {isEdit && (
          <Button
            type="button"
            variant="destructive"
            className="mt-4 ml-2"
            onClick={() => {
              setIsEdit(false);
              setProject(initialProject);
              setTechnologies([]);
            }}
          >
            Cancel
          </Button>
        )}
      </form>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-lg mx-auto max-w-sm">
          <DialogTitle>Are you sure you want to delete this project?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              {isDeletePending && <LoaderCircle className="animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className='w-full my-5'>
        {isLoading ? (
          <div className='flex justify-center items-center gap-2'>
            <LoaderCircle className='animate-spin' size='30px' />
            <p>Fetching Projects</p>
          </div>
        ) : (
          <>
            <div className='flex gap-1 justify-start items-center'>
              <h2 id='experiences-section' className='text-xl font-bold'>Your Projects</h2>
              <ChevronDown />
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
              {data?.projects && data?.projects?.length > 0 ? (
                <>
                  {data?.projects?.map((project, index) => (
                    <div key={index} className="border p-4 rounded-lg hover:border-primary hover:shadow-sm transition-all bg-primary/5">
                      <div className="flex justify-between items-center">
                        <h5 className="font-bold text-lg">{project.title}</h5>
                      </div>
                      <p className="text-sm">{project.organization}</p>
                      <div className="flex gap-2 mt-2">
                        <Button onClick={() => handleEdit(project as ProjectType)} variant="outline" className="dark:text-white px-2 py-1 text-sm">
                          <Pencil className="text-primary hover:text-secondary" size="16px" />
                          <span className="ml-1">Edit</span>
                        </Button>
                        <Button
                          onClick={() => {
                            setDeletingId(project.id!);
                            setIsOpen(true);
                          }}
                          variant="outline"
                          className="dark:text-white px-2 py-1 text-sm"
                        >
                          <Trash2 className="text-rose-600 hover:text-rose-500" size="16px" />
                          <span className="ml-1">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div>
                    <p className='text-sm'>No projects to show...</p>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectForm;