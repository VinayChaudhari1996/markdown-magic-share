/**
 * Processes markdown content to enhance math and code formatting
 */
export const processMarkdown = (content: string) => {
  if (!content) return '';
  
  console.log("Processing markdown content for rendering");
  
  // First, handle display math mode \[ ... \]
  let processed = content.replace(/\\[\s]*\[([\s\S]*?)\\[\s]*\]/g, (_, math) => {
    const trimmedMath = math.trim();
    return `$$\n${trimmedMath}\n$$`;
  });

  // Then handle inline math mode that's not already in $...$ format
  processed = processed.replace(/\\(\(|\{)(.*?)\\(\)|\})/g, (_, open, math, close) => {
    const trimmedMath = math.trim();
    return `$${trimmedMath}$`;
  });

  // Fix common LaTeX commands that might be escaped incorrectly
  processed = processed
    .replace(/\\\\/g, '\\') // Fix double backslashes
    .replace(/\\nabla(?![a-zA-Z])/g, '\\nabla ') // Add space after \nabla if not followed by letter
    .replace(/\\theta(?![a-zA-Z])/g, '\\theta ') // Add space after \theta if not followed by letter
    .replace(/\\alpha(?![a-zA-Z])/g, '\\alpha ') // Add space after \alpha if not followed by letter
    .replace(/\\frac(?!\{)/g, '\\frac{') // Ensure \frac is followed by {
    .replace(/\\_/g, '_'); // Fix escaped underscores

  console.log("Markdown processing completed");
  return processed;
};

/**
 * Creates a deep clone optimized for PDF export
 * This is crucial for ensuring elements are visible in exported PDFs
 */
export const createPdfExportClone = (element: HTMLElement) => {
  console.error("DEPRECATED: createPdfExportClone is deprecated, use exportToPdf from pdfExport.ts instead");
  
  if (!element) {
    console.error('Element not found for PDF export');
    return null;
  }

  const clone = element.cloneNode(true) as HTMLElement;
  clone.classList.add('pdf-export-clone');
  
  // For backward compatibility, apply basic styling
  clone.style.width = '800px';
  clone.style.backgroundColor = '#ffffff';
  clone.style.padding = '40px';
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  
  console.warn("Using deprecated PDF export function - please update to new method");
  
  return clone;
};

/**
 * Force all elements to be visible in PDF export
 * This is a critical function that ensures text appears in the PDF
 */
export const forcePdfVisibility = (element: HTMLElement) => {
  console.error("DEPRECATED: forcePdfVisibility is deprecated, use exportToPdf from pdfExport.ts instead");
  
  if (!element) {
    console.error('No element provided to forcePdfVisibility');
    return;
  }
  
  // Apply deprecated visibility styles
  const allElements = element.querySelectorAll('*');
  console.log(`Processing ${allElements.length} elements for PDF visibility (deprecated method)`);
  
  allElements.forEach(el => {
    if (el instanceof HTMLElement) {
      el.style.setProperty('color', '#000000', 'important');
      el.style.setProperty('visibility', 'visible', 'important');
      el.style.setProperty('opacity', '1', 'important');
    }
  });
  
  return element;
};
