"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import PersonalInfoPreview from "@/app/(home)/_components/PersonalInfoPreview";
import SummaryPreview from "@/app/(home)/_components/SummaryPreview";
import ExperiencePreview from "@/app/(home)/_components/ExperiencePreview";
import ProjectPreview from "@/app/(home)/_components/ProjectsPreview";
import EducationPreview from "@/app/(home)/_components/EducationPreview";
import SkillsPreview from "@/app/(home)/_components/SkillsPreview";
import useGetDocument from "@/features/use-get-document-by-id";
import { ResumeDataType } from "@/types/resume.type";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton from shadcn
import SkeletonLoader from "@/components/SkeletonLoader";

const A4_WIDTH_PX = 794; // A4 width in pixels at 96 DPI
const A4_HEIGHT_PX = 1123; // A4 height in pixels at 96 DPI

const LoadingSkeleton = () => {
    return (
        <div className="space-y-4">
            {/* Personal Info Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-6 w-1/2 mx-auto mb-2" />
                <Skeleton className="h-6 w-1/4 mx-auto mb-2" />
                <Skeleton className="h-6 w-1/3 mx-auto mb-2" />
                <div className="flex justify-between pt-3">
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-[1.5] w-full my-2" />
            </div>

            {/* Summary Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
            </div>

            {/* Experience Skeleton */}
            <div className="space-y-2">
                <SkeletonLoader />
            </div>

            {/* Projects Skeleton */}
            <div className="space-y-2">
                <SkeletonLoader />
            </div>

            {/* Education Skeleton */}
            <div className="space-y-2">
                <SkeletonLoader />
            </div>

            {/* Skills Skeleton */}
            <div className="space-y-2">
                <SkeletonLoader />
            </div>
        </div>
    );
};

const Page = () => {
    const { documentId } = useParams();
    const { data, isSuccess, isLoading, isError } = useGetDocument(documentId as string);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-card">
            <div
                className="bg-white shadow-lg p-6 dark:bg-gray-900"
                style={{
                    width: `${A4_WIDTH_PX}px`,
                    minHeight: `${A4_HEIGHT_PX}px`,
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                }}
            >
                {isLoading && <LoadingSkeleton />}
                {isError && <p>Error loading document</p>}

                {isSuccess && (
                    <div id="resume-preview-id">
                        <PersonalInfoPreview resumeInfo={data?.data as ResumeDataType} isLoading={isLoading} />
                        <SummaryPreview resumeInfo={data?.data as ResumeDataType} isLoading={isLoading} />
                        <ExperiencePreview resumeInfo={data?.data as ResumeDataType} isLoading={isLoading} />
                        <ProjectPreview resumeInfo={data?.data as ResumeDataType} isLoading={isLoading} />
                        <EducationPreview resumeInfo={data?.data as ResumeDataType} isLoading={isLoading} />
                        <SkillsPreview resumeInfo={data?.data as ResumeDataType} isLoading={isLoading} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;