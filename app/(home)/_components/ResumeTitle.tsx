import { FileText, Globe, Lock, Trash } from 'lucide-react'
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
  const [title, setTitle] = useState('Untitled Resume')

  const handleBlur=(e:React.FocusEvent<HTMLHeadingElement>)=>{
    const newTitle=e.target.innerText;
    setTitle(newTitle)
    onSave(newTitle)
  }
  const handleOnKeyDown=(e:React.KeyboardEvent<HTMLHeadingElement>)=>{
    if(e.key==='Enter'){
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
        {title}
      </h5>
      <span>
        {status === 'private' ? (
          <Lock size='14px' />
        ) : status === 'public' ? (
          <Globe size='14px' />
        ) :status === 'archived' ? (
          <Trash size='14px' />
        ):null}
      </span>
    </div>
  )
}

export default ResumeTitle