
import { Button } from "@/components/ui/button";
import { Share2, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import html2pdf from "html2pdf.js";
import { SettingsPanel } from "./SettingsPanel";
import { motion } from "framer-motion";

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

    // Create a clone of the element to modify for PDF generation
    const cloneElement = element.cloneNode(true) as HTMLElement;
    
    // Force black text color for PDF visibility
    cloneElement.classList.add('pdf-visible-text');
    
    // Set up PDF options
    const opt = {
      margin: 10,
      filename: 'markdown-content.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: true
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // Use the cloned element for PDF generation
      await html2pdf().set(opt).from(cloneElement).save();
      
      toast({
        title: "PDF Generated!",
        description: "Your markdown content has been downloaded as PDF.",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="flex flex-col md:flex-row items-center justify-between max-w-[1200px] mx-auto w-full gap-4">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="floating"
      >
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-500 bg-clip-text text-transparent">
          Markdown Magic Share
        </h1>
      </motion.div>
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
          className="rounded-full glass hover:bg-white/80 transition-all duration-200"
        >
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button 
          onClick={handleShare} 
          variant="outline" 
          className="rounded-full glass hover:bg-white/80 transition-all duration-200"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </header>
  );
}
