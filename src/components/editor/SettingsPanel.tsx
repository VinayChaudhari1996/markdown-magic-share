
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { backgroundPatterns, backgroundColors } from "@/lib/patterns";
import { fontOptions } from "@/lib/fonts";
import { motion } from "framer-motion";

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
      <SheetContent className="glass border-none">
        <SheetHeader>
          <SheetTitle className="text-[#1d1d1f] text-2xl font-bold">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent"
            >
              Style Editor
            </motion.div>
          </SheetTitle>
          <SheetDescription className="text-[#86868b]">
            Customize your markdown document appearance
          </SheetDescription>
        </SheetHeader>
        <div className="mt-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="text-sm font-medium mb-3 block text-[#1d1d1f] opacity-80">
              Typography
            </label>
            <Select value={selectedFont} onValueChange={setSelectedFont}>
              <SelectTrigger className="w-full bg-white/60 backdrop-blur-md rounded-xl border-0 shadow-sm">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent className="bg-white/80 backdrop-blur-xl border-0 rounded-xl shadow-lg">
                <ScrollArea className="h-[200px]">
                  {fontOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="text-sm font-medium mb-3 block text-[#1d1d1f] opacity-80">
              Background Pattern
            </label>
            <Select value={selectedPattern} onValueChange={setSelectedPattern}>
              <SelectTrigger className="w-full bg-white/60 backdrop-blur-md rounded-xl border-0 shadow-sm">
                <SelectValue placeholder="Select pattern" />
              </SelectTrigger>
              <SelectContent className="bg-white/80 backdrop-blur-xl border-0 rounded-xl shadow-lg">
                {backgroundPatterns.map((pattern) => (
                  <SelectItem key={pattern.id} value={pattern.id}>
                    {pattern.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="text-sm font-medium mb-3 block text-[#1d1d1f] opacity-80">
              Background Color
            </label>
            <div className="grid grid-cols-4 gap-3">
              {backgroundColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`w-10 h-10 rounded-xl transition-all hover:scale-110 ${
                    selectedColor === color.id ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''
                  }`}
                  style={{ backgroundColor: color.color }}
                  title={color.label}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
