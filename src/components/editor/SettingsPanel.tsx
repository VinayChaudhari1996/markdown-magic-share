
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Settings2, Paintbrush, Type, Grid3X3, Code } from "lucide-react";
import { backgroundPatterns, backgroundColors, codeBlockThemes } from "@/lib/patterns";
import { fontOptions } from "@/lib/fonts";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
  const [activeTab, setActiveTab] = useState<'typography' | 'pattern' | 'color' | 'code'>('typography');

  return (
    <TooltipProvider>
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 flex flex-col items-center gap-2">
        <div className="bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-md border flex flex-col gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className={cn(
                      "rounded-full transition-all duration-200 hover:bg-blue-50",
                      "border-none",
                      "h-10 w-10"
                    )}
                  >
                    <Settings2 className="h-5 w-5 text-slate-600" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:max-w-md border-l">
                  <SheetHeader className="space-y-1">
                    <SheetTitle className="text-2xl font-semibold">
                      <span className="bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
                        Style Editor
                      </span>
                    </SheetTitle>
                    <SheetDescription>
                      Customize your markdown document appearance
                    </SheetDescription>
                  </SheetHeader>
                  <Separator className="my-4" />
                  <ScrollArea className="h-[calc(100vh-180px)] pr-4">
                    <div className="space-y-6 py-4">
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <Type className="h-4 w-4 text-blue-500" />
                          <h4 className="text-sm font-medium">Typography</h4>
                        </div>
                        <Card className="border shadow-sm bg-white/90 backdrop-blur-sm">
                          <CardContent className="p-3">
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
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <Grid3X3 className="h-4 w-4 text-blue-500" />
                          <h4 className="text-sm font-medium">Background Pattern</h4>
                        </div>
                        <Card className="border shadow-sm bg-white/90 backdrop-blur-sm">
                          <CardContent className="p-3">
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
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <Paintbrush className="h-4 w-4 text-blue-500" />
                          <h4 className="text-sm font-medium">Background Color</h4>
                        </div>
                        <Card className="border shadow-sm bg-white/90 backdrop-blur-sm">
                          <CardContent className="p-3">
                            <div className="grid grid-cols-4 gap-3">
                              {backgroundColors.map((color) => (
                                <button
                                  key={color.id}
                                  onClick={() => setSelectedColor(color.id)}
                                  className={`w-10 h-10 rounded-md transition-all hover:scale-105 ${
                                    selectedColor === color.id ? 'ring-2 ring-blue-500 scale-105' : 'ring-1 ring-gray-200'
                                  }`}
                                  style={{ backgroundColor: color.color }}
                                  title={color.label}
                                />
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <Code className="h-4 w-4 text-blue-500" />
                          <h4 className="text-sm font-medium">Code Block Theme</h4>
                        </div>
                        <Card className="border shadow-sm bg-white/90 backdrop-blur-sm">
                          <CardContent className="p-3">
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
                            <div className="mt-3 grid grid-cols-4 gap-3">
                              {codeBlockThemes.map((theme) => (
                                <button
                                  key={theme.id}
                                  onClick={() => setSelectedCodeTheme(theme.id)}
                                  className={`w-10 h-10 rounded-md transition-all hover:scale-105 ${
                                    selectedCodeTheme === theme.id ? 'ring-2 ring-blue-500 scale-105' : 'ring-1 ring-gray-200'
                                  }`}
                                  style={{ backgroundColor: theme.bgColor }}
                                  title={theme.label}
                                >
                                  <div className="w-full h-2" style={{ backgroundColor: theme.lineNumberBg }}></div>
                                </button>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Open Style Editor</p>
            </TooltipContent>
          </Tooltip>
          
          <Separator className="my-1 bg-slate-200" />
          
          {/* Individual category buttons */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setActiveTab('typography')}
                    className={cn(
                      "rounded-full transition-all duration-200",
                      "border-none h-10 w-10",
                      activeTab === 'typography' ? "bg-blue-50 text-blue-600" : "hover:bg-blue-50"
                    )}
                  >
                    <Type className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:max-w-md border-l">
                  <SheetHeader className="space-y-1">
                    <SheetTitle className="text-2xl font-semibold">
                      <span className="bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
                        Typography
                      </span>
                    </SheetTitle>
                  </SheetHeader>
                  <Separator className="my-4" />
                  <ScrollArea className="h-[calc(100vh-180px)] pr-4">
                    <Card className="border shadow-sm bg-white/90 backdrop-blur-sm mt-4">
                      <CardContent className="p-3">
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
                      </CardContent>
                    </Card>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Typography</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setActiveTab('pattern')}
                    className={cn(
                      "rounded-full transition-all duration-200",
                      "border-none h-10 w-10",
                      activeTab === 'pattern' ? "bg-blue-50 text-blue-600" : "hover:bg-blue-50"
                    )}
                  >
                    <Grid3X3 className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:max-w-md border-l">
                  <SheetHeader className="space-y-1">
                    <SheetTitle className="text-2xl font-semibold">
                      <span className="bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
                        Background Pattern
                      </span>
                    </SheetTitle>
                  </SheetHeader>
                  <Separator className="my-4" />
                  <ScrollArea className="h-[calc(100vh-180px)] pr-4">
                    <Card className="border shadow-sm bg-white/90 backdrop-blur-sm mt-4">
                      <CardContent className="p-3">
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
                      </CardContent>
                    </Card>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Background Pattern</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setActiveTab('color')}
                    className={cn(
                      "rounded-full transition-all duration-200",
                      "border-none h-10 w-10",
                      activeTab === 'color' ? "bg-blue-50 text-blue-600" : "hover:bg-blue-50"
                    )}
                  >
                    <Paintbrush className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:max-w-md border-l">
                  <SheetHeader className="space-y-1">
                    <SheetTitle className="text-2xl font-semibold">
                      <span className="bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
                        Background Color
                      </span>
                    </SheetTitle>
                  </SheetHeader>
                  <Separator className="my-4" />
                  <ScrollArea className="h-[calc(100vh-180px)] pr-4">
                    <Card className="border shadow-sm bg-white/90 backdrop-blur-sm mt-4">
                      <CardContent className="p-3">
                        <div className="grid grid-cols-4 gap-3">
                          {backgroundColors.map((color) => (
                            <button
                              key={color.id}
                              onClick={() => setSelectedColor(color.id)}
                              className={`w-12 h-12 rounded-md transition-all hover:scale-105 ${
                                selectedColor === color.id ? 'ring-2 ring-blue-500 scale-105' : 'ring-1 ring-gray-200'
                              }`}
                              style={{ backgroundColor: color.color }}
                              title={color.label}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Background Color</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setActiveTab('code')}
                    className={cn(
                      "rounded-full transition-all duration-200",
                      "border-none h-10 w-10",
                      activeTab === 'code' ? "bg-blue-50 text-blue-600" : "hover:bg-blue-50"
                    )}
                  >
                    <Code className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:max-w-md border-l">
                  <SheetHeader className="space-y-1">
                    <SheetTitle className="text-2xl font-semibold">
                      <span className="bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
                        Code Block Theme
                      </span>
                    </SheetTitle>
                  </SheetHeader>
                  <Separator className="my-4" />
                  <ScrollArea className="h-[calc(100vh-180px)] pr-4">
                    <Card className="border shadow-sm bg-white/90 backdrop-blur-sm mt-4">
                      <CardContent className="p-3">
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
                        <div className="mt-3 grid grid-cols-4 gap-3">
                          {codeBlockThemes.map((theme) => (
                            <button
                              key={theme.id}
                              onClick={() => setSelectedCodeTheme(theme.id)}
                              className={`w-12 h-12 rounded-md transition-all hover:scale-105 ${
                                selectedCodeTheme === theme.id ? 'ring-2 ring-blue-500 scale-105' : 'ring-1 ring-gray-200'
                              }`}
                              style={{ backgroundColor: theme.bgColor }}
                              title={theme.label}
                            >
                              <div className="w-full h-3" style={{ backgroundColor: theme.lineNumberBg }}></div>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Code Block Theme</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
