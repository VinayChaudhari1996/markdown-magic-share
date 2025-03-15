
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup } from "react-resizable-panels";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { processMarkdown } from "@/utils/markdownProcessor";
import { FloatingStyleEditor } from "./editor/FloatingStyleEditor";
import { Header } from "./layout/Header";
import { fontOptions } from "@/lib/fonts";
import { backgroundColors, backgroundPatterns, codeBlockThemes } from "@/lib/patterns";

// Default markdown content
const defaultMarkdown = `# Welcome to Markdown Magic

Start typing your markdown here. This editor supports:

## Rich Formatting

- **Bold text** and *italic text*
- Lists and tables
- [Links](https://example.com)

## Code Blocks

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

## Math Formulas

Inline math: $E = mc^2$

Display math:

$$
\\frac{d}{dx}\\left( \\int_{0}^{x} f(u)\\,du\\right)=f(x)
$$
`;

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [activeTab, setActiveTab] = useState<string>("edit");
  const [selectedFont, setSelectedFont] = useState("default");
  const [selectedPattern, setSelectedPattern] = useState("none");
  const [selectedColor, setSelectedColor] = useState("white");
  const [selectedCodeTheme, setSelectedCodeTheme] = useState("light");
  const [processedHtml, setProcessedHtml] = useState("");
  const isMobile = useIsMobile();
  
  // Get font family from selection
  const fontFamily = fontOptions.find(font => font.value === selectedFont)?.family || "system-ui";
  
  // Get pattern and color from selection
  const pattern = backgroundPatterns.find(p => p.id === selectedPattern)?.pattern || "none";
  const color = backgroundColors.find(c => c.id === selectedColor)?.color || "#ffffff";
  
  // Get code theme from selection
  const codeTheme = codeBlockThemes.find(theme => theme.id === selectedCodeTheme) || codeBlockThemes[0];
  
  // Process markdown to HTML when markdown changes
  useEffect(() => {
    const processContent = async () => {
      const html = await processMarkdown(markdown);
      setProcessedHtml(html);
    };
    
    processContent();
  }, [markdown]);
  
  // Check for URL hash on load to recover shared content
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(hash)));
        if (decoded) {
          if (decoded.markdown) setMarkdown(decoded.markdown);
          if (decoded.font) setSelectedFont(decoded.font);
          if (decoded.pattern) setSelectedPattern(decoded.pattern);
          if (decoded.color) setSelectedColor(decoded.color);
          if (decoded.codeTheme) setSelectedCodeTheme(decoded.codeTheme);
        }
      } catch (e) {
        console.error("Failed to parse hash data:", e);
      }
    }
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header
        markdown={markdown}
        selectedFont={selectedFont}
        selectedPattern={selectedPattern}
        selectedColor={selectedColor}
        selectedCodeTheme={selectedCodeTheme}
      />
      
      {isMobile ? (
        <div className="flex-1 flex flex-col p-4">
          <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="h-[calc(100vh-160px)]">
              <Textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="h-full p-4 font-mono text-sm resize-none"
                placeholder="Type your markdown here..."
              />
            </TabsContent>
            
            <TabsContent value="preview" className="h-[calc(100vh-160px)] overflow-auto px-1">
              <div
                id="markdown-preview"
                className="py-6 px-1 prose prose-sm sm:prose max-w-none"
                style={{
                  fontFamily,
                  backgroundImage: pattern,
                  backgroundColor: color,
                  backgroundSize: '30px 30px',
                }}
                dangerouslySetInnerHTML={{ __html: processedHtml }}
              />
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-[calc(100vh-64px)] p-4">
                  <Textarea
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    className="h-full p-4 font-mono text-sm resize-none"
                    placeholder="Type your markdown here..."
                  />
                </div>
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-[calc(100vh-64px)] overflow-auto p-4">
                  <div
                    id="markdown-preview"
                    className="py-8 px-10 prose prose-sm sm:prose lg:prose-lg max-w-none min-h-full"
                    style={{
                      fontFamily,
                      backgroundImage: pattern,
                      backgroundColor: color,
                      backgroundSize: '30px 30px',
                    }}
                    dangerouslySetInnerHTML={{ __html: processedHtml }}
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      )}
      
      <FloatingStyleEditor
        selectedFont={selectedFont}
        setSelectedFont={setSelectedFont}
        selectedPattern={selectedPattern}
        setSelectedPattern={setSelectedPattern}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        selectedCodeTheme={selectedCodeTheme}
        setSelectedCodeTheme={setSelectedCodeTheme}
      />
    </div>
  );
}
