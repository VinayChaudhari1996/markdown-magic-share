
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { processMarkdown } from "@/utils/markdownProcessor";
import { FloatingStyleEditor } from "./editor/FloatingStyleEditor";
import { Header } from "./layout/Header";
import { fontOptions } from "@/lib/fonts";
import { backgroundColors, backgroundPatterns, codeBlockThemes } from "@/lib/patterns";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { CodeBlock } from "./editor/CodeBlock";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { EyeOff, Eye } from "lucide-react";

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
  const [zoom, setZoom] = useState(1);
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);
  const [isEditorVisible, setIsEditorVisible] = useState(true);
  const isMobile = useIsMobile();
  
  // Get font family from selection
  const fontFamily = fontOptions.find(font => font.value === selectedFont)?.family || "system-ui";
  
  // Get pattern and color from selection
  const pattern = backgroundPatterns.find(p => p.id === selectedPattern)?.pattern || "none";
  const color = backgroundColors.find(c => c.id === selectedColor)?.color || "#ffffff";
  
  // Get code theme from selection
  const codeTheme = codeBlockThemes.find(theme => theme.id === selectedCodeTheme) || codeBlockThemes[0];
  
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

  const toggleEditor = () => {
    setIsEditorVisible(!isEditorVisible);
  };

  // Component for the markdown renderers
  const renderers = {
    code: ({ node, inline, className, children, ...props }) => {
      if (inline) {
        return (
          <code
            className="px-1.5 py-0.5 mx-0.5 rounded bg-gray-100 font-mono text-sm"
            {...props}
          >
            {children}
          </code>
        );
      }
      
      // Extract language from className
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : 'text';
      const code = String(children).replace(/\n$/, '');
      
      return <CodeBlock language={language} code={code} themeId={selectedCodeTheme} />;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        markdown={markdown}
        selectedFont={selectedFont}
        selectedPattern={selectedPattern}
        selectedColor={selectedColor}
        selectedCodeTheme={selectedCodeTheme}
        zoom={zoom}
      />
      
      {isMobile ? (
        <div className="flex-1 flex flex-col p-4">
          <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4 glass shadow-sm">
              <TabsTrigger value="edit" className="data-[state=active]:bg-white">Edit</TabsTrigger>
              <TabsTrigger value="preview" className="data-[state=active]:bg-white">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="h-[calc(100vh-160px)]">
              <div className="h-full p-2 rounded-lg border shadow-sm bg-white">
                <Textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  className="h-full p-4 font-mono text-sm resize-none border-0 focus:ring-0 focus-visible:ring-0 shadow-none"
                  placeholder="Type your markdown here..."
                />
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="h-[calc(100vh-160px)] overflow-auto bg-white rounded-lg border shadow-sm">
              <motion.div
                id="markdown-preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="py-6 px-6 prose prose-sm sm:prose max-w-none min-h-full"
                style={{
                  fontFamily,
                  backgroundImage: pattern,
                  backgroundColor: color,
                  backgroundSize: '30px 30px',
                }}
              >
                <ReactMarkdown
                  components={renderers}
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {processMarkdown(markdown)}
                </ReactMarkdown>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="flex-1 flex flex-col container mx-auto py-6 px-4">
          <div className="flex justify-end mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleEditor}
              className="rounded-full transition-all duration-300"
            >
              {isEditorVisible ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {isEditorVisible ? "Hide Editor" : "Show Editor"}
            </Button>
          </div>
          
          <div className="flex-1 flex rounded-lg overflow-hidden border shadow-sm bg-white">
            <ResizablePanelGroup direction="horizontal" className="w-full min-h-[calc(100vh-120px)]">
              {isEditorVisible && (
                <>
                  <ResizablePanel defaultSize={50} minSize={30} className="border-r">
                    <div className="h-full">
                      <Textarea
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        className="h-full p-6 font-mono text-sm resize-none rounded-none border-0 shadow-none focus-visible:ring-0"
                        placeholder="Type your markdown here..."
                        style={{ 
                          fontFamily: "'SF Mono', 'JetBrains Mono', monospace",
                          lineHeight: '1.6',
                          letterSpacing: '0.3px'
                        }}
                        spellCheck={false}
                      />
                    </div>
                  </ResizablePanel>
                  
                  <ResizableHandle withHandle className="bg-gray-100" />
                </>
              )}
              
              <ResizablePanel defaultSize={isEditorVisible ? 50 : 100} minSize={30}>
                <div className="h-full overflow-auto">
                  <motion.div
                    id="markdown-preview"
                    key={`${selectedFont}-${selectedPattern}-${selectedColor}-${zoom}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="py-10 px-12 prose prose-sm md:prose-base lg:prose-lg max-w-none min-h-full"
                    style={{
                      fontFamily,
                      backgroundImage: pattern,
                      backgroundColor: color,
                      backgroundSize: '30px 30px',
                      transform: `scale(${zoom})`,
                      transformOrigin: 'top left',
                    }}
                  >
                    <ReactMarkdown
                      components={renderers}
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {processMarkdown(markdown)}
                    </ReactMarkdown>
                  </motion.div>
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
        isOpen={isFloatingMenuOpen}
        setIsOpen={setIsFloatingMenuOpen}
        setZoom={setZoom}
        zoom={zoom}
      />
    </div>
  );
}
