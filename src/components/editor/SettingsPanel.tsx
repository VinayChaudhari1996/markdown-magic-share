
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Type, 
  Grid3X3, 
  Palette, 
  Code, 
  ChevronRight,
  Settings
} from "lucide-react";
import { backgroundPatterns, backgroundColors, codeBlockThemes } from "@/lib/patterns";
import { fontOptions } from "@/lib/fonts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface SettingsPanelProps {
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  selectedPattern: string;
  setSelectedPattern: (pattern: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedCodeTheme: string;
  setSelectedCodeTheme: (theme: string) => void;
}

export function SettingsPanel({
  selectedFont,
  setSelectedFont,
  selectedPattern,
  setSelectedPattern,
  selectedColor,
  setSelectedColor,
  selectedCodeTheme,
  setSelectedCodeTheme,
}: SettingsPanelProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Helper to create a setting drawer
  const openSettingDrawer = (category: string) => {
    setActiveCategory(category);
    setIsDrawerOpen(true);
  };

  const renderSettingDrawerContent = () => {
    switch (activeCategory) {
      case 'typography':
        return (
          <>
            <SheetHeader className="mb-5">
              <SheetTitle className="text-xl font-medium text-slate-800">Typography</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-110px)] pr-4">
              <Card className="border border-slate-200 shadow-sm bg-white">
                <CardContent className="p-4">
                  <Select value={selectedFont} onValueChange={setSelectedFont}>
                    <SelectTrigger className="w-full border rounded-md">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent className="border-0 shadow-md rounded-md">
                      <ScrollArea className="h-[200px]">
                        {fontOptions.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                  <div className="mt-4 space-y-3">
                    {fontOptions.map((font) => (
                      <div 
                        key={font.value}
                        className={cn(
                          "p-3 border rounded-md flex items-center cursor-pointer transition-all",
                          selectedFont === font.value 
                            ? "border-slate-400 bg-slate-50" 
                            : "border-slate-200 hover:border-slate-300"
                        )}
                        onClick={() => setSelectedFont(font.value)}
                      >
                        <div 
                          className="flex-1 overflow-hidden text-ellipsis" 
                          style={{ fontFamily: font.family }}
                        >
                          {font.label}
                        </div>
                        {selectedFont === font.value && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 ml-2"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </>
        );
        
      case 'pattern':
        return (
          <>
            <SheetHeader className="mb-5">
              <SheetTitle className="text-xl font-medium text-slate-800">Background Pattern</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-110px)] pr-4">
              <Card className="border border-slate-200 shadow-sm bg-white">
                <CardContent className="p-4">
                  <Select value={selectedPattern} onValueChange={setSelectedPattern}>
                    <SelectTrigger className="w-full border rounded-md">
                      <SelectValue placeholder="Select pattern" />
                    </SelectTrigger>
                    <SelectContent className="border-0 shadow-md rounded-md">
                      {backgroundPatterns.map((pattern) => (
                        <SelectItem key={pattern.id} value={pattern.id}>
                          {pattern.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {backgroundPatterns.map((pattern) => {
                      // Create a style based on the pattern
                      const style = {
                        backgroundImage: pattern.pattern,
                        backgroundSize: '20px 20px',
                        backgroundColor: '#ffffff',
                      };
                      
                      return (
                        <div 
                          key={pattern.id}
                          className={cn(
                            "flex flex-col h-24 rounded-md border transition-all overflow-hidden cursor-pointer",
                            selectedPattern === pattern.id 
                              ? "border-slate-400 ring-1 ring-slate-400" 
                              : "border-slate-200 hover:border-slate-300"
                          )}
                          onClick={() => setSelectedPattern(pattern.id)}
                        >
                          <div className="flex-1" style={style}></div>
                          <div className="p-2 text-xs font-medium bg-white border-t text-center">
                            {pattern.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </>
        );
        
      case 'color':
        return (
          <>
            <SheetHeader className="mb-5">
              <SheetTitle className="text-xl font-medium text-slate-800">Background Color</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-110px)] pr-4">
              <Card className="border border-slate-200 shadow-sm bg-white">
                <CardContent className="p-4">
                  <div className="grid grid-cols-4 gap-3">
                    {backgroundColors.map((color) => (
                      <div
                        key={color.id}
                        onClick={() => setSelectedColor(color.id)}
                        className={cn(
                          "relative w-full aspect-square rounded-md cursor-pointer transition-all hover:scale-105",
                          selectedColor === color.id ? "ring-2 ring-slate-400 scale-105" : "ring-1 ring-slate-200"
                        )}
                      >
                        <div 
                          className="absolute inset-0 rounded-md"
                          style={{ backgroundColor: color.color }}
                        />
                        <div className="absolute bottom-1 right-1">
                          {selectedColor === color.id && (
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {backgroundColors.map((color) => (
                      <div 
                        key={color.id}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-md border transition-all cursor-pointer",
                          selectedColor === color.id 
                            ? "border-slate-400 bg-slate-50" 
                            : "border-slate-200 hover:border-slate-300"
                        )}
                        onClick={() => setSelectedColor(color.id)}
                      >
                        <div className="text-xs">{color.label}</div>
                        <div 
                          className="w-4 h-4 rounded-full ml-1" 
                          style={{ backgroundColor: color.color }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </>
        );
        
      case 'code':
        return (
          <>
            <SheetHeader className="mb-5">
              <SheetTitle className="text-xl font-medium text-slate-800">Code Block Theme</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-110px)] pr-4">
              <Card className="border border-slate-200 shadow-sm bg-white">
                <CardContent className="p-4">
                  <Select value={selectedCodeTheme} onValueChange={setSelectedCodeTheme}>
                    <SelectTrigger className="w-full border rounded-md">
                      <SelectValue placeholder="Select code theme" />
                    </SelectTrigger>
                    <SelectContent className="border-0 shadow-md rounded-md">
                      {codeBlockThemes.map((theme) => (
                        <SelectItem key={theme.id} value={theme.id}>
                          {theme.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {codeBlockThemes.map((theme) => (
                      <div 
                        key={theme.id}
                        className={cn(
                          "border cursor-pointer overflow-hidden rounded-md transition-all",
                          selectedCodeTheme === theme.id 
                            ? "ring-2 ring-slate-400 border-slate-400" 
                            : "ring-1 ring-slate-200 border-slate-200 hover:border-slate-300"
                        )}
                        onClick={() => setSelectedCodeTheme(theme.id)}
                      >
                        <div className="flex h-24 w-full">
                          <div 
                            className="w-8 h-full border-r" 
                            style={{ 
                              backgroundColor: theme.lineNumberBg,
                              borderColor: theme.borderColor 
                            }}
                          />
                          <div 
                            className="flex-1 p-2 text-xs" 
                            style={{ 
                              backgroundColor: theme.bgColor,
                              color: theme.textColor 
                            }}
                          >
                            <div className="font-mono">function example() {</div>
                            <div className="font-mono ml-4">return true;</div>
                            <div className="font-mono">}</div>
                          </div>
                        </div>
                        <div className="p-2 text-xs font-medium bg-white border-t text-center">
                          {theme.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </>
        );
        
      default:
        return (
          <>
            <SheetHeader className="mb-5">
              <SheetTitle className="text-xl font-medium text-slate-800">Style Settings</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-110px)] pr-4">
              <div className="space-y-4">
                <Card 
                  className="border border-slate-200 shadow-sm hover:border-slate-300 cursor-pointer transition-all"
                  onClick={() => setActiveCategory('typography')}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-50 p-2 rounded-md">
                        <Type className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-800">Typography</h3>
                        <p className="text-xs text-slate-500">Change document font</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </CardContent>
                </Card>
                
                <Card 
                  className="border border-slate-200 shadow-sm hover:border-slate-300 cursor-pointer transition-all"
                  onClick={() => setActiveCategory('pattern')}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-indigo-50 p-2 rounded-md">
                        <Grid3X3 className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-800">Background Pattern</h3>
                        <p className="text-xs text-slate-500">Apply subtle textures</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </CardContent>
                </Card>
                
                <Card 
                  className="border border-slate-200 shadow-sm hover:border-slate-300 cursor-pointer transition-all"
                  onClick={() => setActiveCategory('color')}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-50 p-2 rounded-md">
                        <Palette className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-800">Background Color</h3>
                        <p className="text-xs text-slate-500">Change document background</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </CardContent>
                </Card>
                
                <Card 
                  className="border border-slate-200 shadow-sm hover:border-slate-300 cursor-pointer transition-all"
                  onClick={() => setActiveCategory('code')}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-50 p-2 rounded-md">
                        <Code className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-800">Code Block Theme</h3>
                        <p className="text-xs text-slate-500">Style code snippets</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </>
        );
    }
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setActiveCategory(null), 300); // Reset after drawer closes
  };

  // Custom content for each sheet
  const getSheetContent = () => {
    return (
      <SheetContent
        side="right"
        className="w-[340px] sm:w-[400px] p-6 border-l border-slate-200 bg-white"
        onEscapeKeyDown={closeDrawer}
        onPointerDownOutside={closeDrawer}
      >
        {renderSettingDrawerContent()}
      </SheetContent>
    );
  };

  return (
    <TooltipProvider>
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50">
        <div className="bg-white rounded-md shadow-md border border-slate-200 overflow-hidden">
          <div className="flex flex-col">
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <TooltipTrigger asChild>
                  <DrawerTrigger asChild>
                    <Button 
                      onClick={() => setActiveCategory(null)}
                      variant="ghost" 
                      size="icon" 
                      className="rounded-none px-3 py-4 h-auto w-auto hover:bg-slate-100 transition-colors duration-200 border-b border-slate-100"
                    >
                      <Settings className="h-5 w-5 text-slate-700" />
                    </Button>
                  </DrawerTrigger>
                </TooltipTrigger>
                <TooltipContent side="left" sideOffset={5}>
                  <p className="text-xs">Settings</p>
                </TooltipContent>
                {getSheetContent()}
              </Sheet>
            </Drawer>

            <Separator className="bg-slate-100" />

            <Sheet>
              <TooltipTrigger asChild>
                <SheetTrigger asChild>
                  <Button 
                    onClick={() => openSettingDrawer('typography')}
                    variant="ghost" 
                    size="icon" 
                    className="rounded-none px-3 py-4 h-auto w-auto hover:bg-slate-100 transition-colors duration-200 border-b border-slate-100"
                  >
                    <Type className="h-5 w-5 text-blue-600" />
                  </Button>
                </SheetTrigger>
              </TooltipTrigger>
              <TooltipContent side="left" sideOffset={5}>
                <p className="text-xs">Typography</p>
              </TooltipContent>
              {getSheetContent()}
            </Sheet>

            <Sheet>
              <TooltipTrigger asChild>
                <SheetTrigger asChild>
                  <Button 
                    onClick={() => openSettingDrawer('pattern')}
                    variant="ghost" 
                    size="icon" 
                    className="rounded-none px-3 py-4 h-auto w-auto hover:bg-slate-100 transition-colors duration-200 border-b border-slate-100"
                  >
                    <Grid3X3 className="h-5 w-5 text-indigo-600" />
                  </Button>
                </SheetTrigger>
              </TooltipTrigger>
              <TooltipContent side="left" sideOffset={5}>
                <p className="text-xs">Background Pattern</p>
              </TooltipContent>
              {getSheetContent()}
            </Sheet>

            <Sheet>
              <TooltipTrigger asChild>
                <SheetTrigger asChild>
                  <Button 
                    onClick={() => openSettingDrawer('color')}
                    variant="ghost" 
                    size="icon" 
                    className="rounded-none px-3 py-4 h-auto w-auto hover:bg-slate-100 transition-colors duration-200 border-b border-slate-100"
                  >
                    <Palette className="h-5 w-5 text-purple-600" />
                  </Button>
                </SheetTrigger>
              </TooltipTrigger>
              <TooltipContent side="left" sideOffset={5}>
                <p className="text-xs">Background Color</p>
              </TooltipContent>
              {getSheetContent()}
            </Sheet>

            <Sheet>
              <TooltipTrigger asChild>
                <SheetTrigger asChild>
                  <Button 
                    onClick={() => openSettingDrawer('code')}
                    variant="ghost" 
                    size="icon" 
                    className="rounded-none px-3 py-4 h-auto w-auto hover:bg-slate-100 transition-colors duration-200"
                  >
                    <Code className="h-5 w-5 text-green-600" />
                  </Button>
                </SheetTrigger>
              </TooltipTrigger>
              <TooltipContent side="left" sideOffset={5}>
                <p className="text-xs">Code Block Theme</p>
              </TooltipContent>
              {getSheetContent()}
            </Sheet>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
