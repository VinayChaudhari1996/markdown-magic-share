
import { useState } from "react";
import { 
  Settings, 
  Type, 
  Grid3X3, 
  Palette, 
  Code,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { fontOptions } from "@/lib/fonts";
import { backgroundColors, backgroundPatterns, codeBlockThemes } from "@/lib/patterns";
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
  const [isOpen, setIsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  
  const openPanel = (panel: string) => {
    setActivePanel(panel);
    setIsOpen(true);
  };
  
  const renderPanelContent = () => {
    switch (activePanel) {
      case 'typography':
        return (
          <>
            <SheetHeader className="mb-4">
              <SheetTitle>Typography</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-120px)] pr-4">
              <Select value={selectedFont} onValueChange={setSelectedFont}>
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    {fontOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
              
              <div className="mt-4 grid gap-2">
                {fontOptions.map((font) => (
                  <div
                    key={font.value}
                    className={cn(
                      "p-3 border rounded-md cursor-pointer transition-all",
                      selectedFont === font.value ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => setSelectedFont(font.value)}
                    style={{ fontFamily: font.family }}
                  >
                    {font.label}
                    {selectedFont === font.value && (
                      <div className="float-right w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        );
        
      case 'pattern':
        return (
          <>
            <SheetHeader className="mb-4">
              <SheetTitle>Background Pattern</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-120px)] pr-4">
              <Select value={selectedPattern} onValueChange={setSelectedPattern}>
                <SelectTrigger>
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
              
              <div className="mt-4 grid grid-cols-2 gap-3">
                {backgroundPatterns.map((pattern) => {
                  const style = {
                    backgroundImage: pattern.pattern,
                    backgroundSize: '20px 20px',
                    backgroundColor: '#ffffff',
                  };
                  
                  return (
                    <Card
                      key={pattern.id}
                      className={cn(
                        "overflow-hidden cursor-pointer transition-all h-24",
                        selectedPattern === pattern.id ? "ring-2 ring-blue-500" : "hover:border-gray-300"
                      )}
                      onClick={() => setSelectedPattern(pattern.id)}
                    >
                      <div className="h-[80%]" style={style}></div>
                      <div className="py-1 px-2 text-xs font-medium text-center truncate">
                        {pattern.label}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </>
        );
        
      case 'color':
        return (
          <>
            <SheetHeader className="mb-4">
              <SheetTitle>Background Color</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-120px)] pr-4">
              <div className="grid grid-cols-6 gap-2">
                {backgroundColors.map((color) => (
                  <Tooltip key={color.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setSelectedColor(color.id)}
                        className={cn(
                          "w-10 h-10 rounded-md transition-all",
                          selectedColor === color.id ? "ring-2 ring-blue-500 scale-105" : "ring-1 ring-gray-200 hover:scale-105"
                        )}
                        style={{ backgroundColor: color.color }}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      {color.label}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-2">
                {backgroundColors.map((color) => (
                  <div
                    key={color.id}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-md border cursor-pointer transition-all",
                      selectedColor === color.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => setSelectedColor(color.id)}
                  >
                    <span className="text-sm">{color.label}</span>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color.color }}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        );
        
      case 'code':
        return (
          <>
            <SheetHeader className="mb-4">
              <SheetTitle>Code Styling</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-120px)] pr-4">
              <Select value={selectedCodeTheme} onValueChange={setSelectedCodeTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Select code theme" />
                </SelectTrigger>
                <SelectContent>
                  {codeBlockThemes.map((theme) => (
                    <SelectItem key={theme.id} value={theme.id}>
                      {theme.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="mt-4 grid grid-cols-2 gap-3">
                {codeBlockThemes.map((theme) => (
                  <Card
                    key={theme.id}
                    className={cn(
                      "overflow-hidden cursor-pointer transition-all",
                      selectedCodeTheme === theme.id ? "ring-2 ring-blue-500" : "hover:border-gray-300"
                    )}
                    onClick={() => setSelectedCodeTheme(theme.id)}
                  >
                    <div className="flex h-24">
                      <div 
                        className="w-8 h-full border-r" 
                        style={{ 
                          backgroundColor: theme.lineNumberBg,
                          borderColor: theme.borderColor 
                        }}
                      />
                      <div 
                        className="flex-1 p-2 text-xs font-mono" 
                        style={{ 
                          backgroundColor: theme.bgColor,
                          color: theme.textColor 
                        }}
                      >
                        <div>function example() {`{`}</div>
                        <div className="ml-4">return true;</div>
                        <div>{`}`}</div>
                      </div>
                    </div>
                    <div className="p-2 text-xs font-medium text-center border-t truncate">
                      {theme.label}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <TooltipProvider>
      {/* Main floating button group */}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50 bg-white rounded-full shadow-lg border border-gray-200 flex items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-l-full h-10 w-10 hover:bg-gray-100"
              onClick={() => openPanel('typography')}
            >
              <Type className="h-4 w-4 text-gray-700" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Typography</TooltipContent>
        </Tooltip>
        
        <div className="w-px h-6 bg-gray-200" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 hover:bg-gray-100"
              onClick={() => openPanel('pattern')}
            >
              <Grid3X3 className="h-4 w-4 text-gray-700" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Background Pattern</TooltipContent>
        </Tooltip>
        
        <div className="w-px h-6 bg-gray-200" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 hover:bg-gray-100"
              onClick={() => openPanel('color')}
            >
              <Palette className="h-4 w-4 text-gray-700" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Background Color</TooltipContent>
        </Tooltip>
        
        <div className="w-px h-6 bg-gray-200" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 hover:bg-gray-100"
              onClick={() => openPanel('code')}
            >
              <Code className="h-4 w-4 text-gray-700" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Code Styling</TooltipContent>
        </Tooltip>
        
        <div className="w-px h-6 bg-gray-200" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-r-full h-10 w-10 hover:bg-gray-100 bg-black"
              onClick={() => setIsOpen(true)}
            >
              <Settings className="h-4 w-4 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Settings</TooltipContent>
        </Tooltip>
      </div>

      {/* Settings Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-[90vw] sm:w-[400px]">
          {renderPanelContent() || (
            <>
              <SheetHeader className="mb-4">
                <SheetTitle>Document Settings</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4">
                <Card 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setActivePanel('typography')}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center mr-3">
                      <Type className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Typography</h3>
                      <p className="text-xs text-gray-500">Change document font</p>
                    </div>
                  </div>
                </Card>
                
                <Card 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setActivePanel('pattern')}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-indigo-100 flex items-center justify-center mr-3">
                      <Grid3X3 className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Background Pattern</h3>
                      <p className="text-xs text-gray-500">Apply subtle textures</p>
                    </div>
                  </div>
                </Card>
                
                <Card 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setActivePanel('color')}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-purple-100 flex items-center justify-center mr-3">
                      <Palette className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Background Color</h3>
                      <p className="text-xs text-gray-500">Change document background</p>
                    </div>
                  </div>
                </Card>
                
                <Card 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setActivePanel('code')}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center mr-3">
                      <Code className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Code Styling</h3>
                      <p className="text-xs text-gray-500">Style code snippets</p>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          )}
          
          {activePanel && (
            <Button 
              variant="ghost"
              size="sm"
              className="absolute top-4 right-16"
              onClick={() => setActivePanel(null)}
            >
              <X className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}
