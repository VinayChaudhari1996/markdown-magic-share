
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Menu, Share2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import html2pdf from "html2pdf.js";
import { codeBlockThemes } from "@/lib/patterns";

interface HeaderProps {
  markdown: string;
  selectedFont: string;
  selectedPattern: string;
  selectedColor: string;
  selectedCodeTheme: string;
}

export function Header({
  markdown,
  selectedFont,
  selectedPattern,
  selectedColor,
  selectedCodeTheme,
}: HeaderProps) {
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleShare = () => {
    try {
      // Include all settings in the share URL
      const contentToEncode = JSON.stringify({
        markdown,
        font: selectedFont,
        pattern: selectedPattern,
        color: selectedColor,
        codeTheme: selectedCodeTheme
      });
      
      const encodedContent = btoa(encodeURIComponent(contentToEncode));
      const shareUrl = `${window.location.origin}${window.location.pathname}#${encodedContent}`;
      
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast({
          title: "Link copied!",
          description: "Share URL has been copied to your clipboard",
        });
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate share link",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    const element = document.getElementById('markdown-preview');
    if (!element) return;

    // Create a clone of the element to modify for PDF generation
    const cloneElement = element.cloneNode(true) as HTMLElement;
    
    // Apply PDF-specific styling
    cloneElement.classList.add('pdf-visible-text');
    cloneElement.style.backgroundColor = '#ffffff';
    
    // Get current code theme for PDF export
    const codeTheme = codeBlockThemes.find(theme => theme.id === selectedCodeTheme) || codeBlockThemes[0];
    
    // Find all code blocks and ensure they have PDF-specific class and styling
    const codeBlocks = cloneElement.querySelectorAll('.markdown-code');
    codeBlocks.forEach(block => {
      block.classList.add('pdf-code-block');
      (block as HTMLElement).style.backgroundColor = codeTheme.bgColor;
      (block as HTMLElement).style.color = codeTheme.textColor;
      (block as HTMLElement).style.borderColor = codeTheme.borderColor;
      
      // Style code block elements
      const codeContent = block.querySelectorAll('code, .line') as NodeListOf<HTMLElement>;
      codeContent.forEach(element => {
        element.style.color = codeTheme.textColor;
      });
    });
    
    // Set up PDF options
    const opt = {
      margin: [16, 16, 16, 16],
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.page-break-before',
        after: '.page-break-after',
        avoid: '.markdown-code'
      }
    };

    try {
      toast({
        title: "Generating PDF...",
        description: "Please wait a moment",
      });
      
      await html2pdf().set(opt).from(cloneElement).save();
      
      toast({
        title: "PDF Downloaded",
        description: "Your document has been downloaded successfully",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            <span className="text-blue-600">M</span>arkdown Magic
          </h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-700 hover:text-gray-900"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-700 hover:text-gray-900"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </nav>
        
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="py-2 px-4 space-y-1">
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full justify-start text-gray-700"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full justify-start text-gray-700"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
