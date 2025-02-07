import { useResumeInfoContext } from '@/context/resume-info-provider'
import React from 'react'
import PersonalInfoPreview from './PersonalInfoPreview'
import SummaryPreview from './SummaryPreview'
import ExperiencePreview from './ExperiencePreview'
import EducationPreview from './EducationPreview'
import SkillsPreview from './SkillsPreview'
import ProjectsPreview from './ProjectsPreview'

const ResumePreview = () => {
  const { resumeInfo, isLoading } = useResumeInfoContext()
  return (
    <div id='resume-preview-id' className='bg-white  w-full h-full px-10 py-4 dark:bg-card dark:border dark:border-b-gray-800 dark:border-x-gray-800 shadow-lg ' >
      <PersonalInfoPreview
        resumeInfo={resumeInfo}
        isLoading={isLoading}
      />
      <SummaryPreview
        resumeInfo={resumeInfo}
        isLoading={isLoading}
      />
      <ExperiencePreview
        resumeInfo={resumeInfo}
        isLoading={isLoading}
      />
      <ProjectsPreview
        resumeInfo={resumeInfo}
        isLoading={isLoading}
      />
      <EducationPreview
        resumeInfo={resumeInfo}
        isLoading={isLoading}
      />
      <SkillsPreview
        resumeInfo={resumeInfo}
        isLoading={isLoading}
      />
    </div>
  )
}

export default ResumePreview