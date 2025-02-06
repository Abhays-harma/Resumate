import SkeletonLoader from '@/components/SkeletonLoader'
import { ResumeDataType } from '@/types/resume.type'
import React, { FC } from 'react'

interface Props {
    resumeInfo: ResumeDataType | undefined,
    isLoading:boolean,
}

const ExperiencePreview: FC<Props> = ({
    resumeInfo,
    isLoading
}) => {
    if(isLoading){
        return(
            <SkeletonLoader />
        )
    }
    return (
        <div className='w-full my-0 ' >
            <h5 style={{ color: resumeInfo?.themeColor ?? 'inherit' }} className='text-center font-bold text-sm' >
                Professional Experience
            </h5>
            <hr
                className='border-[0.5px] my-2' style={{ borderColor: resumeInfo?.themeColor ?? 'inherit' }}
            />
            <div className='flex flex-col gap-2' >
                {resumeInfo?.experiences?.map((experience, index) => (
                    <div key={index} >
                        <h5 className='font-bold text-[15px] ' style={{ color: resumeInfo?.themeColor ?? 'inherit' }} >
                            {experience?.title}
                        </h5>

                        <div className='flex justify-between items-center' >
                            <h5 className='text-[15px]' >
                                {experience?.companyName}
                                {experience?.companyName && experience?.city && ', '}
                                {experience?.city}
                                {experience?.companyName && experience?.city && experience?.state && ', '}
                                {experience?.state}
                            </h5>
                            <span className='text-[13px]' >
                                {experience?.startDate}
                                {experience?.startDate && ' - '}
                                {experience?.currentlyWorking? 'Present':experience?.endDate}
                            </span>
                        </div>
                        <div
                            className='text-[13px] !leading-[14.6px] '
                            dangerouslySetInnerHTML={{
                                __html:experience?.workSummary || ''
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ExperiencePreview