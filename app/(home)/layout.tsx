import React from 'react'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from 'next/navigation';
import Header from './_components/common/Header';

const MainLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode
}>) => {
    const { isAuthenticated } = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();

    if (!isUserAuthenticated) {
        redirect('/')
    }
    return (
        <div className=' min-h-screen h-auto !bg-[#f8f8f8] dark:!bg-background '>
            <Header />
            <div>
                {children}
            </div>
        </div>
    )
}

export default MainLayout