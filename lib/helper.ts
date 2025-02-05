import html2canvas from "html2canvas";

export const generateThumbnail = async () => {
  const resumeElement = document.getElementById('resume-preview-id') as HTMLElement;
  if (!resumeElement) {
    console.error('Resume preview element not found');
    return;
  }

  try {
    const pixelRatio = window.devicePixelRatio || 1; // Get device pixel ratio
    const canvas = await html2canvas(resumeElement, {
<<<<<<< HEAD
      scale: 0.5 * pixelRatio, // Higher scale for sharper image
=======
      scale: 0.25 * pixelRatio, // Higher scale for sharper image
>>>>>>> 3c2efa69e5dbaeaebe5625d37c8d22900e7093a0
      width: resumeElement.scrollWidth,
      height: resumeElement.scrollHeight,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });
    const thumbnailImage = canvas.toDataURL("image/png", 1.0); // Maximum quality
    return thumbnailImage;
  } catch (error) {
    console.error("Thumbnail generation failed", error);
  }
};

export const formatFileName = (title: string, useHyphen: boolean = true) => {
  const delimiter = useHyphen ? "-" : "_";
  return title.trim().replace(/\s+/g, delimiter) + "pdf";
};
