
import html2pdf from "html2pdf.js";
import { toast } from "@/components/ui/use-toast";

/**
 * Comprehensive PDF export utility with robust text visibility handling
 */
export async function exportToPdf(elementId: string, filename: string = "document.pdf"): Promise<boolean> {
  console.log("Starting PDF export process for element:", elementId);
  
  // Find the target element
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("PDF Export Error: Target element not found", elementId);
    return false;
  }
  
  try {
    // Create an optimized clone for PDF export
    const clone = createOptimizedPdfClone(element);
    document.body.appendChild(clone);
    
    console.log("Created optimized PDF clone");
    
    // Wait for any async rendering to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Configure PDF options with optimal settings for text rendering
    const options = {
      margin: [15, 15, 15, 15],
      filename: filename,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        logging: true,
        backgroundColor: '#FFFFFF',
        letterRendering: true,
        allowTaint: true,
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: false,
      },
      pagebreak: { mode: ['avoid-all', 'css'] }
    };
    
    console.log("PDF export options configured:", JSON.stringify(options, null, 2));
    
    // Generate and save the PDF
    await html2pdf().from(clone).set(options).save();
    
    // Clean up
    document.body.removeChild(clone);
    console.log("PDF export completed successfully");
    return true;
  } catch (error) {
    console.error("PDF Export Error:", error);
    return false;
  }
}

/**
 * Creates an optimized clone specifically for PDF export
 * This function ensures all text is visible in the PDF
 */
function createOptimizedPdfClone(element: HTMLElement): HTMLElement {
  console.log("Creating optimized clone for PDF export");
  
  // Create a deep clone
  const clone = element.cloneNode(true) as HTMLElement;
  clone.id = "pdf-export-clone";
  
  // Apply critical PDF styles
  clone.style.width = "800px";
  clone.style.padding = "40px";
  clone.style.backgroundColor = "#FFFFFF";
  clone.style.position = "absolute";
  clone.style.left = "-9999px";
  clone.style.top = "0";
  clone.classList.add("pdf-export-clone");
  
  // Force visibility of all elements
  forceElementVisibility(clone);
  
  return clone;
}

/**
 * Recursively processes all elements to ensure PDF visibility
 */
function forceElementVisibility(element: HTMLElement): void {
  console.log(`Processing element for visibility: ${element.tagName}${element.id ? '#' + element.id : ''}`);
  
  // Force current element to be visible with black text
  applyVisibilityStyles(element);
  
  // Process code blocks specially
  if (element.classList.contains('markdown-code') || 
      element.hasAttribute('data-code-block') || 
      element.tagName === 'PRE') {
    applyCodeBlockStyles(element);
  }
  
  // Process all child elements recursively
  const children = element.querySelectorAll('*');
  console.log(`Processing ${children.length} child elements for visibility`);
  
  children.forEach((child, index) => {
    if (child instanceof HTMLElement) {
      // Apply visibility styles to all elements
      applyVisibilityStyles(child);
      
      // Special handling for specific elements
      if (child.classList.contains('line') || 
          child.hasAttribute('data-pdf-line')) {
        applyCodeLineStyles(child);
      }
      
      // Handle math expressions
      if (child.classList.contains('katex') || 
          child.classList.contains('katex-display') || 
          child.classList.contains('katex-math')) {
        applyMathStyles(child);
      }
      
      // Log progress periodically to avoid console flood
      if (index % 100 === 0) {
        console.log(`Processed ${index} elements for PDF visibility`);
      }
    }
  });
}

/**
 * Apply basic visibility styles to any element
 */
function applyVisibilityStyles(element: HTMLElement): void {
  // Critical styles to ensure visibility in PDF
  element.style.setProperty('color', '#000000', 'important');
  element.style.setProperty('visibility', 'visible', 'important');
  element.style.setProperty('opacity', '1', 'important');
  element.style.setProperty('display', element.style.display === 'none' ? 'block' : element.style.display, 'important');
  element.style.setProperty('-webkit-print-color-adjust', 'exact', 'important');
  element.style.setProperty('print-color-adjust', 'exact', 'important');
  
  // Add data attribute for debugging
  element.setAttribute('data-pdf-processed', 'true');
}

/**
 * Apply specific styles for code blocks
 */
function applyCodeBlockStyles(element: HTMLElement): void {
  console.log(`Applying code block styles to ${element.tagName}${element.id ? '#' + element.id : ''}`);
  
  element.style.setProperty('page-break-inside', 'avoid', 'important');
  element.style.setProperty('break-inside', 'avoid', 'important');
  element.style.setProperty('background-color', '#f8f8f8', 'important');
  element.style.setProperty('border', '1px solid #e0e0e0', 'important');
  element.style.setProperty('border-radius', '4px', 'important');
  element.style.setProperty('font-family', 'monospace', 'important');
  element.style.setProperty('white-space', 'pre-wrap', 'important');
  element.style.setProperty('word-break', 'break-word', 'important');
  element.style.setProperty('overflow', 'visible', 'important');
  
  // Process all code lines within
  const codeLines = element.querySelectorAll('.line, [data-pdf-line]');
  codeLines.forEach(line => {
    if (line instanceof HTMLElement) {
      applyCodeLineStyles(line);
    }
  });
}

/**
 * Apply specific styles for code lines
 */
function applyCodeLineStyles(element: HTMLElement): void {
  element.style.setProperty('color', '#000000', 'important');
  element.style.setProperty('font-family', 'monospace', 'important');
  element.style.setProperty('white-space', 'pre-wrap', 'important');
  element.style.setProperty('word-break', 'break-word', 'important');
  element.style.setProperty('background-color', 'transparent', 'important');
  element.style.setProperty('display', 'block', 'important');
}

/**
 * Apply specific styles for math expressions
 */
function applyMathStyles(element: HTMLElement): void {
  element.style.setProperty('color', '#000000', 'important');
  element.style.setProperty('opacity', '1', 'important');
  
  // Process all child elements of math expressions
  const mathParts = element.querySelectorAll('*');
  mathParts.forEach(part => {
    if (part instanceof HTMLElement) {
      part.style.setProperty('color', '#000000', 'important');
      part.style.setProperty('opacity', '1', 'important');
      part.style.setProperty('visibility', 'visible', 'important');
    }
  });
}
