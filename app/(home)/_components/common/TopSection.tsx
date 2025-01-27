import { useResumeInfoContext } from '@/context/resume-info-provider'
import { AlertCircle } from 'lucide-react';
import React from 'react'
import ResumeTitle from '../ResumeTitle';
import ThemeColor from './ThemeColor';
import PreviewModal from '../PreviewModal';
import DownloadResume from '../DownloadResume';

const TopSection = () => {
    const { resumeInfo, onUpdate,isLoading } = useResumeInfoContext();
    return (
        <>
            {resumeInfo?.status === 'archived' && (
                <div className='bg-rose-500 z-[9] absolute flex items-center h-6 top-0 text-base text-center justify-center p-2 text-white inset-0 font-medium gap-2' >
                    <AlertCircle size='16px' />
                    This resume is in the trash bin
                </div>
            )}
            <div className='flex justify-between items-center w-full border-b pb-3 px-4' >
                <div>
                    <ResumeTitle
                        initialTitle={resumeInfo?.title || ''}
                        isLoading={false}
                        status={resumeInfo?.status}
                        onSave={(value) => console.log(value)}
                    />
                </div>
                <div className='flex justify-center items-center gap-1' >
                    <ThemeColor />
                    <PreviewModal />
                    <DownloadResume
                    title={resumeInfo?.title || 'Untitled Resume'}
                    status={resumeInfo?.status}
                    isLoading={isLoading}
                    />
                </div>
            </div>
        </>
    )
}

export default TopSection