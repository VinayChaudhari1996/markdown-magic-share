
import { Button } from "@/components/ui/button";
import { Share2, Menu } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
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
                        Supports LaTeX, code highlighting, and beautiful styling.
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
