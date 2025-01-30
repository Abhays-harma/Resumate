import { ResumeDataType } from '@/types/resume.type'
import React, { FC } from 'react'

interface Props {
    resumeInfo: ResumeDataType | undefined,
}

const SummaryPreview: FC<Props> = ({
    resumeInfo,
}) => {
    return (
        <div className='w-full' >
            <p className='text-[13px] !leading-4 ' >
                {resumeInfo?.summary || 'Enter a brief summary about your role'}
            </p>
        </div>
    )
}

export default SummaryPreview