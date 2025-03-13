
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Settings2, Paintbrush, Type, Grid3X3 } from "lucide-react";
import { backgroundPatterns, backgroundColors } from "@/lib/patterns";
import { fontOptions } from "@/lib/fonts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SettingsPanelProps {
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  selectedPattern: string;
  setSelectedPattern: (pattern: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

export function SettingsPanel({
  selectedFont,
  setSelectedFont,
  selectedPattern,
  setSelectedPattern,
  selectedColor,
  setSelectedColor,
}: SettingsPanelProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full glass hover:bg-white/80 transition-all duration-200"
        >
          <Settings2 className="h-4 w-4" />
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
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
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
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
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
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
