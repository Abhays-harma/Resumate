import { ResumeDataType } from '@/types/resume.type';
import React, { FC } from 'react';

interface Props {
    resumeInfo: ResumeDataType | undefined;
}

const SkillsPreview: FC<Props> = ({ resumeInfo }) => {
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
                className="border-[0.5px] my-1"
            />

            {/* Skills Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 pt-1 my-0 mx-0">
                {resumeInfo?.skills?.map((skill, index) => (
                    <div
                        key={index}
                        className="flex justify-between lg:justify-center gap-2 items-center"

                    >
                        {/* Skill Name */}
                        <h5 className="text-[13px]">{skill?.name}</h5>

                        {/* Skill Bar */}
                        {skill?.name && skill?.rating && (
                            <div className="bg-gray-200 w-[60px]">
                                <div
                                    className="h-2"
                                    style={{
                                        backgroundColor: resumeInfo?.themeColor ?? 'inherit',
                                        width: `${(skill?.rating / 5) * 100}%`,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillsPreview;
