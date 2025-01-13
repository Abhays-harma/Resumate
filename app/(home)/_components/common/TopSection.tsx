import { useResumeInfoContext } from '@/context/resume-info-provider'
import { AlertCircle } from 'lucide-react';
import React from 'react'
import ResumeTitle from '../ResumeTitle';

const TopSection = () => {
    const { resumeInfo, onUpdate } = useResumeInfoContext();
    return (
        <>
            {resumeInfo?.status === 'archived' && (
                <div className='bg-rose-500 z-[9] absolute flex items-center h-6 top-0 text-base text-center justify-center p-2 text-white inset-0 font-medium gap-2' >
                    <AlertCircle size='16px' />
                    This resume is in the trash bin
                </div>
            )}
            <div className='flex justify-between items-center w-full border-b pb-3' >
                <div>
                    <ResumeTitle 
                    initialTitle={resumeInfo?.title || ''}
                    isLoading={false}
                    status={resumeInfo?.status}
                    onSave={(value)=>console.log(value)}
                    />
                </div>
                <div>
                    sideOptions
                </div>
            </div>
        </>
    )
}

export default TopSection