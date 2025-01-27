import { Button } from "@/components/ui/button";
import { useResumeInfoContext } from "@/context/resume-info-provider";
import { toast } from "@/hooks/use-toast";
import { formatFileName } from "@/lib/helper";
import { StatusType } from "@/types/resume.type";
import html2canvas from "html2canvas";
import { DownloadCloud } from "lucide-react";
import { jsPDF } from "jspdf";
import React, { FC, useCallback, useState } from "react";

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
        description: "Could not download",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const fileName = formatFileName(title);
    try {
      // Generate canvas with higher resolution
      const canvas = await html2canvas(resumeElement, {
        scale: 2, // Increase scale for better quality
        useCORS: true, // Handle cross-origin images
        backgroundColor: "#fff", // Ensure white background for PDFs
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth(); // A4 page width in mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // A4 page height in mm
      const imgWidth = pdfWidth; // Image width matches PDF width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Error generating PDF. Please try again.",
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
        <DownloadCloud size="17px" />
        <span className="hidden lg:flex">
          {loading ? "Generating PDF..." : "Download Resume"}
        </span>
      </div>
    </Button>
  );
};

export default DownloadResume;
