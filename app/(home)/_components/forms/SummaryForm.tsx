'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useResumeInfoContext } from '@/context/resume-info-provider'
import useUpdateDocument from '@/features/use-update-document'
import { toast } from '@/hooks/use-toast'
import { chatSession } from '@/lib/gemini'
import { generateThumbnail } from '@/lib/helper'
import { ResumeDataType } from '@/types/resume.type'
import { LoaderCircle, Sparkles, Text } from 'lucide-react'
import React, { FC, useState } from 'react'

interface Prop {
    handleNext: () => void,
}

interface Summary {
    level: string;
    data: string;
}


interface Response {
    summaries: Summary[];
}



const SummaryForm: FC<Prop> = ({
    handleNext,
}) => {
    const { resumeInfo, onUpdate } = useResumeInfoContext()
    const [summary, setSummary] = useState(resumeInfo?.summary || '')
    const { mutateAsync, isPending } = useUpdateDocument()

    const prompt = `Job Title: ${resumeInfo?.personalInfo?.jobTitle}. Based on the job title, please generate concise and complete summaries for my resume in JSON format. Ensure the output contains a summaries array, where each item is an object with two fields:level and data.The level field represents experience levels: Fresher, Mid, or Experienced.
    The data field contains a very short summary limited to 1 to 2 line in paragraph form, incorporating relevant programming languages, technologies, frameworks, and methodologies without any placeholders or gaps.Each summary should be engaging, reflect a personal tone, and highlight unique strengths and aspirations aligned with the role and industry standards.
    Example response structure:
    {
    "summaries": [
        {
        "level": "Fresher",
        "data": "A highly motivated graduate skilled in JavaScript, React, and RESTful APIs, eager to contribute to innovative projects."
        },
        {
        "level": "Mid",
        "data": "A result-driven developer with 3+ years of experience in full-stack development, specializing in Node.js, TypeScript, and cloud deployment."
        },
        {
        "level": "Experienced",
        "data": "A seasoned software engineer with over 8 years of expertise in scalable system design, microservices, and DevOps practices, committed to leadership and mentorship."
        }
    ]
    }
    Please adhere to this blueprint and ensure no additional text is returned beyond the JSON response.
`

    const [loading, setLoading] = useState(false)
    const [aiGeneratedSummary, setAiGeneratedSummary] = useState<Response | undefined>(undefined)

    const handleSummary = (newAiSummary: string) => {
        setSummary(newAiSummary);
        const data = resumeInfo as ResumeDataType;
        onUpdate({
            ...data,
            summary: newAiSummary
        })
        setAiGeneratedSummary(undefined)
    }
    const generateSummary = async () => {
        try {
            setLoading(true)
            const result = await chatSession.sendMessage(prompt);
            const responseText = result.response.text()
            const responseObject: Response = JSON?.parse(responseText)
            console.log("Response object : ", responseObject);

            setAiGeneratedSummary(responseObject)
        } catch (error) {
            console.log("Error in generateSummary : ", error);
            throw new Error('Something wrong happened in generateSummary function')
        }
        finally {
            setLoading(false)
        }
    }

    const handleChange = (e: { target: { value: string } }) => {
        const newSummary = e.target.value;
        setSummary(newSummary)
        const data = resumeInfo as ResumeDataType;
        onUpdate({
            ...data,
            summary: newSummary
        })
    }
    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault()

        const thumbnail = await generateThumbnail();
        const currentNo = resumeInfo?.currentPosition ? resumeInfo?.currentPosition + 1 : 1;

        await mutateAsync(
            {
                thumbnail: thumbnail,
                summary: resumeInfo?.summary,
                currentPosition: currentNo,
            },
            {
                onSuccess: () => {
                    toast({
                        title: 'Success',
                        description: 'Updated Summary Successfully'
                    })
                    handleNext();
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed in updating summary',
                        variant: 'destructive',
                    })
                }
            }
        )
    }
    return (
        <div className='w-full' >
            <div className='w-full' >
                <div className='flex items-center gap-2' >
                    <h2 className='font-bold text-lg' >Summary</h2>
                    <span><Text className='text-blue-600 mt-1' size='20' /></span>
                </div>
                <p className='text-sm' >Provide a description that highlights your skills, experience, and professional goals</p>
            </div>
            <div>
                <form onSubmit={handleSubmit} >
                    <div className='flex items-center justify-between mt-1' >
                        <Label>Add Summary</Label>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={generateSummary}
                            disabled={
                                loading === true || resumeInfo?.status === 'archived'
                            }
                        >
                            {loading === true ? (
                                <LoaderCircle className='animate-spin' size='15px' />
                            ) : <Sparkles className='text-primary' size='15px' />}
                            Generate with AI
                        </Button>
                    </div>
                    <div>
                        <Textarea
                            className='mt-5 dark:border-gray-800 min-h-36'
                            required
                            value={summary || ''}
                            onChange={handleChange}
                        />
                        {aiGeneratedSummary?.summaries.length !== undefined && aiGeneratedSummary?.summaries?.length > 0 && aiGeneratedSummary && (
                            <div className="w-full">
                                <h5 className="font-medium text-[15px] my-4">Suggestions</h5>
                                {aiGeneratedSummary?.summaries.map((summary, index) => (
                                    <Card
                                        role="button"
                                        onClick={() => handleSummary(summary.data)}
                                        className="my-4 shadow-none bg-primary/5 border-primary/30"
                                        key={index}
                                    >
                                        <div className='w-full'>
                                            <CardHeader className="py-2">
                                                <CardTitle className="font-semibold text-md">{summary.level}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm">{summary.data}</p>
                                            </CardContent>
                                        </div>
                                    </Card>
                                ))}

                            </div>
                        )}

                    </div>
                    <Button
                        disabled={
                            isPending || resumeInfo?.status === 'archived' ? true : false
                        }
                        className='mt-4 dark:text-white ' type='submit'>
                        {isPending && <LoaderCircle className='animate-spin' size='15px' />}
                        Save Changes
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default SummaryForm