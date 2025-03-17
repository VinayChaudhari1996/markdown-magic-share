
import { useState } from "react";
import { motion } from "framer-motion";
import { Share, Github, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
