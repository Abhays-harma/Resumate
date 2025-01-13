import { ResumeDataType } from '@/types/resume.type'
import React, { FC } from 'react'

interface Props{
    resumeInfo:ResumeDataType | undefined,
}

const EducationPreview:FC<Props> = ({
    resumeInfo,
}) => {
  return (
    <div className='w-full my-5' >
        <h5 style={{color:resumeInfo?.themeColor ?? 'inherit'}} className='text-center font-bold text-sm mb-2' >
            Education
        </h5>
        <hr className=' border-[1.5px] my-2 ' style={{borderColor:resumeInfo?.themeColor ?? 'inherit'}} />

        <div className='flex flex-col gap-1' >
            {resumeInfo?.educations?.map((education,index)=>(
                <div key={index} >
                    <h5 className='font-bold text-sm' style={{color:resumeInfo?.themeColor ?? 'inherit'}} >
                        {education?.universityName}
                    </h5>
                    <div className='flex justify-between items-center' >
                        <h5 className=' text-[13px] ' >
                            {education?.degree}
                            {education?.degree && education?.major && ' in '}
                            {education?.major}
                        </h5>
                        <span className='text-[13px]' >
                            {education?.startDate}
                            {education?.startDate && education?.endDate && ' - '}
                            {education?.endDate}
                        </span>
                    </div>
                    <p className=' text-[13px] my-2 '>
                        {education?.description}
                    </p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default EducationPreview