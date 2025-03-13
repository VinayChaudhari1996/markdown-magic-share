
export const processMarkdown = (content: string) => {
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

  // Enhanced code blocks format - ensure proper spacing and formatting
  // Preserve indentation and structure for PDF output
  processed = processed.replace(/```(\w*)\n([\s\S]*?)```/g, (match, language, code) => {
    // Normalize line endings
    const normalizedCode = code.replace(/\r\n/g, '\n').trim();
    
    // Count indentation levels for PDF rendering enhancement
    const lines = normalizedCode.split('\n');
    const indentationLevels = lines.map(line => {
      const match = line.match(/^(\s+)/);
      return match ? match[1].length : 0;
    });
    
    // Find the minimum indentation (excluding empty lines)
    const nonEmptyIndentations = indentationLevels.filter((level, i) => lines[i].trim().length > 0);
    const minIndentation = nonEmptyIndentations.length > 0 ? 
      Math.min(...nonEmptyIndentations) : 0;
    
    // Remove common indentation for cleaner code blocks
    const formattedLines = lines.map(line => {
      if (line.trim().length === 0) return '';
      return line.slice(Math.min(minIndentation, line.match(/^\s*/)[0].length));
    });
    
    // Ensure code blocks have proper spacing for PDF
    return `\`\`\`${language}\n${formattedLines.join('\n')}\n\`\`\``;
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
