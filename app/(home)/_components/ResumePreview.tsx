import { useResumeInfoContext } from '@/context/resume-info-provider'
import React from 'react'
import PersonalInfoPreview from './PersonalInfoPreview'
import SummaryPreview from './SummaryPreview'
import ExperiencePreview from './ExperiencePreview'
import EducationPreview from './EducationPreview'
import SkillsPreview from './SkillsPreview'

const ResumePreview = () => {
  const { resumeInfo } = useResumeInfoContext()
  return (
    <div id='resume-preview-id'  className='bg-white  w-full h-full px-5 py-1 dark:bg-card dark:border dark:border-b-gray-800 dark:border-x-gray-800 shadow-lg ' >
      <PersonalInfoPreview
        resumeInfo={resumeInfo}
      />
      <SummaryPreview
        resumeInfo={resumeInfo}
      />
      <ExperiencePreview
        resumeInfo={resumeInfo}
      />
      <EducationPreview
        resumeInfo={resumeInfo}
      />
      <SkillsPreview
        resumeInfo={resumeInfo}
      />
    </div>
  )
}

export default ResumePreview