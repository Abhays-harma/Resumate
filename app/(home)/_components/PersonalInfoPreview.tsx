import { ResumeDataType } from '@/types/resume.type'
import { Mail, Phone } from 'lucide-react'
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
            <div className='font-normal flex gap-1 justify-center items-center text-[13px]' >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth='2' strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                {resumeInfo?.personalInfo?.phone || 'Phone Number'}
            </div>
            <div className='font-normal flex justify-center gap-1 items-center text-[13px]' >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth='2' strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                {resumeInfo?.personalInfo?.email || 'Email'}
            </div>
        </div>
        <hr className='border-[0.5px] my-1' style={{ borderColor: resumeInfo?.themeColor ?? 'inherit' }} />
    </div>
  )
}

export default PersonalInfoPreview