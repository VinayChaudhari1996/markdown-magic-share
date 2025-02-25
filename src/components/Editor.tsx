import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Share2, Settings2, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import html2pdf from "html2pdf.js";
import Editor from "@monaco-editor/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { backgroundPatterns, backgroundColors } from "@/lib/patterns";

const fontOptions = [
  { value: "default", label: "System Default", family: "-apple-system, BlinkMacSystemFont, system-ui" },
  { value: "poppins", label: "Poppins", family: "'Poppins', sans-serif" },
  { value: "montserrat", label: "Montserrat", family: "'Montserrat', sans-serif" },
  { value: "raleway", label: "Raleway", family: "'Raleway', sans-serif" },
  { value: "source-sans", label: "Source Sans 3", family: "'Source Sans 3', sans-serif" },
  { value: "nunito", label: "Nunito", family: "'Nunito', sans-serif" },
  { value: "quicksand", label: "Quicksand", family: "'Quicksand', sans-serif" },
  { value: "mulish", label: "Mulish", family: "'Mulish', sans-serif" },
  { value: "work-sans", label: "Work Sans", family: "'Work Sans', sans-serif" },
  { value: "dm-sans", label: "DM Sans", family: "'DM Sans', sans-serif" },
  { value: "rubik", label: "Rubik", family: "'Rubik', sans-serif" },
  { value: "lato", label: "Lato", family: "'Lato', sans-serif" },
  { value: "merriweather", label: "Merriweather", family: "'Merriweather', serif" },
  { value: "source-serif", label: "Source Serif 4", family: "'Source Serif 4', serif" },
  { value: "crimson-pro", label: "Crimson Pro", family: "'Crimson Pro', serif" },
  { value: "libre-baskerville", label: "Libre Baskerville", family: "'Libre Baskerville', serif" },
  { value: "spectral", label: "Spectral", family: "'Spectral', serif" },
  { value: "archivo", label: "Archivo", family: "'Archivo', sans-serif" },
  { value: "space-grotesk", label: "Space Grotesk", family: "'Space Grotesk', sans-serif" },
  { value: "ibm-plex-sans", label: "IBM Plex Sans", family: "'IBM Plex Sans', sans-serif" },
  { value: "ibm-plex-serif", label: "IBM Plex Serif", family: "'IBM Plex Serif', serif" },
  { value: "bitter", label: "Bitter", family: "'Bitter', serif" },
  { value: "pt-serif", label: "PT Serif", family: "'PT Serif', serif" },
  { value: "pt-sans", label: "PT Sans", family: "'PT Sans', sans-serif" },
];

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState("");
  const [selectedFont, setSelectedFont] = useState("default");
  const [selectedPattern, setSelectedPattern] = useState("none");
  const [selectedColor, setSelectedColor] = useState("white");
  const { toast } = useToast();

  const handleShare = () => {
    navigator.clipboard.writeText(markdown).then(() => {
      toast({
        title: "Content copied!",
        description: "Your markdown content has been copied to clipboard.",
      });
    });
  };

  const handleDownload = async () => {
    const element = document.getElementById('markdown-preview');
    if (!element) return;

    const opt = {
      margin: 10,
      filename: 'markdown-content.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
      toast({
        title: "PDF Generated!",
        description: "Your markdown content has been downloaded as PDF.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const processMarkdown = (content: string) => {
    return content
      .replace(/\\[\s]*\[([\s\S]*?)\\[\s]*\]/g, (_, math) => {
        const trimmedMath = math.trim();
        return `$$\n${trimmedMath}\n$$`;
      });
  };

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
      <header className="flex items-center justify-between max-w-[1200px] mx-auto w-full">
        <motion.h1 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-2xl font-semibold text-[#1d1d1f]"
        >
          Markdown Magic Share
        </motion.h1>
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full bg-white/80 backdrop-blur-xl border-0 shadow-sm hover:bg-white/90">
                <Settings2 className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-white/80 backdrop-blur-xl">
              <SheetHeader>
                <SheetTitle className="text-[#1d1d1f]">Appearance Settings</SheetTitle>
                <SheetDescription className="text-[#86868b]">
                  Customize how your markdown content is displayed.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block text-[#1d1d1f]">
                    Preview Font
                  </label>
                  <Select value={selectedFont} onValueChange={setSelectedFont}>
                    <SelectTrigger className="w-full bg-white/60">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <ScrollArea className="h-[200px]">
                        {fontOptions.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-[#1d1d1f]">
                    Background Pattern
                  </label>
                  <Select value={selectedPattern} onValueChange={setSelectedPattern}>
                    <SelectTrigger className="w-full bg-white/60">
                      <SelectValue placeholder="Select pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      {backgroundPatterns.map((pattern) => (
                        <SelectItem key={pattern.id} value={pattern.id}>
                          {pattern.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-[#1d1d1f]">
                    Background Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {backgroundColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.id)}
                        className={`w-8 h-8 rounded-full transition-all ${
                          selectedColor === color.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                        }`}
                        style={{ backgroundColor: color.color }}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Button 
            onClick={handleDownload}
            variant="outline" 
            className="rounded-full bg-white/80 backdrop-blur-xl border-0 shadow-sm hover:bg-white/90"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button 
            onClick={handleShare} 
            variant="outline" 
            className="rounded-full bg-white/80 backdrop-blur-xl border-0 shadow-sm hover:bg-white/90"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </header>

      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 rounded-2xl border bg-white/80 backdrop-blur-xl shadow-sm max-w-[1200px] mx-auto w-full overflow-hidden"
      >
        <ResizablePanel defaultSize={50} minSize={30}>
          <Card className="h-full border-0 rounded-none bg-transparent">
            <Editor
              height="100%"
              defaultLanguage="markdown"
              value={markdown}
              onChange={(value) => setMarkdown(value || '')}
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'off',
                folding: false,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 0,
                renderLineHighlight: 'none',
                scrollbar: {
                  vertical: 'hidden',
                  horizontal: 'hidden'
                }
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
