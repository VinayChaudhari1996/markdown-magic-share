
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings2, Moon, Sun, Palette, Type, Grid3X3 } from "lucide-react";
import { backgroundPatterns, backgroundColors } from "@/lib/patterns";
import { fontOptions } from "@/lib/fonts";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface SettingsPanelProps {
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  selectedPattern: string;
  setSelectedPattern: (pattern: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

export function SettingsPanel({
  selectedFont,
  setSelectedFont,
  selectedPattern,
  setSelectedPattern,
  selectedColor,
  setSelectedColor,
  isDarkMode,
  setIsDarkMode,
}: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Set body class for dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-sm hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all"
        >
          <Settings2 className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        className="w-[350px] sm:w-[400px] border-l border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl"
        side="right"
      >
        <SheetHeader className="space-y-1">
          <SheetTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Appearance Settings
          </SheetTitle>
          <SheetDescription className="text-gray-600 dark:text-gray-400">
            Customize how your markdown content is displayed.
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4 bg-gray-200 dark:bg-gray-800" />
        
        <Tabs defaultValue="theme" className="mt-4">
          <TabsList className="grid grid-cols-3 mb-6 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="theme" className="flex items-center gap-1.5">
              <Sun className="h-3.5 w-3.5" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="font" className="flex items-center gap-1.5">
              <Type className="h-3.5 w-3.5" />
              Font
            </TabsTrigger>
            <TabsTrigger value="background" className="flex items-center gap-1.5">
              <Grid3X3 className="h-3.5 w-3.5" />
              Background
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="theme" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Dark Mode</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Switch between light and dark themes
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Switch 
                  checked={isDarkMode} 
                  onCheckedChange={setIsDarkMode}
                  className="data-[state=checked]:bg-purple-600"
                />
                <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="font" className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium block text-gray-900 dark:text-white">
                Preview Font
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Choose a font for your markdown preview
              </p>
              <Select value={selectedFont} onValueChange={setSelectedFont}>
                <SelectTrigger className="w-full bg-white/60 dark:bg-gray-800/60">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    {fontOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span style={{ fontFamily: font.family }}>{font.label}</span>
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
              
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                <p className="text-sm" style={{ fontFamily: fontOptions.find(f => f.value === selectedFont)?.family }}>
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="background" className="space-y-6">
            <div>
              <Label className="text-base font-medium block text-gray-900 dark:text-white">
                Background Pattern
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Add a subtle pattern to your preview
              </p>
              <Select value={selectedPattern} onValueChange={setSelectedPattern}>
                <SelectTrigger className="w-full bg-white/60 dark:bg-gray-800/60">
                  <SelectValue placeholder="Select pattern" />
                </SelectTrigger>
                <SelectContent>
                  {backgroundPatterns.map((pattern) => (
                    <SelectItem key={pattern.id} value={pattern.id}>
                      {pattern.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-medium block text-gray-900 dark:text-white">
                Background Color
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Choose a color for the preview background
              </p>
              <div className="grid grid-cols-4 gap-2">
                {backgroundColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`w-10 h-10 rounded-full transition-all ${
                      selectedColor === color.id ? 'ring-2 ring-offset-2 ring-purple-500 dark:ring-purple-400 scale-110' : ''
                    }`}
                    style={{ backgroundColor: color.color }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
            
            <div className="p-3 rounded-md mt-2" style={{ 
              backgroundColor: backgroundColors.find(c => c.id === selectedColor)?.color || '#ffffff',
              backgroundImage: backgroundPatterns.find(p => p.id === selectedPattern)?.pattern || 'none',
              backgroundSize: '20px 20px',
            }}>
              <p className="text-sm text-center p-2">Preview</p>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
