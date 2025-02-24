
import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Share2, Settings2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from "react-markdown";
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
  { value: "default", label: "Default", family: "system-ui" },
  { value: "roboto", label: "Roboto", family: "'Roboto', sans-serif" },
  { value: "open-sans", label: "Open Sans", family: "'Open Sans', sans-serif" },
  { value: "lora", label: "Lora", family: "'Lora', serif" },
  { value: "playfair", label: "Playfair Display", family: "'Playfair Display', serif" },
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen w-full p-4 flex flex-col gap-4"
    >
      <header className="flex items-center justify-between">
        <motion.h1 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-2xl font-semibold"
        >
          Markdown Magic Share
        </motion.h1>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="glass">
                <Settings2 className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Appearance Settings</SheetTitle>
                <SheetDescription>
                  Customize how your markdown content is displayed.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <label className="text-sm font-medium mb-2 block">
                  Preview Font
                </label>
                <Select value={selectedFont} onValueChange={setSelectedFont}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
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
          <Button onClick={handleShare} variant="outline" className="glass">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </header>

      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 rounded-lg border glass"
      >
        <ResizablePanel defaultSize={50} minSize={30}>
          <Card className="h-full border-0 rounded-none bg-transparent">
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Enter your markdown here..."
              className="w-full h-full resize-none bg-transparent font-mono text-sm focus:outline-none p-4"
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
              className="h-full p-4 prose prose-sm dark:prose-invert max-w-none overflow-y-auto"
              style={{ 
                fontFamily: fontOptions.find(f => f.value === selectedFont)?.family 
              }}
            >
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </ResizablePanelGroup>
    </motion.div>
  );
}
