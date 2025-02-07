import SkeletonLoader from '@/components/SkeletonLoader'
import { resumeData } from '@/lib/dummy';
import { ResumeDataType } from '@/types/resume.type'
import { Link } from 'lucide-react';
import React, { FC } from 'react'

interface Props {
    resumeInfo: ResumeDataType | undefined,
    isLoading: boolean,
}

const ProjectPreview: FC<Props> = ({
    resumeInfo,
    isLoading
}) => {

    if (isLoading) {
        return (
            <SkeletonLoader />
        )
    }

    return (
        <div className='w-full my-0'>
            <h5 style={{ color: resumeInfo?.themeColor ?? 'inherit' }} className='text-center font-bold text-sm'>
                Projects
            </h5>
            <hr
                className='border-[0.5px] my-2'
                style={{ borderColor: resumeInfo?.themeColor ?? 'inherit' }}
            />
            <div className='flex flex-col gap-2'>
                {resumeInfo?.projects?.map((project, index) => (
                    <div key={index}>
                        <div className='flex items-center gap-3' >
                            <h5 className='font-bold text-[15px]' style={{ color: resumeInfo?.themeColor ?? 'inherit' }}>
                                {project?.title}
                            </h5>
                            <div className='mb-1' >
                                {project?.projectLink && (
                                    <a
                                        href={project.projectLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className='text-[12px] mt-1 block'
                                        style={{ color: resumeInfo?.themeColor ?? 'inherit' }}
                                    >
                                        <div className='flex items-center gap-1' >
                                            <Link width='15' height='15' />
                                            <span>Project Link</span>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className='flex justify-between items-center'>
                            <h5 className='text-[15px]'>
                                {project?.organization}
                            </h5>
                            <span className='text-[13px]'>
                                {project?.startDate}
                                {project?.startDate && ' - '}
                                {project?.currentlyWorking ? 'Present' : project?.endDate}
                            </span>
                        </div>

                        <p className='text-[13px] !leading-[14.6px] mb-1'>
                            {project?.description}
                        </p>

                        <div className='flex flex-wrap gap-1'>
                            {project?.technologies?.map((tech, techIndex) => (
                                <span
                                    key={techIndex}
                                    className='text-[11px] px-2 py-0.5 rounded-full'
                                    style={{
                                        backgroundColor: `${resumeInfo?.themeColor}20`,
                                        color: resumeInfo?.themeColor ?? 'inherit'
                                    }}
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProjectPreview