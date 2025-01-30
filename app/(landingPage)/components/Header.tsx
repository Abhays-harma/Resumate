'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useTheme } from "next-themes"
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from '@/components/ui/button';

const Header = () => {
    const { setTheme } = useTheme()

    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkScreenWidth = () => {
            const width = window.innerWidth;
            if (width <= 650) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };
        checkScreenWidth();
        window.addEventListener('resize', checkScreenWidth);
        return () => {
            window.removeEventListener('resize', checkScreenWidth);
        };
    }, []);

    return (
        <div className='flex flex-col gap-1 w-full' >
            <div className='bg-white dark:bg-gray-900 z-[9] shadow-sm w-full sticky top-0'>
                <div>
                    <div className=' flex justify-between items-center py-2 px-5 mx-auto max-w-7xl w-full' >
                        {/* {left} */}
                        <div className='flex items-center justify-center gap-3 lg:gap-20 ' >
                            <Link
                                href='/'
                                className='font-bold text-primary text-[20px]'
                            >
                                Resumate.ai
                            </Link>
                        </div>
                        {/* {middle} */}
                        {!isMobile && window.innerWidth > 650 ? (
                                    <div className='flex gap-10 justify-center items-center' >
                                        <Link
                                            className='mt-1'
                                            href='/'
                                        >
                                            Ai Features
                                        </Link>
                                        <Link
                                            className='mt-1'
                                            href='/'
                                        >
                                            Resorces
                                        </Link>
                                        <Link
                                            className='mt-1'
                                            href='/'
                                        >
                                            About
                                        </Link>
                                    </div>
                                ) : null}

                        {/* {right section} */}
                        <div className='flex items-center gap-4'>

                            <Button
                                variant='outline'
                            >
                                <LoginLink>Sign in</LoginLink>
                            </Button>

                            <Button
                            >
                                <RegisterLink>Get Started</RegisterLink>
                            </Button>

                        </div>
                    </div>
                </div>
                <div className='flex gap-10 mx-auto justify-center items-center' >
                    {isMobile ? (
                        <>
                            <Link
                                className='mt-1'
                                href='/'
                            >
                                Ai Features
                            </Link>
                            <Link
                                className='mt-1'
                                href='/'
                            >
                                Resorces
                            </Link>
                            <Link
                                className='mt-1'
                                href='/'
                            >
                                About
                            </Link>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default Header