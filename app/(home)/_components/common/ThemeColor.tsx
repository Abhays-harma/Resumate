'use client'
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useResumeInfoContext } from '@/context/resume-info-provider';
import useUpdateDocument from '@/features/use-update-document';
import useDebounce from '@/hooks/use-debounce';
import { toast } from '@/hooks/use-toast';
import { generateThumbnail } from '@/lib/helper';
import { ChevronDown, Palette } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react'

export const INITIAL_THEME_COLOR = "#7c3aed";

export const THEME_COLORS = [
    "#FF6F61", // Warm Coral
    "#33B679", // Fresh Green
    "#4B9CD3", // Soft Blue
    "#FF6F91", // Bright Magenta
    "#9B59B6", // Rich Purple
    "#1ABC9C", // Mint Green
    "#FF8C00", // Tangerine Orange
    "#B2D300", // Vibrant Lime
    "#8E44AD", // Deep Violet
    "#FF4F81", // Hot Pink
    "#2ECC72", // Light Jade
    "#3498DB", // Calm Sky Blue
    "#A3D550", // Neon Yellow-Green
    "#00BFFF", // Cool Azure
    "#353935", // Black
    "#8E44AD", // Royal Blue
    "#2ECC71", // Electric Green
    "#5B2C6F", // Indigo Purple
    "#FF4F82", // Crimson Red
    "#1973e8", // Cobalt Blue
];

const ThemeColor = () => {
    const { resumeInfo, onUpdate, isLoading } = useResumeInfoContext()
    const { mutateAsync, isPending } = useUpdateDocument();

    const [selectedColor, setselectedColor] = useState(INITIAL_THEME_COLOR)

    const debouncedColor=useDebounce<string>(selectedColor,1000)

    useEffect(()=>{
        if (debouncedColor){
            console.log("debouncedColor: ",debouncedColor)
            onSave();
        }
    },[debouncedColor])

    const onColorSelect = useCallback((color: string) => {
        setselectedColor(color)
        if (!resumeInfo) return
        onUpdate({
            ...resumeInfo,
            themeColor: color
        })
    }, [resumeInfo, onUpdate])

    const onSave = useCallback((async () => {
        console.log("selectedColor : ",selectedColor);
        
        if(!selectedColor)return
        if(selectedColor===INITIAL_THEME_COLOR)return
        const thumbnail=await generateThumbnail()
        await mutateAsync(
            {
                themeColor:selectedColor,
                thumbnail:thumbnail,
            },
            {
                onSuccess:()=>{
                    toast({
                        title:'Success',
                        description:'Theme updated successfully'
                    })
                },
                onError:()=>{
                    toast({
                        title:'Error',
                        description:'Failed to update theme color'
                    })
                }
            }
        )

    }),[selectedColor])
    return (
        <Popover>
            <PopoverTrigger asChild >
                <Button
                    disabled={resumeInfo?.status === 'archived' ? true : false || isLoading}
                    variant='secondary'
                    className='bg-white border gap-1 dark:bg-gray-800 !w-10 lg:!w-24 !p-2 lg:!p-4 flex items-center justify-center'
                >
                    <div className='flex items-center justify-center gap-1 w-full'>
                        <Palette className='text-blue-500' />
                        <span className='hidden lg:flex'>Theme</span>
                        <ChevronDown className='text-blue-500' size='14px' />
                    </div>
                </Button>


            </PopoverTrigger>
            <PopoverContent>
                <h2 className='mb-2 text-sm font-bold' >Select Theme Color</h2>
                <div className='grid grid-cols-5 gap-3' >
                    {THEME_COLORS.map((item: string, index: number) => (
                        <div
                            role='button'
                            key={index}
                            onClick={() => onColorSelect(item)}
                            className={`h-5 w-8 rounded-[5px] hover:border-black border ${selectedColor === item && "border-black"} `}
                            style={{
                                background: item
                            }}
                        >

                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default ThemeColor