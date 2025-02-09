import { useResumeInfoContext } from '@/context/resume-info-provider';
import { AlertCircle, Share2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ResumeTitle from '../ResumeTitle';
import ThemeColor from './ThemeColor';
import PreviewModal from '../PreviewModal';
import DownloadResume from '../DownloadResume';
import MoreOption from '../MoreOption';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import ShareableResume from '../ShareableResume'; // Adjust the import path as necessary
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

const TopSection = () => {
    const { resumeInfo, isLoading } = useResumeInfoContext();
    const [isMobile, setisMobile] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false); // State for share dialog

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
                <div className="flex justify-center items-center gap-1">
                    <ThemeColor />
                    <PreviewModal />
                    <DownloadResume
                        title={resumeInfo?.title || 'Untitled Resume'}
                        status={resumeInfo?.status}
                        isLoading={isLoading}
                    />
                    {/* Share Icon and Dialog */}
                    <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                        <DialogTrigger asChild>
                            <Button disabled={resumeInfo?.status === 'archived' ? true : false || isLoading} variant="outline" onClick={() => setIsShareDialogOpen(true)}>
                                {/* Replace with your share icon */}
                                <span><Share2 /></span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className='rounded-lg mx-auto max-w-sm'>
                            <DialogTitle>Share Your Resume</DialogTitle>
                            <DialogDescription>
                                Generate a shareable link for your resume.
                            </DialogDescription>
                            <ShareableResume />
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
                                    Close
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <MoreOption />
                </div>
            </div>
        </>
    );
};

export default TopSection;