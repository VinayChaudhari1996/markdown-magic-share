
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
 * Creates a deep clone optimized for PDF export
 * This is crucial for ensuring elements are visible in exported PDFs
 */
export const createPdfExportClone = (element: HTMLElement) => {
  console.log('Creating PDF export clone');
  if (!element) {
    console.error('Element not found for PDF export');
    return null;
  }

  // Create a deep clone of the element
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Add a specific class for PDF export
  clone.classList.add('pdf-export-container');
  
  // Force important style properties for PDF export
  clone.style.width = '800px';
  clone.style.backgroundColor = '#ffffff';
  clone.style.color = '#000000';
  clone.style.fontFamily = 'Arial, Helvetica, sans-serif';
  clone.style.fontSize = '12pt';
  clone.style.lineHeight = '1.5';
  clone.style.letterSpacing = 'normal';
  clone.style.fontWeight = 'normal';
  clone.style.padding = '40px';
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  
  // Apply force visibility to all elements in the clone
  forcePdfVisibility(clone);
  
  console.log('PDF clone created and optimized');
  return clone;
};

/**
 * Force all elements to be visible in PDF export
 * This is a critical function that ensures text appears in the PDF
 */
export const forcePdfVisibility = (element: HTMLElement) => {
  console.log('Forcing PDF visibility on elements');
  
  if (!element) {
    console.error('No element provided to forcePdfVisibility');
    return;
  }
  
  // CRITICAL: Ensure ALL elements have black text and are visible
  const allElements = element.querySelectorAll('*');
  console.log(`Processing ${allElements.length} elements for PDF visibility`);
  
  allElements.forEach((el, index) => {
    if (el instanceof HTMLElement) {
      // Override ALL text colors to black
      el.style.setProperty('color', '#000000', 'important');
      el.style.setProperty('fill', '#000000', 'important');
      el.style.setProperty('visibility', 'visible', 'important');
      el.style.setProperty('opacity', '1', 'important');
      el.style.setProperty('display', el.style.display === 'none' ? 'block' : el.style.display, 'important');
      
      // Add a data attribute to track processed elements
      el.setAttribute('data-pdf-processed', 'true');
      
      // Log every 100 elements to avoid console flood
      if (index % 100 === 0) {
        console.log(`Processed ${index} elements for PDF visibility`);
      }
    }
  });
  
  // Special handling for text elements
  const textElements = element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span, a, td, th');
  textElements.forEach(el => {
    if (el instanceof HTMLElement) {
      el.classList.add('pdf-visible-text');
      el.style.setProperty('color', '#000000', 'important');
      el.style.setProperty('text-shadow', 'none', 'important');
      el.style.setProperty('background-color', 'transparent', 'important');
      el.style.setProperty('-webkit-text-fill-color', '#000000', 'important');
    }
  });

  // Special handling for code blocks
  const codeBlocks = element.querySelectorAll('pre, code, [data-code-block="true"], .code-block');
  console.log(`Found ${codeBlocks.length} code blocks to process`);
  
  codeBlocks.forEach(block => {
    if (block instanceof HTMLElement) {
      block.classList.add('pdf-code-block');
      block.style.setProperty('background-color', '#f8fafc', 'important');
      block.style.setProperty('border', '1px solid #e2e8f0', 'important');
      block.style.setProperty('page-break-inside', 'avoid', 'important');
      block.style.setProperty('break-inside', 'avoid', 'important');
      
      // Process all code lines inside this block
      const codeLines = block.querySelectorAll('.line');
      codeLines.forEach(line => {
        if (line instanceof HTMLElement) {
          line.style.setProperty('color', '#000000', 'important');
          line.style.setProperty('white-space', 'pre-wrap', 'important');
        }
      });
    }
  });
  
  // Handle math expressions (KaTeX elements)
  const mathElements = element.querySelectorAll('.katex, .katex-display, .katex-html');
  mathElements.forEach(math => {
    if (math instanceof HTMLElement) {
      math.style.setProperty('color', '#000000', 'important');
      const mathParts = math.querySelectorAll('*');
      mathParts.forEach(part => {
        if (part instanceof HTMLElement) {
          part.style.setProperty('color', '#000000', 'important');
        }
      });
    }
  });
  
  console.log('PDF visibility enforcement complete');
  return element;
};
