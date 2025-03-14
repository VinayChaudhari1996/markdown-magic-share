
import { ScrollArea } from "@/components/ui/scroll-area";
import { backgroundPatterns } from "@/lib/patterns";
import { cn } from "@/lib/utils";

interface PatternProps {
  selectedPattern: string;
  setSelectedPattern: (pattern: string) => void;
}

export function Pattern({ selectedPattern, setSelectedPattern }: PatternProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium mb-2">Background Pattern</h3>
      <ScrollArea className="h-[300px] pr-3">
        <div className="grid grid-cols-2 gap-3">
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
                  "flex flex-col h-16 rounded-md border transition-all overflow-hidden cursor-pointer",
                  selectedPattern === pattern.id 
                    ? "ring-2 ring-blue-500 border-blue-400" 
                    : "border-gray-200 hover:border-gray-300"
                )}
                onClick={() => setSelectedPattern(pattern.id)}
              >
                <div className="flex-1" style={style}></div>
                <div className="p-1 text-xs font-medium bg-white border-t text-center truncate">
                  {pattern.label}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
