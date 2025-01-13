import { ResumeDataType } from '@/types/resume.type'
import React, { FC } from 'react'

interface Props{
    resumeInfo: ResumeDataType | undefined,
}

const PersonalInfoPreview:FC<Props> = ({
    resumeInfo,
}) => {
  return (
    <div className='w-full'>
        <h2 style={{color:resumeInfo?.themeColor ?? 'inherit'}} className='font-bold text-xl text-center' >
            {resumeInfo?.personalInfo?.firstName || 'First Name'}
            {" "}
            {resumeInfo?.personalInfo?.lastName || 'Last Name'}
        </h2>
        <h5 className='font-medium text-sm text-center' >
            {resumeInfo?.personalInfo?.jobTitle || 'Job Title'}
        </h5>
        <p className='text-center font-normal text-[13px]' >
            {resumeInfo?.personalInfo?.address || 'Address'}
        </p>
        <div className='flex justify-between items-center pt-3' >
            <h5 className='font-normal text-[13px]' >
                {resumeInfo?.personalInfo?.phone || 'Phone Number'}
            </h5>
            <h5 className='font-normal text-[13px]' >
                {resumeInfo?.personalInfo?.email || 'Email'}
            </h5>
        </div>
        <hr className='border-[1.5px] my-2' style={{ borderColor: resumeInfo?.themeColor ?? 'inherit' }} />
    </div>
  )
}

export default PersonalInfoPreview