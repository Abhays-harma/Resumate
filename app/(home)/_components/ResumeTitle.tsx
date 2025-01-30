import useUpdateTitle from '@/features/use-update-title'
import { toast } from '@/hooks/use-toast'
import { FileText, Globe, LoaderCircle, Lock, Trash } from 'lucide-react'
import React, { FC, useEffect, useState } from 'react'

interface Props {
  initialTitle: string,
  isLoading: boolean,
  status: "archived" | "private" | "public" | undefined,
  onSave: (newTitle: string) => void
}

const ResumeTitle: FC<Props> = ({
  initialTitle,
  isLoading,
  status,
  onSave
}) => {
  const [title, setTitle] = useState(initialTitle)

  const { mutate, isPending } = useUpdateTitle()

  const handleChange = (newTitle: string) => {
    mutate({
      newTitle: newTitle,
    }, {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Updated title successfully',
        })
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Error in updating title',
        })
      }
    })
  }

  const handleBlur = (e: React.FocusEvent<HTMLHeadingElement>) => {
    const newTitle = e.target.innerText.trim();
    if (newTitle.length <= 0) {
      toast({
        title: 'Warning',
        description: 'Title cannot be empty',
        variant:'destructive'
      });
      e.target.innerText = title; // Reset the title to the previous value
      return; // Prevent further execution
    }
    if (newTitle.length > 25) {
      toast({
        title: 'Warning',
        description: 'Title cannot exceed 25 characters',
        variant: 'destructive',
      });
      e.target.innerText = title; // Reset the title to the previous value
      return;
    }
    if(newTitle===title)return;
    setTitle(newTitle)
    onSave(newTitle)
    handleChange(newTitle)
  }
  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLHeadingElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.currentTarget.blur()
    }
  }

  useEffect(() => {
    if (initialTitle) {
      setTitle(initialTitle)
    }
  }, [initialTitle])
  return (
    <div className='flex items-center gap-1 pr-4' >
      <FileText className='stroke-primary' size='20' />
      <h5
        contentEditable={true}
        suppressContentEditableWarning={true}
        spellCheck={false}
        onBlur={handleBlur}
        onKeyDown={handleOnKeyDown}

        className='text-[20px] px-1 font-semibold text-gray-700 dark:text-gray-300 ' >
        <div className='flex justify-center items-center gap-1 ' >
          <div>{title}</div>
          {isPending && (
            <LoaderCircle className='animate-spin' size='15px' />
          )}
        </div>
      </h5>
      <span>
        {status === 'private' ? (
          <Lock size='14px' />
        ) : status === 'public' ? (
          <Globe size='14px' />
        ) : status === 'archived' ? (
          <Trash size='14px' />
        ) : null}
      </span>
    </div>
  )
}

export default ResumeTitle