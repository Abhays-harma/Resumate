import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import React, { useState } from 'react'
import PersonalInfoForm from './forms/PersonalInfoForm'
import { useResumeInfoContext } from '@/context/resume-info-provider'
import SummaryForm from './forms/SummaryForm'
import ExperienceForm from './forms/ExperienceForm'
import EducationForm from './forms/EducationForm'
import SkillsForm from './forms/SkillsForm'
import ProjectsForm from './forms/ProjectsForm'

const ResumeForm = () => {
  const [activeIndex, setactiveIndex] = useState(1)
  const { resumeInfo } = useResumeInfoContext()
  const handleNext = () => {
    const newIndex = activeIndex + 1;
    setactiveIndex(newIndex)
  }
  return (
    <div className='w-full  lg:sticky lg:top-16' >
      <div className='bg-white shadow-md rounded-md border-t-primary !border-t-4  dark:bg-card dark:border dark:border-gray-800 ' >
        <div className='flex gap-1 items-center justify-end px-3 py-[7px] border-b ' >
          {activeIndex > 1 && (
            <Button
              variant='outline'
              className='!px-1 !py-2 !h-auto'
              size='default'
              onClick={()=>setactiveIndex(activeIndex-1)}
            >
              <ArrowLeft size='20px' />
              Previous
            </Button>
          )}
          {(activeIndex>=1 && activeIndex<6) && (
            <Button
            variant='outline'
            className='!px-1 !py-2 !h-auto'
            size='default'
            onClick={()=>setactiveIndex(activeIndex+1)}
            disabled={
              activeIndex===6 || resumeInfo?.status==='archived'
            }
          >
            Next
            <ArrowRight size='16px' />
          </Button>
          )}
        </div>
        <div className='py-3 px-5 pb-5'>
          {activeIndex===1 && (
            <PersonalInfoForm handleNext={handleNext} />
          )}
          {activeIndex===2 &&(
            <SummaryForm handleNext={handleNext} />
          )}
          {activeIndex===3 &&(
            <ExperienceForm handleNext={handleNext} />
          )}
          {activeIndex===4 &&(
            < ProjectsForm handleNext={handleNext} />
          )}
          {activeIndex===5 &&(
            <EducationForm handleNext={handleNext} />
          )}
          {activeIndex===6 &&(
            <SkillsForm handleNext={handleNext} />
          )}
        </div>
      </div>
    </div>
  )
}

export default ResumeForm