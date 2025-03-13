
import { Button } from "@/components/ui/button";
import { Share2, Download, Menu } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import html2pdf from "html2pdf.js";
import { SettingsPanel } from "./SettingsPanel";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleShare = () => {
    try {
      // Include all settings in the share URL
      const contentToEncode = JSON.stringify({
        markdown,
        font: selectedFont,
        pattern: selectedPattern,
        color: selectedColor,
      });
      
      const encodedContent = btoa(encodeURIComponent(contentToEncode));
      const shareUrl = `${window.location.origin}${window.location.pathname}#${encodedContent}`;
      
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast({
          title: "Share link copied!",
          description: "The URL with your content and settings has been copied to clipboard.",
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
    
    // Apply PDF-specific styling
    cloneElement.classList.add('pdf-visible-text');
    cloneElement.style.backgroundColor = '#ffffff';
    
    // Find all code blocks and ensure they have PDF-specific class
    const codeBlocks = cloneElement.querySelectorAll('.markdown-code');
    codeBlocks.forEach(block => {
      block.classList.add('pdf-code-block');
    });
    
    // Ensure line numbers are visible and styled correctly in PDF
    const lineNumbers = cloneElement.querySelectorAll('.markdown-code pre > div:first-child');
    lineNumbers.forEach(lines => {
      lines.classList.add('line-numbers');
    });
    
    // Set up PDF options with higher quality and better page breaks
    const opt = {
      margin: [20, 20, 20, 20],
      filename: 'markdown-content.pdf',
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
      // Show a loading toast
      toast({
        title: "Generating PDF...",
        description: "Please wait while we prepare your document.",
      });
      
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
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
            Markdown Magic
          </h1>
          
          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex ml-6">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 px-4 bg-white/80">
                  About
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ScrollArea className="h-[400px] w-[400px] p-4">
                    <div className="grid gap-3 p-4">
                      <h4 className="font-medium leading-none">About Markdown Magic</h4>
                      <p className="text-sm text-muted-foreground">
                        Create beautiful markdown documents and share them with others.
                        Supports LaTeX, code highlighting, and PDF export.
                      </p>
                    </div>
                    <div className="grid gap-3 p-4 border-t pt-2">
                      <h4 className="font-medium leading-none">Tips</h4>
                      <ul className="grid gap-1.5 text-sm">
                        <li>• Use ```language for code blocks</li>
                        <li>• Use $formula$ for inline math</li>
                        <li>• Use $$formula$$ for display math</li>
                      </ul>
                    </div>
                  </ScrollArea>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button 
                  variant="ghost" 
                  className="h-9 px-4 bg-white/50 hover:bg-white/80"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button 
                  variant="ghost" 
                  className="h-9 px-4 bg-white/50 hover:bg-white/80"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {/* Settings for both mobile and desktop */}
        <div className="flex items-center gap-2">
          <SettingsPanel
            selectedFont={selectedFont}
            setSelectedFont={setSelectedFont}
            selectedPattern={selectedPattern}
            setSelectedPattern={setSelectedPattern}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
          
          {/* Mobile menu button */}
          <Button 
            variant="outline" 
            size="icon" 
            className="md:hidden rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="flex flex-col space-y-1 p-3">
            <Button 
              variant="ghost" 
              size="sm"
              className="justify-start"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="justify-start"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
