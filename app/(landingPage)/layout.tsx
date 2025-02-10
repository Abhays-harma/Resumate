import React from 'react'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from 'next/navigation';
import Header from './components/Header';
import Footer from './components/Footer';

const LandingLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  if (isUserAuthenticated) {
    redirect('/dashboard/documents')
  }
  return (
    <div className='min-h-screen h-auto !bg-[#f8f8f8] dark:!bg-background'>
      <Header />
      <div>
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default LandingLayout