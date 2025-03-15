
import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Share, Github, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import html2pdf from "html2pdf.js";

interface HeaderProps {
  markdown: string;
  selectedFont: string;
  selectedPattern: string;
  selectedColor: string;
  selectedCodeTheme: string;
  zoom?: number;
}

export function Header({
  markdown,
  selectedFont,
  selectedPattern,
  selectedColor,
  selectedCodeTheme,
  zoom = 1
}: HeaderProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const handleShare = () => {
    try {
      // Create an object with all the data we want to share
      const dataToShare = {
        markdown,
        font: selectedFont,
        pattern: selectedPattern,
        color: selectedColor,
        codeTheme: selectedCodeTheme
      };
      
      // Convert to base64
      const encodedData = btoa(encodeURIComponent(JSON.stringify(dataToShare)));
      
      // Create the share URL with the hash
      const url = `${window.location.origin}${window.location.pathname}#${encodedData}`;
      
      setShareUrl(url);
      setIsShareDialogOpen(true);
    } catch (error) {
      console.error("Error generating share URL:", error);
      toast({
        title: "Error Sharing",
        description: "There was an error generating the share URL.",
        variant: "destructive"
      });
    }
  };

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "URL Copied!",
        description: "Share URL has been copied to clipboard.",
      });
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Copy Failed",
        description: "Could not copy URL to clipboard.",
        variant: "destructive"
      });
    }
  };

  const exportAsPdf = async () => {
    try {
      // Clone the preview element to avoid modifying the original
      const previewElement = document.getElementById("markdown-preview");
      if (!previewElement) {
        throw new Error("Preview element not found");
      }
      
      const clonedElement = previewElement.cloneNode(true) as HTMLElement;
      
      // Reset any transform (zoom) on the clone
      clonedElement.style.transform = "none";
      
      // Apply a clean style suited for PDF
      clonedElement.style.padding = "20px";
      clonedElement.style.margin = "0";
      clonedElement.style.width = "100%";
      clonedElement.style.backgroundColor = "white";
      
      // Make the cloned element invisible and append to document temporarily
      clonedElement.style.position = "absolute";
      clonedElement.style.left = "-9999px";
      document.body.appendChild(clonedElement);
      
      // Generate PDF
      const opt = {
        margin: [10, 10, 10, 10],
        filename: "markdown-document.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      };
      
      await html2pdf().from(clonedElement).set(opt).save();
      
      // Clean up
      document.body.removeChild(clonedElement);
      
      toast({
        title: "PDF Exported",
        description: "Your document has been exported as a PDF.",
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Export Failed",
        description: "Could not export document as PDF.",
        variant: "destructive"
      });
    }
  };

  return (
    <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Sparkles className="h-6 w-6 text-primary" />
          </motion.div>
          <motion.h1 
            className="text-xl font-semibold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Markdown Magic
          </motion.h1>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={exportAsPdf}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          
          <Button variant="outline" size="icon" asChild className="hidden sm:flex rounded-full">
            <a
              href="https://github.com/your-repo/markdown-magic"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
      
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Document</DialogTitle>
            <DialogDescription>
              Anyone with this link can view your document with all its styling.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <div className="grid flex-1 gap-2">
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                readOnly 
                value={shareUrl}
                onClick={(e) => e.currentTarget.select()}
              />
            </div>
            <Button onClick={copyShareUrl}>
              Copy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
