
import { Button } from "@/components/ui/button";
import { Share2, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import html2pdf from "html2pdf.js";
import { SettingsPanel } from "./SettingsPanel";
import { motion } from "framer-motion";
import { fontOptions } from "@/lib/fonts";
import { backgroundPatterns, backgroundColors } from "@/lib/patterns";

interface HeaderProps {
  markdown: string;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  selectedPattern: string;
  setSelectedPattern: (pattern: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  zoom: number;
}

export function Header({
  markdown,
  selectedFont,
  setSelectedFont,
  selectedPattern,
  setSelectedPattern,
  selectedColor,
  setSelectedColor,
  zoom,
}: HeaderProps) {
  const { toast } = useToast();

  const handleShare = () => {
    try {
      // Encode the markdown content to base64 and add it to the URL hash
      const encodedContent = btoa(encodeURIComponent(markdown));
      const shareUrl = `${window.location.origin}${window.location.pathname}#${encodedContent}`;
      
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast({
          title: "Share link copied!",
          description: "The URL with your markdown content has been copied to clipboard.",
        });
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate share link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    const element = document.getElementById('markdown-preview');
    if (!element) return;

    // Create a completely new element for PDF rendering
    const cloneElement = document.createElement('div');
    
    // Copy the HTML content from the original element
    cloneElement.innerHTML = element.innerHTML;
    
    // Get background and font styles
    const pattern = backgroundPatterns.find(p => p.id === selectedPattern);
    const color = backgroundColors.find(c => c.id === selectedColor);
    const fontFamily = fontOptions.find(f => f.value === selectedFont)?.family;
    
    // Apply all necessary styles to ensure content visibility
    cloneElement.style.fontFamily = fontFamily || "'system-ui', sans-serif";
    cloneElement.style.fontSize = `${zoom}rem`;
    cloneElement.style.lineHeight = '1.6';
    cloneElement.style.padding = '2rem';
    cloneElement.style.backgroundColor = color?.color || '#ffffff';
    cloneElement.style.color = "#000000"; // Ensure text is black for visibility
    
    // Apply background pattern if selected
    if (pattern && pattern.id !== 'none') {
      cloneElement.style.backgroundImage = pattern.pattern;
      cloneElement.style.backgroundSize = '20px 20px';
    }
    
    // Make sure all content inside has proper color
    const allTextElements = cloneElement.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, a, span, div, strong, em, code, pre');
    allTextElements.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.color = "#000000";
      }
    });
    
    // Ensure proper sizing for PDF generation
    cloneElement.style.position = 'absolute';
    cloneElement.style.left = '-9999px';
    cloneElement.style.width = '800px'; // Fixed width for consistency
    document.body.appendChild(cloneElement);

    const opt = {
      margin: 10,
      filename: 'markdown-content.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        letterRendering: true,
        useCORS: true,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(cloneElement).save();
      
      // Cleanup after PDF generation
      document.body.removeChild(cloneElement);
      
      toast({
        title: "PDF Generated!",
        description: "Your markdown content has been downloaded as PDF.",
      });
    } catch (error) {
      // Cleanup in case of error
      if (document.body.contains(cloneElement)) {
        document.body.removeChild(cloneElement);
      }
      
      console.error("PDF generation error:", error);
      
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="flex items-center justify-between max-w-[1200px] mx-auto w-full">
      <motion.h1 
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        className="text-2xl font-semibold text-[#1d1d1f]"
      >
        Markdown Magic Share
      </motion.h1>
      <div className="flex items-center gap-3">
        <SettingsPanel
          selectedFont={selectedFont}
          setSelectedFont={setSelectedFont}
          selectedPattern={selectedPattern}
          setSelectedPattern={setSelectedPattern}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
        <Button 
          onClick={handleDownload}
          variant="outline" 
          className="rounded-full bg-white/80 backdrop-blur-xl border-0 shadow-sm hover:bg-white/90"
        >
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button 
          onClick={handleShare} 
          variant="outline" 
          className="rounded-full bg-white/80 backdrop-blur-xl border-0 shadow-sm hover:bg-white/90"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </header>
  );
}
