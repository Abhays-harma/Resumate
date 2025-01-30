import { useResumeInfoContext } from '@/context/resume-info-provider';
import { AlertCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ResumeTitle from '../ResumeTitle';
import ThemeColor from './ThemeColor';
import PreviewModal from '../PreviewModal';
import DownloadResume from '../DownloadResume';

const TopSection = () => {
    const { resumeInfo, isLoading } = useResumeInfoContext();
    const [isMobile, setisMobile] = useState(false);

    useEffect(() => {
        const checkScreenWidth = () => {
            const width = window.innerWidth;
            if (width <= 430) {
                setisMobile(true);
            } else {
                setisMobile(false);
            }
        };
        checkScreenWidth();
        window.addEventListener('resize', checkScreenWidth);
        return () => {
            window.removeEventListener('resize', checkScreenWidth);
        };
    }, []);

    return (
        <>
            {resumeInfo?.status === 'archived' && (
                <div className="bg-rose-500 z-[9] absolute flex items-center h-6 top-0 text-base text-center justify-center p-2 text-white inset-0 font-medium gap-2">
                    <AlertCircle size="16px" />
                    This resume is in the trash bin
                </div>
            )}
            <div
                className="flex justify-between items-center w-full border-b pb-3 px-4"
                style={{
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: isMobile ? '10px' : '0',
                }}
            >
                <div style={{ width: isMobile ? '100%' : 'auto', textAlign: isMobile ? 'start' : 'left' }}>
                    <ResumeTitle
                        initialTitle={resumeInfo?.title || ''}
                        isLoading={false}
                        status={resumeInfo?.status}
                        onSave={(value) => console.log(value)}
                    />
                </div>
                <div
                    className="flex justify-center items-center gap-1"
                >
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
    );
};

export default TopSection;
