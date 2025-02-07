import React, { useEffect, useState } from 'react';
import { useResumeInfoContext } from '@/context/resume-info-provider';
import PersonalInfoPreview from './PersonalInfoPreview';
import SummaryPreview from './SummaryPreview';
import ExperiencePreview from './ExperiencePreview';
import ProjectPreview from './ProjectsPreview';
import EducationPreview from './EducationPreview';
import SkillsPreview from './SkillsPreview';

const A4_HEIGHT_PX = 1122; // Approximate A4 page height in pixels at 96 DPI (html2canvas default)
const MARGIN_PX = 40; // Matching margins from html2pdf options

const ResumePreview = () => {
  const { resumeInfo, isLoading } = useResumeInfoContext();
  const [isPageBreaking, setIsPageBreaking] = useState<boolean>(false);

  useEffect(() => {
    const checkPageBreak = () => {
      const resumeElement = document.getElementById('resume-preview-id');
      if (!resumeElement) return;

      const totalHeight = resumeElement.scrollHeight;
      const maxHeight = A4_HEIGHT_PX - MARGIN_PX * 2; // Effective A4 height

      setIsPageBreaking(totalHeight > maxHeight);
    };

    checkPageBreak();
    window.addEventListener('resize', checkPageBreak);
    return () => window.removeEventListener('resize', checkPageBreak);
  }, [resumeInfo]);

  return (
    <div className="relative bg-white w-full min-h-screen px-10 py-4 dark:bg-card dark:border dark:border-b-gray-800 dark:border-x-gray-800 shadow-lg">
      {isPageBreaking && (
        <div className="absolute top-2 left-2 w-full border-t-2 border-dotted border-red-500 text-center text-red-600 font-semibold py-1">
          ⚠️ Page Break Detected: Reduce Content
        </div>
      )}
      <div style={{ marginTop: isPageBreaking ? '1rem' : '0' }} id="resume-preview-id">
        <PersonalInfoPreview resumeInfo={resumeInfo} isLoading={isLoading} />
        <SummaryPreview resumeInfo={resumeInfo} isLoading={isLoading} />
        <ExperiencePreview resumeInfo={resumeInfo} isLoading={isLoading} />
        <ProjectPreview resumeInfo={resumeInfo} isLoading={isLoading} />
        <EducationPreview resumeInfo={resumeInfo} isLoading={isLoading} />
        <SkillsPreview resumeInfo={resumeInfo} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ResumePreview;
