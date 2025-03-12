
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
import { ZoomIn, ZoomOut, Eye, EyeOff, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function Editor() {
  const [markdown, setMarkdown] = useState("");
  const [selectedFont, setSelectedFont] = useState("default");
  const [selectedPattern, setSelectedPattern] = useState("none");
  const [selectedColor, setSelectedColor] = useState("white");
  const [zoom, setZoom] = useState(1);
  const [hideEditor, setHideEditor] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);
    
    // Check for URL hash
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

  const toggleEditor = () => {
    setHideEditor(prev => !prev);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "h-screen w-full p-6 md:p-8 flex flex-col gap-6 transition-colors duration-300",
        isDarkMode ? "bg-[#121212] text-white" : "bg-[#f5f5f7] text-black"
      )}
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
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      <ResizablePanelGroup
        direction="horizontal"
        className={cn(
          "flex-1 rounded-2xl border shadow-sm max-w-[1200px] mx-auto w-full overflow-hidden transition-colors duration-300",
          isDarkMode 
            ? "bg-gray-900/80 backdrop-blur-xl border-gray-800" 
            : "bg-white/80 backdrop-blur-xl border-gray-200"
        )}
      >
        <AnimatePresence initial={false}>
          {!hideEditor && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <ResizablePanel defaultSize={50} minSize={30}>
                <Card className="h-full border-0 rounded-none bg-transparent">
                  <div className="absolute top-2 right-2 z-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleEditor}
                      className="rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-800/50"
                      title="Hide editor"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <textarea
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    placeholder="Enter your markdown here... (Try some math: $E = mc^2$ or \[ E^2 = (mc^2)^2 + (pc)^2 \])"
                    className={cn(
                      "w-full h-full resize-none bg-transparent font-mono text-sm focus:outline-none p-6 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/10 rounded-lg transition-all",
                      isDarkMode ? "text-gray-300" : "text-gray-800"
                    )}
                    style={{ 
                      fontFamily: "'SF Mono', 'JetBrains Mono', monospace",
                      lineHeight: '1.6',
                      letterSpacing: '0.3px'
                    }}
                  />
                </Card>
              </ResizablePanel>
            </motion.div>
          )}
        </AnimatePresence>

        {!hideEditor && <ResizableHandle withHandle className={isDarkMode ? "bg-gray-800" : "bg-gray-200"} />}

        <ResizablePanel defaultSize={hideEditor ? 100 : 50} minSize={30}>
          <div className="relative h-full">
            <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomIn}
                className={cn(
                  "rounded-full border-0 shadow-sm",
                  isDarkMode
                    ? "bg-gray-800/80 backdrop-blur-xl hover:bg-gray-700/90"
                    : "bg-white/80 backdrop-blur-xl hover:bg-white/90"
                )}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomOut}
                className={cn(
                  "rounded-full border-0 shadow-sm",
                  isDarkMode
                    ? "bg-gray-800/80 backdrop-blur-xl hover:bg-gray-700/90"
                    : "bg-white/80 backdrop-blur-xl hover:bg-white/90"
                )}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              {hideEditor ? (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleEditor}
                  className={cn(
                    "rounded-full border-0 shadow-sm",
                    isDarkMode
                      ? "bg-gray-800/80 backdrop-blur-xl hover:bg-gray-700/90"
                      : "bg-white/80 backdrop-blur-xl hover:bg-white/90"
                  )}
                  title="Show editor"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleEditor}
                  className={cn(
                    "rounded-full border-0 shadow-sm",
                    isDarkMode
                      ? "bg-gray-800/80 backdrop-blur-xl hover:bg-gray-700/90"
                      : "bg-white/80 backdrop-blur-xl hover:bg-white/90"
                  )}
                  title="Hide editor"
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="h-full overflow-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  id="markdown-preview"
                  key={`${selectedFont}-${selectedPattern}-${selectedColor}-${zoom}-${isDarkMode}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "p-6 prose max-w-none",
                    isDarkMode ? "prose-invert" : "prose-gray"
                  )}
                  style={{ 
                    fontFamily: fontOptions.find(f => f.value === selectedFont)?.family,
                    ...getBackgroundStyle(),
                    fontSize: `${zoom}rem`,
                    lineHeight: '1.6',
                    width: "fit-content",
                    minWidth: "100%",
                    color: isDarkMode ? "#E5E7EB" : "#1F2937",
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
