
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

export default function Editor() {
  const [markdown, setMarkdown] = useState("");
  const [selectedFont, setSelectedFont] = useState("default");
  const [selectedPattern, setSelectedPattern] = useState("none");
  const [selectedColor, setSelectedColor] = useState("white");

  // Load content from URL hash on initial render
  useEffect(() => {
    const hash = window.location.hash.slice(1); // Remove the # symbol
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
    };
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
          <AnimatePresence mode="wait">
            <motion.div
              id="markdown-preview"
              key={`${selectedFont}-${selectedPattern}-${selectedColor}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full p-6 prose prose-sm dark:prose-invert max-w-none overflow-y-auto"
              style={{ 
                fontFamily: fontOptions.find(f => f.value === selectedFont)?.family,
                ...getBackgroundStyle()
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
        </ResizablePanel>
      </ResizablePanelGroup>
    </motion.div>
  );
}
