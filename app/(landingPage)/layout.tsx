import React from 'react'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from 'next/navigation';
import Header from './components/Header';
import Footer from './components/Footer';

const LandingLayout =async ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  if(isUserAuthenticated){
    redirect('/dashboard/documents')
  }
  return (
    <div>
      <Header/>
      {children}
      <Footer/>
    </div>
  )
}

export default LandingLayout