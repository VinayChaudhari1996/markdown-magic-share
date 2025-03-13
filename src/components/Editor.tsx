
import { useState, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { backgroundPatterns, backgroundColors } from "@/lib/patterns";
import { fontOptions } from "@/lib/fonts";
import { processMarkdown } from "@/utils/markdownProcessor";
import { Header } from "./editor/Header";
import { EyeOff, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { CodeBlock } from "./editor/CodeBlock";

export default function Editor() {
  const [markdown, setMarkdown] = useState("");
  const [selectedFont, setSelectedFont] = useState("default");
  const [selectedPattern, setSelectedPattern] = useState("none");
  const [selectedColor, setSelectedColor] = useState("white");
  const [zoom, setZoom] = useState(1);
  const [isEditorVisible, setIsEditorVisible] = useState(true);
  const [isSharedUrl, setIsSharedUrl] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      // If there's a hash in the URL, this is a shared URL
      setIsSharedUrl(true);
      setIsEditorVisible(false); // Hide editor for shared URLs
      
      try {
        const decodedContent = decodeURIComponent(atob(hash));
        try {
          // Try to parse as JSON with settings
          const parsedContent = JSON.parse(decodedContent);
          setMarkdown(parsedContent.markdown || "");
          setSelectedFont(parsedContent.font || "default");
          setSelectedPattern(parsedContent.pattern || "none");
          setSelectedColor(parsedContent.color || "white");
        } catch (jsonError) {
          // Fallback to old format (just markdown)
          setMarkdown(decodedContent);
        }
      } catch (error) {
        console.error("Failed to decode URL hash:", error);
      }
    }
  }, []);

  const getBackgroundStyle = () => {
    const pattern = backgroundPatterns.find(p => p.id === selectedPattern);
    const color = backgroundColors.find(c => c.id === selectedColor);
    
    return {
      backgroundColor: color?.color || '#ffffff',
      backgroundImage: pattern?.pattern || 'none',
      backgroundSize: '20px 20px',
    };
  };

  const toggleEditor = () => {
    setIsEditorVisible(!isEditorVisible);
  };

  // Component for the markdown renderers
  const renderers = {
    p: ({ node, ...props }) => <p className="pdf-visible-text my-4" {...props} />,
    h1: ({ node, ...props }) => <h1 className="pdf-visible-text mt-8 mb-4 text-3xl font-bold" {...props} />,
    h2: ({ node, ...props }) => <h2 className="pdf-visible-text mt-6 mb-4 text-2xl font-bold" {...props} />,
    h3: ({ node, ...props }) => <h3 className="pdf-visible-text mt-5 mb-3 text-xl font-bold" {...props} />,
    h4: ({ node, ...props }) => <h4 className="pdf-visible-text mt-4 mb-2 text-lg font-bold" {...props} />,
    h5: ({ node, ...props }) => <h5 className="pdf-visible-text mt-4 mb-2 text-base font-bold" {...props} />,
    h6: ({ node, ...props }) => <h6 className="pdf-visible-text mt-4 mb-2 text-sm font-bold" {...props} />,
    li: ({ node, ...props }) => <li className="pdf-visible-text my-1" {...props} />,
    a: ({ node, ...props }) => <a className="pdf-visible-text text-blue-600 hover:text-blue-800 underline" {...props} />,
    blockquote: ({ node, ...props }) => (
      <blockquote className="pdf-visible-text border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
    ),
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
      const language = className?.replace(/language-/, '') || 'text';
      const code = String(children).replace(/\n$/, '');
      
      return <CodeBlock language={language} code={code} />;
    },
    // Add table renderer to ensure proper table formatting in PDFs
    table: ({ node, ...props }) => (
      <div className="my-4 overflow-hidden border rounded-lg pdf-table">
        <table className="min-w-full divide-y divide-gray-200" {...props} />
      </div>
    ),
    th: ({ node, ...props }) => (
      <th 
        className="px-4 py-2 text-left text-sm font-medium text-gray-900 bg-gray-100" 
        {...props} 
      />
    ),
    td: ({ node, ...props }) => (
      <td 
        className="px-4 py-2 text-sm text-gray-900 border-t border-gray-200" 
        {...props} 
      />
    ),
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        markdown={markdown}
        selectedFont={selectedFont}
        setSelectedFont={setSelectedFont}
        selectedPattern={selectedPattern}
        setSelectedPattern={setSelectedPattern}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        zoom={zoom}
      />

      <main className="flex-1 flex flex-col container mx-auto py-6 px-4">
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
        
        <ResizablePanelGroup
          direction="horizontal"
          className="flex-1 rounded-lg border shadow-sm overflow-hidden bg-white"
        >
          {isEditorVisible && (
            <>
              <ResizablePanel defaultSize={40} minSize={30}>
                <div className="h-full border-r">
                  <textarea
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    placeholder="Enter your markdown here... (Try some math: $E = mc^2$ or \[ E^2 = (mc^2)^2 + (pc)^2 \] or code blocks with ```language\ncode here\n```)"
                    className="w-full h-full resize-none font-mono text-sm focus:outline-none p-6 placeholder:text-gray-400"
                    style={{ 
                      fontFamily: "'SF Mono', 'JetBrains Mono', monospace",
                      lineHeight: '1.6',
                      letterSpacing: '0.3px'
                    }}
                    spellCheck={false}
                  />
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />
            </>
          )}

          <ResizablePanel defaultSize={isEditorVisible ? 60 : 100} minSize={30}>
            <div className="relative h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  id="markdown-preview"
                  key={`${selectedFont}-${selectedPattern}-${selectedColor}-${zoom}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full p-8 prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none overflow-y-auto"
                  style={{ 
                    fontFamily: fontOptions.find(f => f.value === selectedFont)?.family,
                    ...getBackgroundStyle(),
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
              </AnimatePresence>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
