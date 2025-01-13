'use client'
import useCreateDocument from '@/features/use-create-document';
import { FileText, LoaderCircle, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const AddResume = () => {
  const router=useRouter()
  const {isPending,mutate}=useCreateDocument();
  const onCreate=useCallback(()=> {
    console.log("mutate function is called");
    
    mutate({
      title:"Untitled Resume",
    },{
      onSuccess: (response) => {
        const documentId = response?.data?.documentId;
        router.push(`/dashboard/documents/${documentId}/edit`);
      },
    })
  },[mutate,router])

  return (
    <>
      <div role='button' className='w-full max-w-[164px] cursor-pointer' onClick={onCreate} >
        <div className='flex flex-col items-center justify-center gap-2 w-full max-w-full h-[183px] py-24 rounded-lg border hover:border-primary hover:shadow-sm bg-white dark:bg-secondary transition' >
          <span>
            <Plus size='30px' />
          </span>
          <p className='text-sm font-semibold' >Blank Resume</p>
        </div>
      </div>
      {isPending && (
        <div className='w-full z-[9999] h-full fixed backdrop-blur left-0 right-0 top-0 bg-black/10 justify-center items-center flex flex-col gap-2 ' >
          <LoaderCircle size='35px' className='animate-spin' />
          <div className='flex items-center gap-2' >
            <FileText/>
            Creating blank resume...
          </div>
        </div>
      )}
    </>
  )
}

export default AddResume