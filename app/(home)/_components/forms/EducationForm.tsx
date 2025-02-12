import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useResumeInfoContext } from '@/context/resume-info-provider';
import useDeleteEducation from '@/features/use-delete-education';
import useGetEducations from '@/features/use-get-educations';
import useUpdateDocument from '@/features/use-update-document';
import { toast } from '@/hooks/use-toast';
import { generateThumbnail } from '@/lib/helper';
import { EducationType } from '@/types/resume.type';
import { LoaderCircle, Pencil, Sparkles, Trash2 } from 'lucide-react';
import React, { FC, useCallback, useState } from 'react';
import { chatSession } from '@/lib/gemini';

interface Prop {
    handleNext: () => void;
}

interface Summary {
    level: string;
    data: string;
}

interface Response {
    summaries: Summary[];
}

const initialEducation = {
    universityName: '',
    degree: '',
    major: '',
    startDate: '',
    endDate: '',
    description: '',
};

const EducationForm: FC<Prop> = ({ handleNext }) => {
    const { resumeInfo, onUpdate } = useResumeInfoContext();
    const { mutateAsync, isPending } = useUpdateDocument();
    const { data, isLoading, refetch } = useGetEducations();
    const { mutate, isPending: isDeletePending } = useDeleteEducation();
    const [education, setEducation] = useState<EducationType>(initialEducation);
    const educations = data?.educations ?? resumeInfo?.educations ?? [];

    const [deletingId, setDeletingId] = useState<number | undefined>(undefined);
    const [isOpen, setIsOpen] = useState(false);
    const [editingEduId, setEditingEduId] = useState<number | undefined>(undefined);
    const [isEdit, setIsEdit] = useState(false);

    const [loading, setLoading] = useState(false);
    const [aiGeneratedSummary, setAiGeneratedSummary] = useState<Response | undefined>(undefined);

    const handleEdit = useCallback((edu: EducationType) => {
        setEditingEduId(edu?.id);
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
        });
        setIsEdit(true);
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [education]);

    const handleSubmit = useCallback(async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        const updatedEducations = [...(resumeInfo?.educations ?? []), education];

        onUpdate({
            ...resumeInfo,
            educations: updatedEducations,
            title: resumeInfo?.title || 'Untitled Resume',
            status: resumeInfo?.status ?? 'private',
            summary: resumeInfo?.summary || '',
        });

        const thumbnail = await generateThumbnail();
        const currentNo = resumeInfo?.currentPosition ? resumeInfo?.currentPosition : 1;

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
                        description: 'Updated Successfully',
                    });
                    setEducation(initialEducation);
                    refetch();
                    const educationSection = document.getElementById('educations-sections');
                    if (educationSection) {
                        educationSection.scrollIntoView({ behavior: 'smooth' });
                    }
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Error in updating education',
                        variant: 'destructive',
                    });
                },
            }
        );
    }, [education, resumeInfo, onUpdate, refetch, mutateAsync]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const { name, value } = target;
        setEducation({ ...education, [name]: value });
    }, [education]);

    const handleEditSubmit = useCallback(async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        const newEducation = { ...education };
        const updatedEducations = resumeInfo?.educations?.filter((edu) => edu?.id !== editingEduId);
        const newUpdatedEducations = [...(updatedEducations ?? []), newEducation];

        onUpdate({
            ...resumeInfo,
            educations: newUpdatedEducations,
            title: resumeInfo?.title || 'Untitled Resume',
            status: resumeInfo?.status ?? 'private',
            summary: resumeInfo?.summary || '',
        });

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
                    });
                    refetch();
                    setEducation(initialEducation);
                    setIsEdit(false);

                    const educationSection = document.getElementById('educations-sections');
                    if (educationSection) {
                        educationSection.scrollIntoView({ behavior: 'smooth' });
                    }
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Error in updating education',
                        variant: 'destructive',
                    });
                },
            }
        );
    }, [education, resumeInfo, onUpdate, editingEduId, refetch, mutateAsync]);

    const handleDelete = useCallback(() => {
        if (deletingId) {
            const updatedEducations = resumeInfo?.educations?.filter((edu) => edu.id !== deletingId) ?? [];
            mutate(deletingId, {
                onSuccess: () => {
                    toast({
                        title: 'Success',
                        description: 'Deleted Successfully',
                    });
                    onUpdate({
                        ...resumeInfo,
                        educations: updatedEducations,
                        title: resumeInfo?.title || 'Untitled Resume',
                        status: resumeInfo?.status ?? 'private',
                        summary: resumeInfo?.summary || '',
                    });
                    refetch();
                    setDeletingId(undefined);
                    setIsOpen(false);
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Error in deleting experience',
                        variant: 'destructive',
                    });
                    setDeletingId(undefined);
                    setIsOpen(false);
                },
            });
        }
    }, [deletingId, resumeInfo, onUpdate, mutate, refetch]);

    const prompt = `University Name: ${education?.universityName}  
Degree: ${education?.degree}  
Major: ${education?.major}  
Start Date: ${education?.startDate}  
End Date: ${education?.endDate}  

Based on the education details, please generate concise and complete summaries in JSON format. Ensure the output contains a summaries array, where each item is an object with two fields: level and data.  

The level field represents experience levels: Fresher, Mid, or Experienced.  
The data field contains a very short summary limited to 1 to 2 lines in paragraph form, incorporating relevant coursework, achievements, and skills without any placeholders or gaps.  

Each summary should be engaging, reflect a personal tone, and highlight unique strengths and aspirations aligned with the role and industry standards.  

Example response structure:  
{
    "summaries": [
        {
            "level": "Fresher",
            "data": "Completed a Bachelor's degree in Computer Science with a focus on software development, gaining hands-on experience in Java, Python, and web technologies."
        },
        {
            "level": "Mid",
            "data": "Earned a Master's degree in Data Science, specializing in machine learning and data analysis, with projects involving real-world datasets and predictive modeling."
        },
        {
            "level": "Experienced",
            "data": "Holds a Ph.D. in Artificial Intelligence, with extensive research in neural networks and natural language processing, contributing to cutting-edge advancements in the field."
        }
    ]
} and remember ,please give 3 summaries fresher,mid and experienced`;

    const generateEducationSummary = async () => {
        try {
            if (!education.universityName || !education.degree || !education.major || !education.startDate || !education.endDate) {
                toast({
                    title: 'Error',
                    description: 'Please fill in the university name, degree, major, start date, and end date to proceed.',
                    variant: 'destructive',
                });
                return;
            }
            setLoading(true);
            const result = await chatSession.sendMessage(prompt);
            const responseText = result.response.text();
            const responseObject: Response = JSON.parse(responseText);
            setAiGeneratedSummary(responseObject);
        } catch (error) {
            console.error('Error in generateSummary: ', error);
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
        setEducation((prev) => ({ ...prev, description: summary }));
        setAiGeneratedSummary(undefined);
    };

    return (
        <div>
            {isEdit === false ? (
                <div>
                    <div>
                        <h2 className='font-bold text-lg'>Education</h2>
                        <p className='text-sm'>Enter your educational details</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className='grid grid-cols-2 gap-3'>
                            <div className='col-span-2'>
                                <Label className='text-sm'>University Name</Label>
                                <Input
                                    name='universityName'
                                    value={education?.universityName}
                                    required
                                    placeholder=''
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label className='text-sm'>Degree</Label>
                                <Input
                                    name='degree'
                                    value={education?.degree}
                                    required
                                    placeholder=''
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label className='text-sm'>Major</Label>
                                <Input
                                    name='major'
                                    value={education?.major}
                                    required
                                    placeholder=''
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label className='text-sm'>Start Date</Label>
                                <Input
                                    name='startDate'
                                    required
                                    value={education?.startDate}
                                    placeholder=''
                                    type='date'
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label className='text-sm'>End Date</Label>
                                <Input
                                    name='endDate'
                                    value={education?.endDate}
                                    required
                                    placeholder=''
                                    type='date'
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='col-span-2'>
                                <Label className='text-sm'>Description</Label>
                                <Textarea
                                    name='description'
                                    required
                                    value={education?.description}
                                    className='dark:border-gray-800 min-h-36'
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={generateEducationSummary}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <LoaderCircle className='animate-spin' size='15px' />
                                    ) : (
                                        <Sparkles className='text-primary' size='15px' />
                                    )}
                                    Generate with AI
                                </Button>
                            </div>
                            {aiGeneratedSummary && (
                                <div className='col-span-2'>
                                    <div className='flex flex-col gap-3'>
                                        {aiGeneratedSummary.summaries.map((summary, index) => (
                                            <div
                                                key={index}
                                                className='border p-4 rounded-lg cursor-pointer hover:border-primary hover:shadow-sm transition-all bg-primary/5'
                                                onClick={() => handleSummarySelect(summary.data)}
                                            >
                                                <h5 className='font-bold text-lg'>{summary.level}</h5>
                                                <p className='text-sm'>{summary.data}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <Button type='submit' className='mt-2 dark:text-white'>
                            {isPending && <LoaderCircle className='animate-spin' size='15px' />}
                            Add
                        </Button>
                    </form>
                </div>
            ) : (
                <div className='p-2 border rounded-lg'>
                    <div className='w-full'>
                        <h2 className='font-bold text-lg'>Edit Education</h2>
                    </div>
                    <form onSubmit={handleEditSubmit}>
                        <div className='grid grid-cols-2 gap-3'>
                            <div className='col-span-2'>
                                <Label className='text-sm'>University Name</Label>
                                <Input
                                    name='universityName'
                                    value={education?.universityName}
                                    required
                                    placeholder=''
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label className='text-sm'>Degree</Label>
                                <Input
                                    name='degree'
                                    value={education?.degree}
                                    required
                                    placeholder=''
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label className='text-sm'>Major</Label>
                                <Input
                                    name='major'
                                    value={education?.major}
                                    required
                                    placeholder=''
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label className='text-sm'>Start Date</Label>
                                <Input
                                    name='startDate'
                                    required
                                    value={education?.startDate}
                                    placeholder=''
                                    type='date'
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label className='text-sm'>End Date</Label>
                                <Input
                                    name='endDate'
                                    value={education?.endDate}
                                    required
                                    placeholder=''
                                    type='date'
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='col-span-2'>
                                <Label className='text-sm'>Description</Label>
                                <Textarea
                                    name='description'
                                    required
                                    value={education?.description}
                                    className='dark:border-gray-800 min-h-28'
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={generateEducationSummary}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <LoaderCircle className='animate-spin' size='15px' />
                                    ) : (
                                        <Sparkles className='text-primary' size='15px' />
                                    )}
                                    Generate with AI
                                </Button>
                            </div>
                            {aiGeneratedSummary && (
                                <div className='col-span-2'>
                                    <div className='flex flex-col gap-3'>
                                        {aiGeneratedSummary.summaries.map((summary, index) => (
                                            <div
                                                key={index}
                                                className='border p-4 rounded-lg cursor-pointer hover:border-primary hover:shadow-sm transition-all bg-primary/5'
                                                onClick={() => handleSummarySelect(summary.data)}
                                            >
                                                <h5 className='font-bold text-lg'>{summary.level}</h5>
                                                <p className='text-sm'>{summary.data}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='flex justify-start items-center gap-2 mt-2'>
                            <Button
                                type='submit'
                                disabled={isPending || resumeInfo?.status === 'archived'}
                            >
                                {isPending && <LoaderCircle className='animate-spin' size='15px' />}
                                Update Education
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsEdit(false);
                                    setEditingEduId(undefined);
                                    setEducation(initialEducation);
                                    window.scrollTo({
                                        top: 0,
                                        behavior: 'smooth',
                                    });
                                }}
                                type='button'
                                variant='destructive'
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            )}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className='rounded-lg mx-auto max-w-sm'>
                    <DialogTitle>Are you sure you want to delete this experience?</DialogTitle>
                    <DialogDescription>This action cannot be undone.</DialogDescription>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleDelete} variant='destructive'>
                            {isDeletePending && <LoaderCircle className='animate-spin' />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className='my-5 w-full'>
                {isLoading ? (
                    <div>
                        <div className='flex justify-center items-center gap-2'>
                            <LoaderCircle className='animate-spin' size='30px' />
                            <p>Fetching Educations</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 id='educations-sections' className='font-bold text-xl'>Your Educations</h2>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
                            {data?.educations && data?.educations?.length > 0 ? (
                                <>
                                    {data?.educations?.map((edu, index) => (
                                        <div key={index} className='border p-2 my-5 rounded-lg hover:border-primary hover:shadow-sm transition-all bg-primary/5'>
                                            <div className='flex justify-between items-center'>
                                                <h5 className='font-bold text-lg'>{edu?.universityName}</h5>
                                            </div>
                                            <p className='text-[15px]'>{edu?.degree}, {edu?.major}</p>
                                            <div className='flex gap-3 mt-2 justify-start items-start'>
                                                <Button onClick={() => handleEdit(edu as EducationType)} variant='outline' className='dark:text-white px-2 py-1 text-sm'>
                                                    <div className='flex justify-center items-center gap-1'>
                                                        <Pencil className='text-[12px]' />
                                                        Edit
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