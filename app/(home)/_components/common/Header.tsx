'use client'
import Link from 'next/link'
import React, { Fragment } from 'react'
import { useKindeBrowserClient, LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, LoaderCircle, Moon, Sun } from 'lucide-react';
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const Header = () => {
    const { setTheme } = useTheme()
    const { user, isLoading, isAuthenticated, error } = useKindeBrowserClient();
    return (
        <div className='bg-white dark:bg-gray-900 z-[9] shadow-sm w-full sticky top-0' >
            <div className=' flex justify-between items-center py-2 px-5 mx-auto max-w-7xl w-full' >
                {/* {logo} */}
                {/* {todo: flex-1} */}
                <div className='flex items-center justify-center gap-3 ' >
                    <Link
                        href='/dashboard/documents'
                        className='font-bold text-primary text-[20px]'
                    >
                        Resumate.ai
                    </Link>
                    {user && !isLoading && (
                        <div className='flex mt-1 lg:gap-2 gap-1 justify-center items-center'>
                            <span className=' font-normal text-black/50 dark:text-white ' >Hi,</span>
                            <h5 className='font-bold text-black dark:text-white' >{user.given_name}</h5>
                        </div>
                    )}
                </div>

                {/* {right section} */}
                <div className='flex items-center gap-4'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                    Light
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                    Dark
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                    System
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {isLoading ? (
                            <LoaderCircle className='animate-spin !size-6' />
                        ) : error ? (
                            <span className='text-red-500'>Error in loading user data</span>
                        ) : isAuthenticated && user && (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="focus-visible:outline-none" role='button' aria-label='User menu' >
                                    <div className='flex items-center gap-1' >
                                        <Avatar>
                                            <AvatarImage
                                                src={user.picture || ''}
                                            />
                                            <AvatarFallback>
                                                {user?.given_name?.[0].toUpperCase() || 'U'}
                                                {user?.family_name?.[0].toUpperCase() || 'N'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <ChevronDown size='17px' />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='my-3 mx-1'>
                                    <DropdownMenuItem className='text-red-500 font-medium' >
                                        <LogoutLink>
                                            LogOut
                                        </LogoutLink>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
            </div>
        </div>
    )
}

export default Header