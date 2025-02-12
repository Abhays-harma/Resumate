'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResumeInfoContext } from '@/context/resume-info-provider';
import useUpdateDocument from '@/features/use-update-document';
import { toast } from '@/hooks/use-toast';
import { generateThumbnail } from '@/lib/helper';
import { PersonalInfoType } from '@/types/resume.type';
import { Fingerprint, LoaderCircle } from 'lucide-react';
import React, { FC, useCallback, useEffect, useState } from 'react'

interface Prop {
  handleNext: () => void,
}

const PersonalInfoForm: FC<Prop> = ({ handleNext }) => {
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
  const { mutateAsync, isPending } = useUpdateDocument()

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
        personalInfo: {
          ...resumeInfo?.personalInfo,
          [name]: value
        }
      })
    },
    [resumeInfo, onUpdate]
  );

  const handleSubmit = useCallback(async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const thumbnail = await generateThumbnail();
    const currentNo = resumeInfo?.currentPosition ? resumeInfo?.currentPosition + 1 : 1;

    await mutateAsync(
      {
        personalInfo: personalInfo,
        thumbnail: thumbnail,
        currentPosition: currentNo,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "PersonalInfo updated successfully",
          });
          handleNext();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update personal information",
            variant: "destructive",
          });
        },
      }
    )
  }, [resumeInfo, personalInfo])

  return (
    <div>
      <div className='w-full' >
        <div className='flex items-center gap-2'>
          <h2 className='font-bold text-lg' >Personal Information </h2>
          <span><Fingerprint className='text-green-500' size='20' /></span>
        </div>
        <p className='text-sm' >Get started with personal information</p>
      </div>
      <div>
        <form onSubmit={handleSubmit} >
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
          <Button
            disabled={
              isPending || resumeInfo?.status === 'archived' ? true : false
            }
            className='mt-4 dark:text-white ' type='submit'>
            {isPending && <LoaderCircle className='animate-spin' size='15px' />}
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  )
}

export default PersonalInfoForm