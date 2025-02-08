import SkeletonLoader from '@/components/SkeletonLoader';
import { Skeleton } from '@/components/ui/skeleton';
import { ResumeDataType } from '@/types/resume.type';
import React, { FC } from 'react';

interface Props {
    resumeInfo: ResumeDataType | undefined;
    isLoading: boolean;
}

const SkillsPreview: FC<Props> = ({ resumeInfo, isLoading }) => {
    if (isLoading) {
        return <SkeletonLoader />;
    }

    return (
        <div className="w-full my-0">
            {/* Title */}
            <h5
                style={{ color: resumeInfo?.themeColor ?? 'inherit' }}
                className="text-center font-bold text-sm my-0"
            >
                Skills
            </h5>
            <hr
                style={{ borderColor: resumeInfo?.themeColor ?? 'inherit' }}
                className="border-[0.5px] my-2"
            />

            {/* Skills Grid */}
            <div id='skillId' className="grid grid-cols-2 lg:grid-cols-3 gap-3 pt-1 my-0 mx-0">
                {resumeInfo?.skills?.map((skill, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center gap-2"
                    >
                        {/* Skill Name */}
                        <h5 className="text-[13px] flex-1 truncate">{skill?.name}</h5>

                        {/* Skill Bar */}
                        {skill?.name && skill?.rating && (
                            <div className="flex-1 min-w-[60px]">
                                <div className="bg-gray-200 w-full h-2">
                                    <div
                                        className="h-2"
                                        style={{
                                            backgroundColor: resumeInfo?.themeColor ?? 'inherit',
                                            width: `${(skill?.rating / 5) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillsPreview;