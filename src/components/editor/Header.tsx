
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
    // Get the original element
    const element = document.getElementById('markdown-preview');
    if (!element) {
      toast({
        title: "Error",
        description: "Could not find content to export.",
        variant: "destructive",
      });
      return;
    }

    // Create a wrapper div with white background
    const wrapper = document.createElement('div');
    wrapper.style.width = '800px';  // fixed width for PDF
    wrapper.style.padding = '40px';
    wrapper.style.backgroundColor = '#ffffff';
    wrapper.style.visibility = 'hidden';
    wrapper.style.position = 'absolute';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '0';
    
    // Get styling details but ensure visibility
    const pattern = backgroundPatterns.find(p => p.id === selectedPattern);
    const color = backgroundColors.find(c => c.id === selectedColor);
    const fontFamily = fontOptions.find(f => f.value === selectedFont)?.family;
    
    // Clone the content instead of creating a new div
    const content = element.cloneNode(true) as HTMLElement;
    
    // Set essential styles to ensure visibility
    content.style.fontFamily = fontFamily || "'system-ui', sans-serif";
    content.style.fontSize = `${zoom}rem`;
    content.style.lineHeight = '1.6';
    
    // Most importantly, force text color to be black
    const allElements = content.querySelectorAll('*');
    allElements.forEach(el => {
      if (el instanceof HTMLElement) {
        // Make all text black for maximum visibility
        el.style.color = '#000000';
        
        // Special handling for code blocks
        if (el.tagName === 'CODE' || el.tagName === 'PRE') {
          el.style.backgroundColor = '#f6f6f6';
          el.style.padding = el.tagName === 'PRE' ? '1em' : '0.2em 0.4em';
          el.style.borderRadius = '3px';
          el.style.fontFamily = "'SF Mono', monospace";
          el.style.color = '#000000';
        }
        
        // Ensure images and other elements are visible
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.display = el.style.display === 'none' ? 'block' : el.style.display;
      }
    });
    
    // Reset background to white for better readability
    content.style.backgroundColor = '#ffffff';
    content.style.backgroundImage = 'none';
    
    // Append the cloned content to wrapper
    wrapper.appendChild(content);
    document.body.appendChild(wrapper);

    // Configure PDF options
    const opt = {
      margin: 10,
      filename: 'markdown-content.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        letterRendering: true,
        useCORS: true,
        backgroundColor: '#ffffff',
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        putOnlyUsedFonts: true,
        floatPrecision: 16
      }
    };

    try {
      // Generate and save PDF
      await html2pdf().set(opt).from(wrapper).save();
      
      // Clean up
      document.body.removeChild(wrapper);
      
      toast({
        title: "PDF Generated!",
        description: "Your markdown content has been downloaded as PDF.",
      });
    } catch (error) {
      // Clean up in case of error
      if (document.body.contains(wrapper)) {
        document.body.removeChild(wrapper);
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
