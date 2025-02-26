
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { backgroundPatterns, backgroundColors } from "@/lib/patterns";
import { fontOptions } from "@/lib/fonts";

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
        <Button variant="outline" size="icon" className="rounded-full bg-white/80 backdrop-blur-xl border-0 shadow-sm hover:bg-white/90">
          <Settings2 className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-white/80 backdrop-blur-xl">
        <SheetHeader>
          <SheetTitle className="text-[#1d1d1f]">Appearance Settings</SheetTitle>
          <SheetDescription className="text-[#86868b]">
            Customize how your markdown content is displayed.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block text-[#1d1d1f]">
              Preview Font
            </label>
            <Select value={selectedFont} onValueChange={setSelectedFont}>
              <SelectTrigger className="w-full bg-white/60">
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
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-[#1d1d1f]">
              Background Pattern
            </label>
            <Select value={selectedPattern} onValueChange={setSelectedPattern}>
              <SelectTrigger className="w-full bg-white/60">
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
            <label className="text-sm font-medium mb-2 block text-[#1d1d1f]">
              Background Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {backgroundColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    selectedColor === color.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                  }`}
                  style={{ backgroundColor: color.color }}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
