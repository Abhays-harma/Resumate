import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResumeInfoContext } from '@/context/resume-info-provider';
import { PersonalInfoType } from '@/types/resume.type';
import React, { useCallback, useEffect, useState } from 'react'

const PersonalInfoForm = () => {
  const initialState = {
    id: undefined,
    firstName: '',
    lastName: '',
    jobTitle: '',
    address: '',
    phone: '',
    email: '',
  }
  const { resumeInfo, onUpdate } = useResumeInfoContext();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoType>(initialState)

  useEffect(() => {
    if (resumeInfo) {
      if (resumeInfo?.personalInfo) {
        setPersonalInfo(resumeInfo?.personalInfo || initialState)
      }
    }
  }, [resumeInfo?.personalInfo])

  const handleChange = useCallback(
    (e: { target: { name: string; value: string } }) => {
      const { name, value } = e.target;

      setPersonalInfo({ ...personalInfo, [name]: value });

      if (!resumeInfo) return;

      onUpdate({
        ...resumeInfo,
        personalInfo:{
          ...resumeInfo?.personalInfo,
          [name]:value
        }
      })
    },
    [resumeInfo, onUpdate]
  );

  return (
    <div>
      <div className='w-full' >
        <h2 className='font-bold text-lg' >Personal Information</h2>
        <p className='text-sm' >Get started with personal information</p>
      </div>
      <form>
        <div className='grid grid-cols-2 gap-3 mt-5' >
          <div >
            <Label className='text-sm' >First Name</Label>
            <Input
              name='firstName'
              placeholder=''
              required
              autoComplete='off'
              value={personalInfo?.firstName ?? ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label className='text-sm' >Last Name</Label>
            <Input
              name='lastName'
              placeholder=''
              autoComplete='off'
              value={personalInfo?.lastName ?? ''}
              onChange={handleChange}
            />
          </div>
          <div className='col-span-2' >
            <Label className='text-sm' >Job Title</Label>
            <Input
              name='jobTitle'
              placeholder=''
              required
              autoComplete='off'
              value={personalInfo?.jobTitle ?? ''}
              onChange={handleChange}
            />
          </div>
          <div className='col-span-2' >
            <Label className='text-sm' >Address</Label>
            <Input
              name='address'
              placeholder=''
              required
              autoComplete='off'
              value={personalInfo?.address ?? ''}
              onChange={handleChange}
            />
          </div>
          <div className='col-span-2' >
            <Label className='text-sm' >Phone</Label>
            <Input
              name='phone'
              placeholder=''
              required
              autoComplete='off'
              value={personalInfo?.phone ?? ''}
              onChange={handleChange}
            />
          </div>
          <div className='col-span-2' >
            <Label className='text-sm' >Email</Label>
            <Input
              name='email'
              placeholder=''
              required
              autoComplete='off'
              value={personalInfo?.email ?? ''}
              onChange={handleChange}
            />
          </div>
        </div>
        <Button className='mt-4' type='submit'>
          Save Changes
        </Button>
      </form>
    </div>
  )
}

export default PersonalInfoForm