
import { ScrollArea } from "@/components/ui/scroll-area";
import { fontOptions } from "@/lib/fonts";
import { cn } from "@/lib/utils";

interface TypographyProps {
  selectedFont: string;
  setSelectedFont: (font: string) => void;
}

export function Typography({ selectedFont, setSelectedFont }: TypographyProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium mb-2">Font Family</h3>
      <ScrollArea className="h-[300px] pr-3">
        <div className="space-y-2">
          {fontOptions.map((font) => (
            <div 
              key={font.value}
              className={cn(
                "p-3 border rounded-md flex items-center justify-between cursor-pointer transition-all",
                selectedFont === font.value 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => setSelectedFont(font.value)}
            >
              <div 
                className="overflow-hidden text-ellipsis" 
                style={{ fontFamily: font.family }}
              >
                {font.label}
              </div>
              {selectedFont === font.value && (
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
