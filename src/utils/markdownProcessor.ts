
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
