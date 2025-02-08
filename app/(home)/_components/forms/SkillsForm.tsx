import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResumeInfoContext } from '@/context/resume-info-provider';
import useUpdateDocument from '@/features/use-update-document';
import { toast } from '@/hooks/use-toast';
import { generateThumbnail } from '@/lib/helper';
import { SkillType } from '@/types/resume.type';
import { LoaderCircle, Star, X } from 'lucide-react';
import React, { FC, useCallback, useEffect, useState } from 'react';

interface Props {
    handleNext: () => void;
}

const SkillsForm: FC<Props> = ({ handleNext }) => {
    const { resumeInfo, onUpdate } = useResumeInfoContext();
    const { mutateAsync, isPending } = useUpdateDocument();
    const [skillName, setSkillName] = useState('');
    const [skillRating, setSkillRating] = useState(0);
    const [tempSkills, setTempSkills] = useState<SkillType[]>([]);

    // Load existing skills from the database when the form loads
    useEffect(() => {
        if (resumeInfo?.skills) {
            setTempSkills(resumeInfo.skills);
        }
    }, [resumeInfo?.skills]);

    // Handle star rating selection and automatically add the skill
    const handleRating = useCallback(
        (rating: number) => {
            setSkillRating(rating);
            if (skillName.trim() && rating > 0) {
                const newSkill = {
                    name: skillName,
                    rating: rating,
                    id: Date.now(), // Temporary ID for local use
                };
                setTempSkills((prev) => [...prev, newSkill]);
                setSkillName('');
                setSkillRating(0);
            }
        },
        [skillName]
    );

    // Remove skill from the temporary list
    const handleRemoveSkill = useCallback((id: number) => {
        setTempSkills((prev) => prev.filter((skill) => skill.id !== id));
    }, []);

    // Save all skills to the database
    const handleSaveChanges = useCallback(async () => {
        if (tempSkills.length === 0) {
            toast({
                title: 'Error',
                description: 'No skills to save.',
                variant: 'destructive',
            });
            return;
        }

        const thumbnail = await generateThumbnail();
        const currentNo = resumeInfo?.currentPosition || 1;

        try {
            await mutateAsync(
                {
                    skills: tempSkills,
                    thumbnail,
                    currentPosition: currentNo,
                },
                {
                    onSuccess: () => {
                        onUpdate({
                            ...resumeInfo,
                            skills: tempSkills,
                            title: resumeInfo?.title || 'Untitled Resume',
                            status: resumeInfo?.status ?? 'private',
                            summary: resumeInfo?.summary || '',
                        });

                        toast({
                            title: 'Success',
                            description: 'Skills saved successfully.',
                        });
                    },
                    onError: () => {
                        toast({
                            title: 'Error',
                            description: 'Failed to save skills. Please try again.',
                            variant: 'destructive',
                        });
                    },
                }
            );
        } catch (error) {
            toast({
                title: 'Error',
                description: 'An unexpected error occurred. Please try again.',
                variant: 'destructive',
            });
        }
    }, [tempSkills, resumeInfo, onUpdate, mutateAsync]);

    return (
        <div className="space-y-6">
            <div className='w-full'>
                <h2 className='font-bold text-lg'>Skills</h2>
                <p className='text-sm'>Add skills</p>
            </div>
            {/* Skill Cards Grid */}
            <div  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {tempSkills.map((skill) => (
                    <div
                        key={skill.id}
                        className="group flex flex-col justify-between items-center p-2 border rounded-lg bg-primary/5 hover:shadow-sm transition-all relative"
                    >
                        {/* Skill Name and Cross Icon */}
                        <div className="flex justify-between items-center w-full">
                            <span className="text-sm font-medium">{skill.name}</span>
                            <button
                                onClick={() => handleRemoveSkill(skill.id!)}
                                className="text-red-500 hover:text-red-600 focus:outline-none"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {/* Star Rating on Hover */}
                        <div className="w-full">
                            <div className="flex gap-1 justify-start mt-1">
                                {[...Array(5)].map((_, index) => (
                                    <Star
                                        key={index}
                                        size={14}
                                        className={
                                            index < skill.rating!
                                                ? 'text-[#FFD700] fill-[#FFD700]' // Bright yellow color
                                                : 'text-gray-300'
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Skill Input and Rating */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <Label>Skill Name</Label>
                    <Input
                        placeholder="Enter a skill"
                        value={skillName}
                        onChange={(e) => setSkillName(e.target.value)}
                    />
                </div>
                <div>
                    <Label>Rating</Label>
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleRating(index + 1)}
                                className="focus:outline-none"
                            >
                                <Star
                                    size={20}
                                    className={
                                        index < skillRating
                                            ? 'text-[#FFD700] fill-[#FFD700] hover:text-[#FFC800]' // Bright yellow color
                                            : 'text-gray-300 hover:text-[#FFD700]'
                                    }
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Save Changes Button */}
            <div className="mt-6">
                <Button
                    onClick={handleSaveChanges}
                    disabled={isPending || tempSkills.length === 0}
                    className="w-full"
                >
                    {isPending && <LoaderCircle className="animate-spin mr-2" size={16} />}
                    Save Changes
                </Button>
            </div>
        </div>
    );
};

export default React.memo(SkillsForm);