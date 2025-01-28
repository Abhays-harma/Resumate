import React from 'react';
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Header from './components/Header';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import Image from 'next/image';

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <Header />
      <div className="w-full max-w-5xl px-6 pt-16 mt-10 text-center">
        <div className="flex flex-col gap-6 justify-center">
          <h1 className="text-5xl font-extrabold text-gray-800">
            Get dream jobs with our
            <span className="text-blue-600"> AI </span>
            <span className="text-green-500"> POWERED </span>
            resume builder
          </h1>
          <h5 className="text-lg text-gray-600">
            Build a professional resume with our free builder and share it with a shareable link
          </h5>
          <div className="flex gap-4 justify-center items-center mt-8">
            <Button className="px-6 py-3 text-lg font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg">
              Get Started
            </Button>
            <Button className="px-6 py-3 text-lg font-medium bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 shadow-lg flex items-center gap-2">
              <Video />
              Watch Video
            </Button>
          </div>
        </div>
      </div>
      <div className="relative px-4 sm:px-6 lg:px-8 mt-5 mb-10">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 blur-3xl opacity-60 -z-10 h-full w-full"></div>

        {/* Image Container */}
        <div className="relative mx-auto w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl rounded-xl overflow-hidden shadow-lg border border-gray-200">
          <Image
            src="/reumate.png"
            alt="App dashboard"
            layout='responsive'
            width={1920}
            height={1080}
            className="object-cover"
          />
        </div>
      </div>

    </div>
  );
};

export default Page;
