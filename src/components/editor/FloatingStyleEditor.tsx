
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Palette, Grid3X3, Type, Code, ZoomIn, ZoomOut, Settings2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fontOptions } from "@/lib/fonts";
import { backgroundColors, backgroundPatterns, codeBlockThemes, styleCategories } from "@/lib/patterns";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";

interface FloatingStyleEditorProps {
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  selectedPattern: string;
  setSelectedPattern: (pattern: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedCodeTheme: string;
  setSelectedCodeTheme: (theme: string) => void;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  zoom?: number;
  setZoom?: (zoom: number) => void;
}

export function FloatingStyleEditor({
  selectedFont,
  setSelectedFont,
  selectedPattern,
  setSelectedPattern,
  selectedColor,
  setSelectedColor,
  selectedCodeTheme,
  setSelectedCodeTheme,
  isOpen = false,
  setIsOpen = () => {},
  zoom = 1,
  setZoom = () => {},
}: FloatingStyleEditorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("typography");
  
  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case "typography":
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Font Family</h3>
            <Select value={selectedFont} onValueChange={setSelectedFont}>
              <SelectTrigger className="w-full border shadow-sm">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <ScrollArea className="h-[200px]">
                  {fontOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
            
            {setZoom && (
              <div className="space-y-2 pt-4">
                <h3 className="text-sm font-medium">Zoom Level: {Math.round(zoom * 100)}%</h3>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Slider
                    value={[zoom * 100]}
                    min={50}
                    max={150}
                    step={5}
                    className="flex-1"
                    onValueChange={(value) => setZoom(value[0] / 100)}
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      case "pattern":
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Background Pattern</h3>
            <Select value={selectedPattern} onValueChange={setSelectedPattern}>
              <SelectTrigger className="w-full border shadow-sm">
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
        );
      case "color":
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Background Color</h3>
            <div className="grid grid-cols-4 gap-2">
              {backgroundColors.map((color) => (
                <button
                  key={color.id}
                  className={`h-8 w-8 rounded-md transition-all duration-200 hover:scale-110 ${
                    selectedColor === color.id ? "ring-2 ring-primary ring-offset-2" : "ring-1 ring-black/10"
                  }`}
                  style={{ backgroundColor: color.color }}
                  onClick={() => setSelectedColor(color.id)}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        );
      case "code":
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Code Block Theme</h3>
            <Select value={selectedCodeTheme} onValueChange={setSelectedCodeTheme}>
              <SelectTrigger className="w-full border shadow-sm">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                {codeBlockThemes.map((theme) => (
                  <SelectItem key={theme.id} value={theme.id}>
                    {theme.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {codeBlockThemes.map((theme) => (
                <button
                  key={theme.id}
                  className={`h-8 w-8 rounded-md overflow-hidden transition-all duration-200 hover:scale-110 ${
                    selectedCodeTheme === theme.id ? "ring-2 ring-primary ring-offset-2" : "ring-1 ring-black/10"
                  }`}
                  onClick={() => setSelectedCodeTheme(theme.id)}
                  title={theme.label}
                >
                  <div 
                    className="h-full w-full relative"
                    style={{ backgroundColor: theme.bgColor }}
                  >
                    <div 
                      className="absolute top-0 left-0 h-2 w-full" 
                      style={{ backgroundColor: theme.lineNumberBg }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-64 bg-white rounded-lg border shadow-lg overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center gap-2 pb-4 border-b">
                <div className="flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-3 py-1">
                  <Settings2 className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Style Editor</span>
                </div>
              </div>
              
              <div className="flex justify-between py-3 border-b">
                {styleCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`p-1.5 rounded-md transition-all duration-200 ${
                      selectedCategory === category.id 
                        ? "bg-primary/10 text-primary" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                    title={category.label}
                  >
                    {category.id === "typography" && <Type className="h-4 w-4" />}
                    {category.id === "pattern" && <Grid3X3 className="h-4 w-4" />}
                    {category.id === "color" && <Palette className="h-4 w-4" />}
                    {category.id === "code" && <Code className="h-4 w-4" />}
                  </button>
                ))}
              </div>
              
              <div className="pt-4">
                {renderCategoryContent()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Button
        variant="default"
        size="icon"
        className="rounded-full shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronRight className="h-5 w-5" /> : <Settings2 className="h-5 w-5" />}
      </Button>
    </div>
  );
}
