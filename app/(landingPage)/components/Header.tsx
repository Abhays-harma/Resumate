'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useTheme } from "next-themes"
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation'; // Import usePathname
import { Sun, Moon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Header = () => {
    const { setTheme } = useTheme()
    const [isMobile, setIsMobile] = useState(false)
    const pathname = usePathname(); // Get the current pathname

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

    // Function to determine if a link is active
    const isActive = (href: string) => {
        return pathname === href;
    };

    return (
        <div className='flex flex-col gap-1 w-full' >
            <div className='bg-white dark:bg-gray-900 z-[9] shadow-sm w-full sticky top-0'>
                <div>
                    <div className=' flex justify-between items-center py-2 px-2 mx-auto max-w-7xl w-full' >
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
                                    className={`mt-1 ${isActive('/aiFeatures') ? 'text-blue-500 underline' : ''}`}
                                    href='/aiFeatures'
                                >
                                    Ai Features
                                </Link>
                                <Link
                                    className={`mt-1 ${isActive('/resources') ? 'text-blue-500 underline' : ''}`}
                                    href='/resources'
                                >
                                    Resources
                                </Link>
                                <Link
                                    className={`mt-1 ${isActive('/about') ? 'text-blue-500 underline' : ''}`}
                                    href='/about'
                                >
                                    About
                                </Link>
                            </div>
                        ) : null}

                        {/* {right section} */}
                        <div className='flex items-center gap-1'>

                            {/* Theme Toggle */}
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

                            <Button
                                variant='outline'
                            >
                                <LoginLink
                                    authUrlParams={{
                                        connection_id: process.env.NEXT_PUBLIC_KINDE_CONNECTION_GOOGLE_PASSWORDLESS || ""
                                    }}
                                >
                                    Sign in
                                </LoginLink>
                            </Button>

                            <Button
                            >
                                <RegisterLink className='text-white' >Get Started</RegisterLink>
                            </Button>

                        </div>
                    </div>
                </div>
                <div className='flex gap-10 mx-auto justify-center items-center' >
                    {isMobile ? (
                        <>
                            <Link
                                className={`mt-1 ${isActive('/aiFeatures') ? 'text-blue-500 underline' : ''}`}
                                href='/aiFeatures'
                            >
                                Ai Features
                            </Link>
                            <Link
                                className={`mt-1 ${isActive('/resources') ? 'text-blue-500 underline' : ''}`}
                                href='/resources'
                            >
                                Resources
                            </Link>
                            <Link
                                className={`mt-1 ${isActive('/about') ? 'text-blue-500 underline' : ''}`}
                                href='/about'
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

export default Header;