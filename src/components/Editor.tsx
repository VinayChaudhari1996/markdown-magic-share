
import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Share2, Settings2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

export default function Editor() {
  const [markdown, setMarkdown] = useState("");
  const [selectedFont, setSelectedFont] = useState("default");
  const { toast } = useToast();

  const handleShare = () => {
    navigator.clipboard.writeText(markdown).then(() => {
      toast({
        title: "Content copied!",
        description: "Your markdown content has been copied to clipboard.",
      });
    });
  };

  // Process the markdown content to convert \[ \] to $$ $$
  const processMarkdown = (content: string) => {
    return content
      .replace(/\\[\s]*\[([\s\S]*?)\\[\s]*\]/g, (_, math) => {
        // Trim whitespace and ensure math is on its own line
        const trimmedMath = math.trim();
        return `$$\n${trimmedMath}\n$$`;
      });
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
              <div className="mt-6">
                <label className="text-sm font-medium mb-2 block text-[#1d1d1f]">
                  Preview Font
                </label>
                <Select value={selectedFont} onValueChange={setSelectedFont}>
                  <SelectTrigger className="w-full bg-white/60">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {fontOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </SheetContent>
          </Sheet>
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
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Enter your markdown here... (Try some math: $E = mc^2$ or \[ E^2 = (mc^2)^2 + (pc)^2 \])"
              className="w-full h-full resize-none bg-transparent font-mono text-sm focus:outline-none p-6 placeholder:text-[#86868b]"
              style={{ fontFamily: "'SF Mono', 'JetBrains Mono', monospace" }}
            />
          </Card>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={50} minSize={30}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFont}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full p-6 prose prose-sm dark:prose-invert max-w-none overflow-y-auto"
              style={{ 
                fontFamily: fontOptions.find(f => f.value === selectedFont)?.family 
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
