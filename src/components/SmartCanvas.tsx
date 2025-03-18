
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { fontOptions } from "@/lib/fonts";
import { backgroundColors, backgroundPatterns, codeBlockThemes } from "@/lib/patterns";
import { processMarkdown } from "@/utils/markdownProcessor";
import { CodeBlock } from "./editor/CodeBlock";
import { FloatingStyleEditor } from "./editor/FloatingStyleEditor";
import { Header } from "./layout/Header";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Copy, CheckCircle2 } from "lucide-react";

const defaultMarkdown = `# Smart Canvas

Paste your markdown here or start typing to see it rendered in real-time.

## Features

- **Real-time rendering**
- **Math support**: $E = mc^2$
- **Code highlighting**:

\`\`\`javascript
function hello() {
  console.log("Hello, smart canvas!");
}
\`\`\`

## How to use

Simply type or paste Markdown content directly on this canvas!
`;

const SmartCanvas = () => {
  const [content, setContent] = useState(defaultMarkdown);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFont, setSelectedFont] = useState("default");
  const [selectedPattern, setSelectedPattern] = useState("none");
  const [selectedColor, setSelectedColor] = useState("white");
  const [selectedCodeTheme, setSelectedCodeTheme] = useState("dark");
  const [zoom, setZoom] = useState(1);
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Get font family from selection
  const fontFamily = fontOptions.find(font => font.value === selectedFont)?.family || "system-ui";
  
  // Get pattern and color from selection
  const pattern = backgroundPatterns.find(p => p.id === selectedPattern)?.pattern || "none";
  const color = backgroundColors.find(c => c.id === selectedColor)?.color || "#ffffff";
  
  // Check for URL hash on load to recover shared content
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(hash)));
        if (decoded) {
          if (decoded.markdown) setContent(decoded.markdown);
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

  // Handle pasting content
  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    
    // Update the content with pasted text
    if (pastedText && !isEditing) {
      e.preventDefault();
      setContent(pastedText);
      toast({
        title: "Content pasted successfully",
        description: "Your markdown has been rendered.",
        duration: 2000,
      });
    }
  };

  // Handle click to edit
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only enable editing if clicking directly on the canvas, not on a child element
    if (e.target === canvasRef.current && !isEditing) {
      setIsEditing(true);
      // Focus the textarea in the next tick
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  };

  // Handle blur to exit editing mode
  const handleBlur = () => {
    setIsEditing(false);
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Exit editing mode on Escape
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  // Copy content to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Markdown content has been copied.",
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Markdown renderers for syntax highlighting, math, etc.
  const renderers = {
    code: ({ node, inline, className, children, ...props }) => {
      if (inline) {
        return (
          <code
            className="px-1.5 py-0.5 mx-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-sm"
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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header
        markdown={content}
        selectedFont={selectedFont}
        selectedPattern={selectedPattern}
        selectedColor={selectedColor}
        selectedCodeTheme={selectedCodeTheme}
        zoom={zoom}
      />
      
      <main className="flex-1 flex flex-col container mx-auto py-6 px-4">
        <div className="flex justify-end gap-2 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="rounded-full transition-all duration-300"
          >
            {copied ? (
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        
        <div 
          className="flex-1 relative rounded-lg border shadow-sm overflow-hidden"
          ref={canvasRef}
          onClick={handleCanvasClick}
          onPaste={handlePaste}
          tabIndex={0}
        >
          {isEditing ? (
            <motion.textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="absolute inset-0 w-full h-full p-8 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ 
                fontFamily: "'SF Mono', 'JetBrains Mono', monospace",
                lineHeight: '1.6',
                letterSpacing: '0.3px',
                backgroundColor: color,
                backgroundImage: pattern,
                backgroundSize: '30px 30px',
              }}
              placeholder="Type or paste your markdown here..."
              spellCheck={false}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              autoFocus
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${content}-${selectedFont}-${selectedPattern}-${selectedColor}-${zoom}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full overflow-auto"
              >
                <div 
                  className="min-h-full p-8 prose prose-sm md:prose-base lg:prose-lg max-w-none"
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
                    {processMarkdown(content)}
                  </ReactMarkdown>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
        
        <div className="text-center mt-3 text-sm text-gray-500 dark:text-gray-400">
          Click anywhere on the canvas to edit. Press <kbd className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs">Esc</kbd> to exit editing mode.
        </div>
      </main>
      
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
};

export default SmartCanvas;
