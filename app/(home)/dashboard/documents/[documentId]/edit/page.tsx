import EditResume from '@/app/(home)/_components/EditResume'
import { ResumeInfoProvider, useResumeInfoContext } from '@/context/resume-info-provider'
import React from 'react'

const page = () => {
  return (
    <div>
      <ResumeInfoProvider>
        <EditResume />
      </ResumeInfoProvider>
    </div>
  )
}

export default page