import { Skeleton } from '@/components/ui/skeleton';
import { ResumeDataType } from '@/types/resume.type'
import { Mail, Phone } from 'lucide-react'
import React, { FC } from 'react'

interface Props {
    resumeInfo: ResumeDataType | undefined,
    isLoading: boolean
}

const PersonalInfoPreview: FC<Props> = ({
    resumeInfo,
    isLoading
}) => {
    const SkeletonLoader = () => {
        return (
            <div className="w-full min-h-14">
                <Skeleton className="h-6 w-1/2 mx-auto mb-2" />
                <Skeleton className="h-6 w-1/4 mx-auto mb-2" />
                <Skeleton className="h-6 w-1/3 mx-auto mb-2" />
                <div className="flex justify-between pt-3">
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-[1.5] w-full my-2" />
            </div>
        );
    };
    if (isLoading) {
        return <SkeletonLoader />
    }
    return (
        <div className='w-full'>
            <h2 style={{ color: resumeInfo?.themeColor ?? 'inherit' }} className='font-bold text-xl text-center' >
                {resumeInfo?.personalInfo?.firstName || 'First Name'}
                {" "}
                {resumeInfo?.personalInfo?.lastName || 'Last Name'}
            </h2>
            <h5 className='font-medium text-sm text-center' >
                {resumeInfo?.personalInfo?.jobTitle || 'Job Title'}
            </h5>
            <p className='text-center font-normal text-[13px]' >
                {resumeInfo?.personalInfo?.address || 'Address'}
            </p>
            <div className='flex justify-between items-center pt-3' >
                <div className='font-normal flex gap-1 justify-center items-center text-[13px]' >
                    <Phone width='15' height='15' />
                    {resumeInfo?.personalInfo?.phone || 'Phone Number'}
                </div>
                <div className='font-normal flex justify-center gap-1 items-center text-[13px]' >
                    <Mail width='15' height='15' />
                    {resumeInfo?.personalInfo?.email || 'Email'}
                </div>
            </div>
            <hr className='border-[0.5px] my-2' style={{ borderColor: resumeInfo?.themeColor ?? 'inherit' }} />
        </div>
    )
}

export default PersonalInfoPreview