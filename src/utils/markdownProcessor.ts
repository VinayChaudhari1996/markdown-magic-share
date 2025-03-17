
/**
 * Processes markdown content to enhance math and code formatting
 */
export const processMarkdown = (content: string) => {
  if (!content) return '';
  
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

  return processed;
};

/**
 * Ensures text visibility when exporting to PDF
 * This is a crucial function to make sure all text is visible in the PDF
 */
export const ensurePdfTextVisibility = (element: HTMLElement) => {
  if (!element) return;
  
  // Force all elements to have black color for PDF visibility
  const allElements = element.querySelectorAll('*');
  allElements.forEach(el => {
    if (el instanceof HTMLElement) {
      // Ensure visibility
      el.style.color = '#000000';
      el.style.opacity = '1';
      el.style.visibility = 'visible';
      
      // Add a CSS class for PDF visibility
      el.classList.add('pdf-text');
      
      // Set text-rendering for better quality
      el.style.textRendering = 'optimizeLegibility';
      
      // Ensure non-transparent background for text elements
      if (
        el.tagName === 'P' || 
        el.tagName.match(/^H[1-6]$/) || 
        el.tagName === 'LI' || 
        el.tagName === 'SPAN' ||
        el.tagName === 'A'
      ) {
        // Only apply background to text elements
        el.style.backgroundColor = 'transparent';
        el.style.textShadow = 'none';
      }
    }
  });
  
  // Special handling for code blocks
  const codeBlocks = element.querySelectorAll('[data-code-block="true"]');
  codeBlocks.forEach(block => {
    if (block instanceof HTMLElement) {
      // Ensure code blocks have visible background and border for PDF
      block.style.backgroundColor = '#f8fafc';
      block.style.border = '1px solid #e2e8f0';
      block.style.borderRadius = '8px';
      block.style.overflow = 'hidden';
      block.style.pageBreakInside = 'avoid';
      block.style.breakInside = 'avoid';
      
      // Ensure code block header is visible
      const header = block.querySelector('.pdf-header');
      if (header instanceof HTMLElement) {
        header.style.borderBottom = '1px solid #e2e8f0';
        header.style.backgroundColor = '#f1f5f9';
        
        // Ensure language badge is visible
        const language = header.querySelector('.pdf-language');
        if (language instanceof HTMLElement) {
          language.style.color = '#000000';
          language.style.fontWeight = 'bold';
        }
      }
      
      // Process all code lines
      const codeLines = block.querySelectorAll('.line, [data-pdf-line="true"]');
      codeLines.forEach(line => {
        if (line instanceof HTMLElement) {
          line.style.color = '#000000';
          line.style.backgroundColor = 'transparent';
          line.style.display = 'block';
          line.style.whiteSpace = 'pre-wrap';
        }
      });
      
      // Ensure line numbers are visible
      const lineNumbers = block.querySelectorAll('.pdf-line-number');
      lineNumbers.forEach(num => {
        if (num instanceof HTMLElement) {
          num.style.color = '#64748b';
          num.style.backgroundColor = '#f1f5f9';
        }
      });
    }
  });
  
  // Special handling for math elements
  const mathElements = element.querySelectorAll('.katex, .katex-display, .katex-html');
  mathElements.forEach(math => {
    if (math instanceof HTMLElement) {
      math.style.color = '#000000';
      
      // Process all math sub-elements to ensure they're black
      const mathSubElements = math.querySelectorAll('*');
      mathSubElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.color = '#000000';
        }
      });
    }
  });
  
  return element;
};

/**
 * Creates a deep clone of an element optimized for PDF export
 */
export const createPdfExportClone = (element: HTMLElement) => {
  if (!element) return null;
  
  // Create a deep clone of the element
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Set optimal PDF export styles
  clone.style.width = '800px';
  clone.style.padding = '40px';
  clone.style.backgroundColor = '#ffffff';
  clone.style.position = 'relative';
  clone.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  clone.style.lineHeight = '1.5';
  clone.style.color = '#000000';
  
  // Apply visibility enhancement
  ensurePdfTextVisibility(clone);
  
  return clone;
};
