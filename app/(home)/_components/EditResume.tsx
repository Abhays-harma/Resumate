'use client'
import { useResumeInfoContext } from '@/context/resume-info-provider'
import React from 'react'
import TopSection from './common/TopSection'
import ResumeForm from './ResumeForm'
import ResumePreview from './ResumePreview'

const EditResume = () => {

  return (
    <div className='w-full relative' >
      <div className='w-full max-w-7xl mx-auto py-4 px-5  ' >
        <TopSection/>
        <div className='w-full mt-1'>
          <div className='flex flex-col lg:flex-row gap-6 items-start w-full py-3' >
            <ResumeForm/>
            <ResumePreview/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditResume