import html2canvas from "html2canvas";

export const generateThumbnail = async () => {
  const resumeElement = document.getElementById('resume-preview-id') as HTMLElement;
  if (!resumeElement) {
    console.error('Resume preview element not found');
    return;
  }

  try {
    // Ensure all fonts and images are loaded before capturing
    await document.fonts.ready;
    await Promise.all(Array.from(document.images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
    }));

    // Temporarily adjust styles to prevent content from being cut off
    const originalStyles = {
      padding: resumeElement.style.padding,
      overflow: resumeElement.style.overflow,
      backgroundColor: resumeElement.style.backgroundColor,
      color: resumeElement.style.color,
    };

    // Force light mode styles
    resumeElement.style.backgroundColor = '#ffffff'; // White background
    resumeElement.style.color = '#000000'; // Black text
    resumeElement.style.padding = '20px'; // Add padding to ensure content doesn't touch the edges
    resumeElement.style.overflow = 'visible'; // Ensure no content is hidden due to overflow

    const pixelRatio = window.devicePixelRatio || 1; // Get device pixel ratio
    const canvas = await html2canvas(resumeElement, {
      scale: 0.6 * pixelRatio, // Higher scale for sharper image
      width: resumeElement.scrollWidth,
      height: resumeElement.scrollHeight,
      useCORS: true,
      backgroundColor: null,
      logging: false,
      scrollY: 0, // Ensure no scrolling offset
    });

    // Revert styles back to original
    resumeElement.style.padding = originalStyles.padding;
    resumeElement.style.overflow = originalStyles.overflow;
    resumeElement.style.backgroundColor = originalStyles.backgroundColor;
    resumeElement.style.color = originalStyles.color;

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
