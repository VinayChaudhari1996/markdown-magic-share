
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Type, 
  Grid3X3, 
  Palette, 
  Code, 
  Settings,
  X
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { backgroundPatterns, backgroundColors, codeBlockThemes, styleCategories } from "@/lib/patterns";
import { fontOptions } from "@/lib/fonts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingStyleEditorProps {
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  selectedPattern: string;
  setSelectedPattern: (pattern: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedCodeTheme: string;
  setSelectedCodeTheme: (theme: string) => void;
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
}: FloatingStyleEditorProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showStyleMenu, setShowStyleMenu] = useState(false);

  // Get the appropriate icon component
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Type':
        return <Type />;
      case 'Grid3X3':
        return <Grid3X3 />;
      case 'Palette':
        return <Palette />;
      case 'Code':
        return <Code />;
      default:
        return <Settings />;
    }
  };

  // Content based on selected category
  const renderContent = () => {
    switch (activeCategory) {
      case 'typography':
        return (
          <div className="space-y-4 p-4">
            <h3 className="text-sm font-medium">Select Font</h3>
            <Select value={selectedFont} onValueChange={setSelectedFont}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a font" />
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
            
            <div className="grid grid-cols-1 gap-2 mt-2">
              {fontOptions.slice(0, 5).map((font) => (
                <div
                  key={font.value}
                  className={cn(
                    "p-2 border rounded-md cursor-pointer transition-all",
                    selectedFont === font.value 
                      ? "border-primary bg-primary/5" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => setSelectedFont(font.value)}
                >
                  <div className="text-sm" style={{ fontFamily: font.family }}>
                    {font.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'pattern':
        return (
          <div className="space-y-4 p-4">
            <h3 className="text-sm font-medium">Select Pattern</h3>
            <Select value={selectedPattern} onValueChange={setSelectedPattern}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a pattern" />
              </SelectTrigger>
              <SelectContent>
                {backgroundPatterns.map((pattern) => (
                  <SelectItem key={pattern.id} value={pattern.id}>
                    {pattern.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              {backgroundPatterns.slice(0, 4).map((pattern) => {
                const style = {
                  backgroundImage: pattern.pattern,
                  backgroundSize: '20px 20px',
                  backgroundColor: '#ffffff',
                };
                
                return (
                  <div
                    key={pattern.id}
                    className={cn(
                      "h-14 rounded border cursor-pointer transition-all overflow-hidden",
                      selectedPattern === pattern.id 
                        ? "ring-2 ring-primary" 
                        : "ring-1 ring-gray-200"
                    )}
                    style={style}
                    onClick={() => setSelectedPattern(pattern.id)}
                  />
                );
              })}
            </div>
          </div>
        );
        
      case 'color':
        return (
          <div className="space-y-4 p-4">
            <h3 className="text-sm font-medium">Select Color</h3>
            <div className="grid grid-cols-4 gap-2">
              {backgroundColors.slice(0, 8).map((color) => (
                <div
                  key={color.id}
                  className={cn(
                    "w-8 h-8 rounded-full cursor-pointer transition-all",
                    selectedColor === color.id 
                      ? "ring-2 ring-primary ring-offset-2" 
                      : "ring-1 ring-gray-200 hover:ring-gray-300"
                  )}
                  style={{ backgroundColor: color.color }}
                  onClick={() => setSelectedColor(color.id)}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        );
        
      case 'code':
        return (
          <div className="space-y-4 p-4">
            <h3 className="text-sm font-medium">Code Block Theme</h3>
            <Select value={selectedCodeTheme} onValueChange={setSelectedCodeTheme}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a theme" />
              </SelectTrigger>
              <SelectContent>
                {codeBlockThemes.map((theme) => (
                  <SelectItem key={theme.id} value={theme.id}>
                    {theme.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              {codeBlockThemes.slice(0, 4).map((theme) => (
                <div
                  key={theme.id}
                  className={cn(
                    "rounded border cursor-pointer transition-all overflow-hidden",
                    selectedCodeTheme === theme.id 
                      ? "ring-2 ring-primary" 
                      : "ring-1 ring-gray-200"
                  )}
                  onClick={() => setSelectedCodeTheme(theme.id)}
                >
                  <div className="flex h-14 w-full">
                    <div 
                      className="w-6 h-full" 
                      style={{ 
                        backgroundColor: theme.lineNumberBg,
                        borderRight: `1px solid ${theme.borderColor}`
                      }}
                    />
                    <div 
                      className="flex-1 p-1 text-[10px]" 
                      style={{ 
                        backgroundColor: theme.bgColor,
                        color: theme.textColor 
                      }}
                    >
                      <div className="font-mono">function hello() {'{}'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <div className="fixed bottom-6 right-6 z-50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-none"
                onClick={() => setShowStyleMenu(!showStyleMenu)}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Style Editor</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Floating menu */}
      <AnimatePresence>
        {showStyleMenu && (
          <motion.div 
            className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
              onClick={() => setShowStyleMenu(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            
            <motion.div
              className="relative pointer-events-auto"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <Card className="bg-white/90 backdrop-blur border shadow-lg max-w-sm w-full overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-medium">Style Editor</h2>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setShowStyleMenu(false)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="p-4 border-b">
                    <div className="flex justify-center space-x-4">
                      {styleCategories.map((category) => (
                        <TooltipProvider key={category.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant={activeCategory === category.id ? "default" : "outline"}
                                size="icon"
                                className={cn(
                                  "h-10 w-10 rounded-full transition-all", 
                                  activeCategory === category.id ? "bg-primary text-white" : ""
                                )}
                                onClick={() => setActiveCategory(category.id)}
                                style={activeCategory === category.id ? undefined : { color: category.color }}
                              >
                                {getIconComponent(category.icon)}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{category.label}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {activeCategory && (
                      <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {renderContent()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
