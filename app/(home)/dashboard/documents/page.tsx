import React from 'react'
import AddResume from '../../_components/AddResume'
import ResumeList from '../../_components/ResumeList'

const page = () => {
  return (
    <div className='w-full'>
      <div className='w-full max-w-7xl mx-auto px-5 py-5' >
        <div className='flex items-start justify-between' >
          <div>
            <h1 className='text-2xl font-bold' >Resume Builder</h1>
            <p>Create your own custom resume wih AI</p>
          </div>
          <div className='shrink-0 flex items-center gap-3'>
            {/* {Trash List} */}
          </div>
        </div>
        <div className='w-full pt-11' >
          <h5 className='text-xl font-semibold mb-3' >All Resumes</h5>
          <div className='flex flex-wrap gap-5'>
            <AddResume />
            <ResumeList />
          </div>
        </div>
      </div>
    </div>
  )
}

export default page