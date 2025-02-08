'use client'
import React, { useState } from 'react'
import AddResume from '../../_components/AddResume'
import ResumeList from '../../_components/ResumeList'

const Page = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className='w-full relative'>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
          <p className="text-white text-lg font-semibold">Redirecting to document...</p>
        </div>
      )}
      <div className='w-full max-w-7xl mx-auto px-5 py-5' >
        <div className='flex items-start justify-between' >
          <div>
            <h1 className='text-2xl font-bold' >Resume Builder</h1>
            <p>Create your own custom resume with AI</p>
          </div>
          <div className='shrink-0 flex items-center gap-3'>
            {/* {Trash List} */}
          </div>
        </div>
        <div className='w-full pt-11' >
          <h5 className='text-xl font-semibold mb-3' >All Resumes</h5>
          <div className='flex flex-wrap gap-5'>
            <AddResume />
            <ResumeList setLoading={setLoading} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page;