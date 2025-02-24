
import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Editor() {
  const [markdown, setMarkdown] = useState("");
  const { toast } = useToast();

  const handleShare = () => {
    // TODO: Implement sharing functionality
    toast({
      title: "Share link copied!",
      description: "You can now share your markdown content with others.",
    });
  };

  return (
    <div className="h-screen w-full p-4 flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Markdown Magic Share</h1>
        <Button onClick={handleShare} variant="outline" className="glass">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </header>

      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 rounded-lg border glass"
      >
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full p-4">
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Enter your markdown here..."
              className="w-full h-full resize-none bg-transparent font-mono text-sm focus:outline-none"
            />
          </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full p-4 prose prose-sm max-w-none">
            {/* TODO: Add markdown rendering */}
            <div className="font-sans">
              {markdown || "Your preview will appear here..."}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
