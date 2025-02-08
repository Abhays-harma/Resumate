'use client'
import useGetDocuments from '@/features/use-get-documents'
import React, { FC } from 'react'
import { LoaderCircle, RotateCw } from 'lucide-react';
import ResumeItem from './ResumeItem';

interface Prop{
  setLoading:(loading: boolean) => void;
}

const ResumeList:FC<Prop> = ({ setLoading }) => {
  const { data, isLoading, refetch, isError } = useGetDocuments();
  const resumes = data?.data;
  return (
    <>
      {isLoading ? (
        <div className='flex items-center mx-5' >
          <LoaderCircle className='animate-spin size-10 ' />
        </div>
      ) : isError ? (
        <div className='flex justify-center items-center' >
          <button className='flex items-center gap-1 mx-5' onClick={() => refetch()} >
            <RotateCw />
            <span>Retry</span>
          </button>
        </div>
      ) : (
        <>
          {resumes?.map((resume) => (
            <ResumeItem key={resume.documentId}
              documentId={resume.documentId}
              title={resume.title}
              status={resume.status}
              updatedAt={resume.updatedAt}
              themeColor={resume.themeColor}
              thumbnail={resume?.thumbnail}
              setLoading={setLoading}
            />
          ))}
        </>
      )}
    </>
  )
}

export default ResumeList;