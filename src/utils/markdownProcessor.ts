
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

// Add a new utility function to ensure text visibility in PDFs
export const ensurePdfTextVisibility = (element: HTMLElement) => {
  if (!element) return;
  
  // Force all text elements to have black color for PDF visibility
  const textElements = element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span, a, td, th');
  textElements.forEach(el => {
    (el as HTMLElement).style.color = '#000000';
  });
  
  // Handle code blocks specially
  const codeBlocks = element.querySelectorAll('[data-code-block="true"]');
  codeBlocks.forEach(block => {
    // Set background color for code blocks
    (block as HTMLElement).style.backgroundColor = '#f8fafc';
    
    // Ensure code text is black
    const codeLines = block.querySelectorAll('.line');
    codeLines.forEach(line => {
      (line as HTMLElement).style.color = '#000000';
    });
  });
  
  // Process math elements
  const mathElements = element.querySelectorAll('.katex, .katex-display');
  mathElements.forEach(el => {
    (el as HTMLElement).style.color = '#000000';
  });
  
  return element;
};
