import React, { FC, useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useResumeInfoContext } from "@/context/resume-info-provider";
import { toast } from "@/hooks/use-toast";
import { formatFileName } from "@/lib/helper";
import { StatusType } from "@/types/resume.type";
import { DownloadCloud } from "lucide-react";

const html2pdf = require('html2pdf.js') as any;

interface Props {
  title: string;
  status?: StatusType;
  isLoading: boolean;
}

const DownloadResume: FC<Props> = ({ title, status, isLoading }) => {
  const { resumeInfo } = useResumeInfoContext();
  const [loading, setLoading] = useState(false);

  const handleDownload = useCallback(async () => {
    const resumeElement = document.getElementById("resume-preview-id");
    if (!resumeElement) {
      toast({
        title: "Error",
        description: "Could not find resume element",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const fileName = formatFileName(title);
      
      // Improved A4 settings with accurate margins
      const opt = {
        margin: [20, 20, 20, 20], // Increased margins for better spacing
        filename: `${fileName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 3, // Adjusted for better clarity
          useCORS: true,
          letterRendering: true,
          scrollY: 0
        },
        jsPDF: {
          unit: 'pt',
          format: 'a4',
          orientation: 'portrait'
        }
      };

      await html2pdf().set(opt).from(resumeElement).save();
      
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