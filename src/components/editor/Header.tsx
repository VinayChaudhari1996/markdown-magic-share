
import { Button } from "@/components/ui/button";
import { Share2, Download, Menu } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import html2pdf from "html2pdf.js";
import { SettingsPanel } from "./SettingsPanel";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { codeBlockThemes } from "@/lib/patterns";
import { createPdfExportClone, forcePdfVisibility } from "@/utils/markdownProcessor";
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
  selectedCodeTheme: string;
  setSelectedCodeTheme: (theme: string) => void;
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
  selectedCodeTheme,
  setSelectedCodeTheme,
  zoom,
}: HeaderProps) {
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleShare = () => {
    try {
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
    if (!element) {
      console.error('Markdown preview element not found for PDF export');
      toast({
        title: "Error",
        description: "Couldn't find the markdown content to export.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    toast({
      title: "Generating PDF...",
      description: "Please wait while we prepare your document.",
    });

    try {
      console.log('Starting PDF export process');
      
      // Create an optimized clone specifically for PDF export
      const clone = createPdfExportClone(element);
      if (!clone) {
        throw new Error("Failed to create export clone");
      }
      
      // Add to document body temporarily for html2pdf to process it
      document.body.appendChild(clone);
      
      // Log the clone structure to check if text is present
      console.log('Clone created with structure:', {
        childNodes: clone.childNodes.length,
        textContent: clone.textContent?.substring(0, 100) + '...',
        hasStyles: !!clone.style.cssText
      });
      
      // Wait a moment for styles to apply
      await new Promise(resolve => setTimeout(resolve, 300));

      // Configure html2pdf with optimal settings for text visibility
      const opt = {
        margin: [15, 15, 15, 15],
        filename: 'markdown-document.pdf',
        image: { 
          type: 'jpeg', 
          quality: 1.0 
        },
        enableLinks: true,
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: true,
          backgroundColor: '#ffffff',
          removeContainer: false,
          foreignObjectRendering: false,
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: false,
          precision: 16,
          putTotalPages: true,
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after',
          avoid: '.page-break-avoid',
        }
      };
      
      console.log('PDF export configuration:', opt);

      // Generate and download the PDF
      await html2pdf().from(clone).set(opt).save();
      console.log('PDF generation completed');
      
      // Clean up the temporary clone
      document.body.removeChild(clone);
      
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
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
            Markdown Magic
          </h1>
          
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
                  disabled={isExporting}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? "Exporting..." : "Download"}
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
        
        <div className="flex items-center gap-2">
          <SettingsPanel
            selectedFont={selectedFont}
            setSelectedFont={setSelectedFont}
            selectedPattern={selectedPattern}
            setSelectedPattern={setSelectedPattern}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedCodeTheme={selectedCodeTheme}
            setSelectedCodeTheme={setSelectedCodeTheme}
          />
          
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
      
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="flex flex-col space-y-1 p-3">
            <Button 
              variant="ghost" 
              size="sm"
              className="justify-start"
              onClick={handleDownload}
              disabled={isExporting}
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Exporting..." : "Download PDF"}
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
