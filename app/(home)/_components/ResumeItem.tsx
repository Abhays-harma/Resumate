'use client'
import { EllipsisVertical, FileText, Globe, Lock } from 'lucide-react'
import React, { FC, useMemo } from 'react'
import { format } from "date-fns";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface PropType {
    themeColor: string | null,
    status: 'private' | 'public' | 'archived' | null,
    documentId: string | null,
    title: string,
    thumbnail: string | null,
    updatedAt: string | null,
    setLoading:(loading: boolean) => void;
}

const ResumeItem:FC<PropType> = ({ themeColor, status, title, documentId, updatedAt, thumbnail, setLoading }) => {
    const router = useRouter();

    const goToDoc = () => {
        setLoading(true);
        router.push(`/dashboard/documents/${documentId}/edit`);
    };

    const docDate = useMemo(() => {
        if (!updatedAt) return null;
        return format(updatedAt, "MMM dd, yyyy");
    }, [updatedAt]);

    return (
        <div className='w-full max-w-[164px] h-[194px] border transition-all cursor-pointer rounded-lg shadow-primary hover:shadow-md hover:border-primary '
            style={{ borderColor: themeColor || "" }}
            onClick={goToDoc}
        >
            <div className='flex flex-col justify-center items-center w-full h-full bg-[#fdfdfd] rounded-lg dark:bg-secondary' >
                <div className='flex flex-1 w-full pt-2 px-1' >
                    <div className='w-full h-full justify-center items-center flex flex-1 bg-white dark:bg-gray-700 rounded-t-lg '  >
                        {thumbnail ? (
                            <div className='w-full h-full relative rounded-t-lg overflow-hidden' >
                                <Image
                                    fill
                                    src={thumbnail}
                                    alt={title}
                                    className='w-full h-full object-cover object-top rounded-t-lg '
                                />
                            </div>
                        ) : (
                            <FileText size='30px' />
                        )}
                    </div>
                </div>
                <div className='w-full shrink border-t pt-2 px-[9px] pb-[9px] '>
                    <div className='flex justify-between items-center' >
                        <h5 className='font-semibold mb-[2px] w-[200px] block truncate text-sm ' >{title}</h5>
                        <button>
                            <EllipsisVertical className='text-muted-foreground' size="20px" />
                        </button>
                    </div>
                    <div className='flex items-center gap-2 pt-1' >
                        <div className='text-muted-foreground text-sm' >
                            {status == 'private' ? (
                                <div className='flex justify-start gap-1 items-center  '>
                                    <Lock size="12px" />
                                    Private
                                </div>
                            ) : (
                                <div className='flex justify-start gap-1 items-center  '>
                                    <Globe size="12px" />
                                    Public
                                </div>
                            )}
                        </div>
                        <div className='text-sm text-muted-foreground flex justify-center items-center' >
                            {docDate}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResumeItem;