import React from 'react';
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Header from './components/Header';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import Image from 'next/image';
import { Check, X } from 'lucide-react';
import Footer from './components/Footer';

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
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Star Rating */}
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-2xl">★</span>
              ))}
            </div>

            {/* Testimonial Text */}
            <p className="text-center text-2xl font-semibold mb-8 text-gray-800 leading-tight">
              Resumate is an awesome AI-based resume builder that includes templates to help you design a resume that is sure to check the boxes when it comes to applicant tracking systems. This is a great jumping off point to kickstart a new resume.
            </p>

            {/* Author Section */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <img
                src='./pass.jpg'
                alt="Profile"
                className="w-12 h-12 rounded-full"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">Abhay Sharma</span>
                <span className="text-gray-600">Career Contributor</span>
              </div>
              <img
                src="https://cdn.brandfetch.io/id78YVtrRp/theme/dark/logo.svg?c=1bfwsmEH20zzEfSNTed"
                alt="Forbes"
                className="h-8 ml-4"
              />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-gray-600 mb-2">Total Users (this is annoying to update)</p>
                <p className="text-4xl font-bold text-blue-500">3,049,450</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 mb-2">Interview Rate</p>
                <p className="text-4xl font-bold text-blue-500">62.18%</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 mb-2">Avg. User Review</p>
                <p className="text-4xl font-bold text-blue-500">8.23/10</p>
              </div>
            </div>
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
      <div className="min-h-[600px] w-full bg-gradient-to-br from-indigo-950 to-indigo-700 mx-0 px-6 py-16">
        <div className="max-w-6xl">
          {/* Subtitle */}
          <div className="mb-8">
            <p className="text-blue-400 text-lg">
              The smartest AI for resume & cover letter writing
            </p>
          </div>

          {/* Main Heading */}
          <h1 className="text-white text-5xl md:text-6xl font-bold max-w-4xl leading-tight mb-8">
            Resume + cover letter ready in 5 minutes. Perfectly optimized.
          </h1>

          {/* Description */}
          <p className="text-gray-200 text-lg md:text-xl max-w-4xl leading-relaxed">
            No job interview callbacks? Maybe your resume isn't up to par. Let Rezi help. Our AI resume maker follows best practices and understands what kind of skills and experience employers need, so it can help you write an amazing resume in minutes.
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="mb-12">
          <p className="text-blue-500 mb-4">Its never been easier to make your resume</p>
          <h2 className="text-4xl font-bold mb-6">
            <span className="text-blue-500">Content-focused</span> features
            <br />
            developed to get you hired
          </h2>
          <button className="px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm">
            Create Free Resume
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left side - Screenshot */}
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 p-8 rounded-xl">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">AI Keyword Targeting <span className="text-gray-400 text-sm">v2</span></h3>
              </div>
              <p className="text-gray-600 mb-6">Great work! You're ranking well for these keywords in the job description:</p>

              {/* Keywords List */}
              <div className="space-y-3">
                {[
                  'Marketing Strategy',
                  'Analytics',
                  'Marketing Objectives',
                  'Customer Segmentation Program'
                ].map(keyword => (
                  <div key={keyword} className="flex items-center justify-between">
                    <span>{keyword}</span>
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <p className="text-gray-600 mb-4">Want to improve your chances of getting this role? Consider adding the following keywords to your resume:</p>
                <div className="space-y-3">
                  {['Product Analyst', 'Content Design'].map(keyword => (
                    <div key={keyword} className="flex items-center justify-between">
                      <span>{keyword}</span>
                      <X className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Features List */}
          <div className="space-y-12">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-1 h-16 bg-blue-500"></div>
                <h3 className="text-2xl font-semibold">ATS Keyword Targeting</h3>
              </div>
              <p className="text-gray-600">
                Instantly improve your chances of being selected for an interview by using the targeted keywords identified by Rezi.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">Real Time Content Analysis</h3>
              <p className="text-gray-600">
                Rezi instantly identifies common content errors such as missing bullet points, buzz words, useful content, and more.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">The Rezi Score</h3>
              <p className="text-gray-600">
                The Rezi Score critiques how well you've created your resume across 23 criteria points - translating the result into a score rated from 1 - 100.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-4 md:p-8 font-sans">
        {/* Main container with flex layout for side-by-side on desktop */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Header Section - Takes full width on mobile, 40% on desktop */}
          <div className="lg:w-5/12 lg:sticky lg:top-8 lg:self-start">
            <p className="text-blue-600 mb-2">Even more reasons to love Rezi</p>
            <h1 className="text-4xl font-bold mb-4">
              Rezi Does More Than Any Other Resume Builder.
            </h1>
            <p className="text-gray-600 mb-6">
              Rezi makes it easy to get the help you need, stay organized, and take on any challenge. Its clear, simple design just makes sense — especially if you have many applications. So things like managing multiple resumes and keeping track of your files are a breeze.
            </p>
            <button className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
              Explore Rezi User Guides
            </button>
          </div>

          {/* Features Grid - Takes full width on mobile, 60% on desktop */}
          <div className="lg:w-7/12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Share Resume Card */}
              <div className="transform hover:scale-[1.02] transition-transform">
                <img
                  src="/custom-url.png"
                  alt="Custom URL sharing interface"
                  className="w-full rounded-lg shadow-sm mb-3"
                />
                <h2 className="text-xl font-semibold">Custom URL for Sharing</h2>
              </div>

              {/* AI Keyword Tailoring Card */}
              <div className="transform hover:scale-[1.02] transition-transform">
                <img
                  src="/keyword-tailoring.png"
                  alt="AI Keyword Tailoring interface"
                  className="w-full rounded-lg shadow-sm mb-3"
                />
                <h2 className="text-xl font-semibold">AI Keyword Tailoring</h2>
              </div>

              {/* AI Keyword Targeting Card */}
              <div className="transform hover:scale-[1.02] transition-transform">
                <img
                  src="/keyword-targeting.png"
                  alt="AI Keyword Targeting interface"
                  className="w-full rounded-lg shadow-sm mb-3"
                />
                <h2 className="text-xl font-semibold">AI Keyword Targeting</h2>
              </div>

              {/* AI Summary Writer Card */}
              <div className="transform hover:scale-[1.02] transition-transform">
                <img
                  src="/summary-writer.png"
                  alt="AI Summary Writer interface"
                  className="w-full rounded-lg shadow-sm mb-3"
                />
                <h2 className="text-xl font-semibold">AI Summary Writer</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Page;
