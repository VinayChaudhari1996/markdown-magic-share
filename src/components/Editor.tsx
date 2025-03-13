
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

  // Component for the markdown renderers to ensure text visibility in PDFs
  const renderers = {
    p: ({ node, ...props }) => <p className="pdf-visible-text" {...props} />,
    h1: ({ node, ...props }) => <h1 className="pdf-visible-text" {...props} />,
    h2: ({ node, ...props }) => <h2 className="pdf-visible-text" {...props} />,
    h3: ({ node, ...props }) => <h3 className="pdf-visible-text" {...props} />,
    h4: ({ node, ...props }) => <h4 className="pdf-visible-text" {...props} />,
    h5: ({ node, ...props }) => <h5 className="pdf-visible-text" {...props} />,
    h6: ({ node, ...props }) => <h6 className="pdf-visible-text" {...props} />,
    li: ({ node, ...props }) => <li className="pdf-visible-text" {...props} />,
    a: ({ node, ...props }) => <a className="pdf-visible-text" {...props} />,
    blockquote: ({ node, ...props }) => <blockquote className="pdf-visible-text" {...props} />,
    code: ({ node, ...props }) => <code className="pdf-visible-text" {...props} />,
    pre: ({ node, ...props }) => <pre className="pdf-visible-text" {...props} />,
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full py-10 px-6 md:px-10 flex flex-col gap-6"
    >
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

      <div className="flex-1 flex flex-col max-w-[1200px] mx-auto w-full">
        <div className="flex justify-end mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleEditor}
            className="rounded-full glass hover:bg-white/80"
          >
            {isEditorVisible ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {isEditorVisible ? "Hide Editor" : "Show Editor"}
          </Button>
        </div>
        
        <ResizablePanelGroup
          direction="horizontal"
          className="flex-1 rounded-2xl card-gradient shadow-sm overflow-hidden"
        >
          {isEditorVisible && (
            <>
              <ResizablePanel defaultSize={40} minSize={30}>
                <Card className="h-full border-0 rounded-none bg-transparent">
                  <textarea
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    placeholder="Enter your markdown here... (Try some math: $E = mc^2$ or \[ E^2 = (mc^2)^2 + (pc)^2 \])"
                    className="w-full h-full resize-none bg-transparent font-mono text-sm focus:outline-none p-6 placeholder:text-[#86868b] focus:ring-2 focus:ring-blue-500/10 rounded-lg transition-all scrollbar-hidden"
                    style={{ 
                      fontFamily: "'SF Mono', 'JetBrains Mono', monospace",
                      lineHeight: '1.6',
                      letterSpacing: '0.3px'
                    }}
                  />
                </Card>
              </ResizablePanel>

              <ResizableHandle withHandle className="transition-colors hover:bg-blue-100" />
            </>
          )}

          <ResizablePanel defaultSize={isEditorVisible ? 60 : 100} minSize={30}>
            <div className="relative h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  id="markdown-preview"
                  key={`${selectedFont}-${selectedPattern}-${selectedColor}-${zoom}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="h-full p-6 prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none overflow-y-auto scrollbar-hidden"
                  style={{ 
                    fontFamily: fontOptions.find(f => f.value === selectedFont)?.family,
                    ...getBackgroundStyle(),
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top left',
                    transition: 'transform 0.2s ease-out'
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
      </div>
    </motion.div>
  );
}
