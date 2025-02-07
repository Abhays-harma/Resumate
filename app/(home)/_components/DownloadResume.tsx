import { Button } from "@/components/ui/button";
import { useResumeInfoContext } from "@/context/resume-info-provider";
import { toast } from "@/hooks/use-toast";
import { formatFileName } from "@/lib/helper";
import { StatusType } from "@/types/resume.type";
import { DownloadCloud } from "lucide-react";
import React, { FC, useCallback, useState } from "react";

// Import html2pdf with type assertion
const html2pdf = require('html2pdf.js') as any;

interface Props {
  title: string;
  status?: StatusType;
  isLoading: boolean;
}

// Define options interface inline
interface PdfOptions {
  margin?: number[];
  filename?: string;
  image?: {
    type?: string;
    quality?: number;
  };
  html2canvas?: {
    scale?: number;
    useCORS?: boolean;
    letterRendering?: boolean;
  };
  jsPDF?: {
    unit?: string;
    format?: string | number[];
    orientation?: string;
  };
}

const DownloadResume: FC<Props> = ({ title, status, isLoading }) => {
  const { resumeInfo } = useResumeInfoContext();
  const [loading, setLoading] = useState(false);

  const handleDownload = useCallback(async () => {
    const resumeElement = document.getElementById("resume-preview-id");
    if (!resumeElement) {
      toast({
        title: "Error",
        description: "Could not download",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const fileName = formatFileName(title);
      
      const opt: PdfOptions = {
        margin: [0, 0, 0, 0],
        filename: `${fileName}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: {
          unit: 'in',
          format: 'a4',
          orientation: 'portrait'
        }
      };

      await html2pdf()
        .set(opt)
        .from(resumeElement)
        .save();

      toast({
        title: "Success",
        description: "Resume downloaded successfully",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Error",
        description: "Failed to download resume",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [title]);

  return (
    <Button
      disabled={resumeInfo?.status === "archived" || isLoading}
      variant="secondary"
      className="bg-white border gap-1 dark:bg-gray-800 !w-10 lg:!w-36 !p-2 lg:!p-4 flex items-center justify-center"
      onClick={handleDownload}
    >
      <div className="flex items-center justify-center gap-1 w-full">
        <DownloadCloud className="text-purple-500" size="17px" />
        <span className="hidden lg:flex">
          {loading ? "Generating PDF..." : "Download Resume"}
        </span>
      </div>
    </Button>
  );
};

export default DownloadResume;