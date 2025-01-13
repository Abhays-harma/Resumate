import { ResumeDataType } from '@/types/resume.type'
import React, { FC } from 'react'

interface Props {
    resumeInfo: ResumeDataType | undefined,
}

const SkillsPreview: FC<Props> = ({
    resumeInfo,
}) => {
    return (
        <div className='w-full my-5' >
            <h5 style={{ color: resumeInfo?.themeColor ?? 'inherit' }} className='text-center font-bold text-sm my-2' >
                Skills
            </h5>
            <hr style={{ borderColor: resumeInfo?.themeColor ?? 'inherit' }} className=' border-[1.5px] my-2 ' />

            <div className='grid grid-cols-2 gap-3 pt-3 my-1'>
                {resumeInfo?.skills?.map((skill, index) => (
                    <div key={index} className='flex justify-between items-center' >
                        <h5 className='text-[13px]' >
                            {skill?.name}
                        </h5>
                        {skill?.name && skill?.rating && (
                            <div className='bg-gray-200 w-[120px]' >
                                <div className='h-2'
                                    style={{
                                        backgroundColor: resumeInfo?.themeColor ?? 'inherit',
                                        width:skill?.rating*20 + '%'
                                    }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SkillsPreview