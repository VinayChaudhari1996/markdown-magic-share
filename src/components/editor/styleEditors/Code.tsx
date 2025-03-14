
import { ScrollArea } from "@/components/ui/scroll-area";
import { codeBlockThemes } from "@/lib/patterns";
import { cn } from "@/lib/utils";

interface CodeProps {
  selectedCodeTheme: string;
  setSelectedCodeTheme: (theme: string) => void;
}

export function Code({ selectedCodeTheme, setSelectedCodeTheme }: CodeProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium mb-2">Code Block Theme</h3>
      <ScrollArea className="h-[300px] pr-3">
        <div className="space-y-3">
          {codeBlockThemes.map((theme) => (
            <div 
              key={theme.id}
              className={cn(
                "border cursor-pointer overflow-hidden rounded-md transition-all",
                selectedCodeTheme === theme.id 
                  ? "ring-2 ring-blue-500 border-blue-400" 
                  : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => setSelectedCodeTheme(theme.id)}
            >
              <div className="flex h-16 w-full">
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
                  <div className="font-mono">function example() {'{'}</div>
                  <div className="font-mono ml-4">return true;</div>
                  <div className="font-mono">{'}'}</div>
                </div>
              </div>
              <div className="p-1 text-xs font-medium bg-white border-t text-center">
                {theme.label}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
