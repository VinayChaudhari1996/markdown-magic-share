
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
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "./ui/button";

export default function Editor() {
  const [markdown, setMarkdown] = useState("");
  const [selectedFont, setSelectedFont] = useState("default");
  const [selectedPattern, setSelectedPattern] = useState("none");
  const [selectedColor, setSelectedColor] = useState("white");
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      try {
        const decodedContent = decodeURIComponent(atob(hash));
        setMarkdown(decodedContent);
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

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen w-full p-8 flex flex-col gap-6 bg-[#f5f5f7]"
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

      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 rounded-2xl border bg-white/80 backdrop-blur-xl shadow-sm max-w-[1200px] mx-auto w-full overflow-hidden"
      >
        <ResizablePanel defaultSize={50} minSize={30}>
          <Card className="h-full border-0 rounded-none bg-transparent">
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Enter your markdown here... (Try some math: $E = mc^2$ or \[ E^2 = (mc^2)^2 + (pc)^2 \])"
              className="w-full h-full resize-none bg-transparent font-mono text-sm focus:outline-none p-6 placeholder:text-[#86868b] focus:ring-2 focus:ring-blue-500/10 rounded-lg transition-all"
              style={{ 
                fontFamily: "'SF Mono', 'JetBrains Mono', monospace",
                lineHeight: '1.6',
                letterSpacing: '0.3px'
              }}
            />
          </Card>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="relative h-full">
            <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomIn}
                className="rounded-full bg-white/80 backdrop-blur-xl border-0 shadow-sm hover:bg-white/90"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomOut}
                className="rounded-full bg-white/80 backdrop-blur-xl border-0 shadow-sm hover:bg-white/90"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-full overflow-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  id="markdown-preview"
                  key={`${selectedFont}-${selectedPattern}-${selectedColor}-${zoom}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 prose prose-sm dark:prose-invert max-w-none"
                  style={{ 
                    fontFamily: fontOptions.find(f => f.value === selectedFont)?.family,
                    ...getBackgroundStyle(),
                    fontSize: `${zoom}rem`,
                    lineHeight: '1.6',
                    width: "fit-content",
                    minWidth: "100%"
                  }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {processMarkdown(markdown)}
                  </ReactMarkdown>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </motion.div>
  );
}
