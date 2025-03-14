
import { ScrollArea } from "@/components/ui/scroll-area";
import { backgroundColors } from "@/lib/patterns";
import { cn } from "@/lib/utils";

interface ColorProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

export function Color({ selectedColor, setSelectedColor }: ColorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium mb-2">Background Color</h3>
      <ScrollArea className="h-[300px] pr-3">
        <div className="grid grid-cols-3 gap-3">
          {backgroundColors.map((color) => (
            <div
              key={color.id}
              onClick={() => setSelectedColor(color.id)}
              className={cn(
                "group flex flex-col items-center justify-center h-14 rounded-md cursor-pointer transition-all",
                selectedColor === color.id ? "ring-2 ring-blue-500 scale-105" : "ring-1 ring-gray-200 hover:ring-gray-300"
              )}
              title={color.label}
            >
              <div 
                className="w-full h-8 rounded-t-md"
                style={{ backgroundColor: color.color }}
              />
              <div className="w-full text-center text-xs p-1 truncate">
                {color.label}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
