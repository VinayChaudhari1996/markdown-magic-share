
import { Button } from "@/components/ui/button";
import { Share2, Download, Moon, Sun } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import html2pdf from "html2pdf.js";
import { SettingsPanel } from "./SettingsPanel";
import { motion } from "framer-motion";
import { fontOptions } from "@/lib/fonts";
import { backgroundPatterns, backgroundColors } from "@/lib/patterns";
import { cn } from "@/lib/utils";

interface HeaderProps {
  markdown: string;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  selectedPattern: string;
  setSelectedPattern: (pattern: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  zoom: number;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
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
  isDarkMode,
  setIsDarkMode,
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

    // Create a wrapper div with fixed dimensions for the PDF
    const wrapper = document.createElement('div');
    wrapper.style.width = '800px';  // fixed width for PDF
    wrapper.style.padding = '40px';
    wrapper.style.visibility = 'hidden';
    wrapper.style.position = 'absolute';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '0';
    
    // Get styling details
    const pattern = backgroundPatterns.find(p => p.id === selectedPattern);
    const color = backgroundColors.find(c => c.id === selectedColor);
    const fontFamily = fontOptions.find(f => f.value === selectedFont)?.family;
    
    // Set wrapper styles
    wrapper.style.backgroundColor = color?.color || '#ffffff';
    if (pattern && pattern.id !== 'none') {
      wrapper.style.backgroundImage = pattern.pattern;
      wrapper.style.backgroundSize = '20px 20px';
    }
    
    // Create a deep clone of the markdown content
    const content = document.createElement('div');
    content.innerHTML = element.innerHTML;
    
    // Apply global styles
    content.style.fontFamily = fontFamily || "'system-ui', sans-serif";
    content.style.fontSize = `${zoom}rem`;
    content.style.lineHeight = '1.6';
    content.style.color = isDarkMode ? '#E5E7EB' : '#1F2937';
    
    // Add content to wrapper
    wrapper.appendChild(content);
    
    // Force all text elements to have proper color and visibility
    const allElements = content.querySelectorAll('*');
    allElements.forEach(el => {
      if (el instanceof HTMLElement) {
        // Always ensure text is visible in PDF export
        el.style.color = isDarkMode ? '#E5E7EB' : '#1F2937';
        
        // Preserve code block styling but ensure text is visible
        if (el.tagName === 'CODE' || el.tagName === 'PRE') {
          el.style.backgroundColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
          el.style.padding = el.tagName === 'PRE' ? '1em' : '0.2em 0.4em';
          el.style.borderRadius = '3px';
          el.style.fontFamily = "'SF Mono', monospace";
        }
        
        // Fix any potential issues with visibility
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.display = el.style.display === 'none' ? 'block' : el.style.display;
      }
    });
    
    // Add to body for html2pdf to work with it
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
        logging: true,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
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
    <header className="flex flex-col sm:flex-row sm:items-center justify-between max-w-[1200px] mx-auto w-full gap-4">
      <motion.h1 
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        className={cn(
          "text-2xl font-semibold",
          isDarkMode ? "text-white" : "text-[#1d1d1f]"
        )}
      >
        Markdown Magic Share
      </motion.h1>
      <div className="flex items-center gap-3 flex-wrap justify-end">
        <SettingsPanel
          selectedFont={selectedFont}
          setSelectedFont={setSelectedFont}
          selectedPattern={selectedPattern}
          setSelectedPattern={setSelectedPattern}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
        <Button 
          onClick={handleDownload}
          variant="outline" 
          className={cn(
            "rounded-full border-0 shadow-sm",
            isDarkMode
              ? "bg-gray-800/80 backdrop-blur-xl hover:bg-gray-700/90 text-gray-300"
              : "bg-white/80 backdrop-blur-xl hover:bg-white/90 text-gray-700"
          )}
        >
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button 
          onClick={handleShare} 
          variant="outline" 
          className={cn(
            "rounded-full border-0 shadow-sm",
            isDarkMode
              ? "bg-gray-800/80 backdrop-blur-xl hover:bg-gray-700/90 text-gray-300"
              : "bg-white/80 backdrop-blur-xl hover:bg-white/90 text-gray-700"
          )}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </header>
  );
}
