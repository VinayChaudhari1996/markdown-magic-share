
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Settings2, X } from "lucide-react";
import { styleCategories } from "@/lib/patterns";
import { Typography } from "./styleEditors/Typography";
import { Pattern } from "./styleEditors/Pattern";
import { Color } from "./styleEditors/Color";
import { Code } from "./styleEditors/Code";

interface FloatingStyleEditorProps {
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  selectedPattern: string;
  setSelectedPattern: (pattern: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedCodeTheme: string;
  setSelectedCodeTheme: (theme: string) => void;
}

export function FloatingStyleEditor({
  selectedFont,
  setSelectedFont,
  selectedPattern,
  setSelectedPattern,
  selectedColor,
  setSelectedColor,
  selectedCodeTheme,
  setSelectedCodeTheme,
}: FloatingStyleEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setActiveCategoryId(null);
    }
  };

  const renderCategoryContent = (categoryId: string) => {
    switch (categoryId) {
      case "typography":
        return (
          <Typography 
            selectedFont={selectedFont} 
            setSelectedFont={setSelectedFont} 
          />
        );
      case "pattern":
        return (
          <Pattern 
            selectedPattern={selectedPattern} 
            setSelectedPattern={setSelectedPattern} 
          />
        );
      case "color":
        return (
          <Color 
            selectedColor={selectedColor} 
            setSelectedColor={setSelectedColor} 
          />
        );
      case "code":
        return (
          <Code 
            selectedCodeTheme={selectedCodeTheme} 
            setSelectedCodeTheme={setSelectedCodeTheme} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed z-50 flex items-center justify-center left-1/2 bottom-4 transform -translate-x-1/2">
      {/* Main toggle button */}
      <Button
        onClick={toggleMenu}
        size="icon"
        className="rounded-full w-10 h-10 bg-black text-white shadow-lg hover:bg-black/90" // Updated to black background with white icon
        aria-label="Toggle style editor"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Settings2 className="h-5 w-5" />}
      </Button>

      {/* Floating menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-16 bg-white rounded-lg shadow-lg p-2 flex space-x-2"
          >
            {styleCategories.map((category) => {
              const Icon = require("lucide-react")[category.icon];
              const isActive = activeCategoryId === category.id;
              
              return (
                <Button
                  key={category.id}
                  size="icon"
                  variant={isActive ? "default" : "outline"}
                  onClick={() => {
                    if (isActive) {
                      setActiveCategoryId(null);
                    } else {
                      setActiveCategoryId(category.id);
                    }
                  }}
                  className="rounded-full"
                  style={{ 
                    backgroundColor: isActive ? category.color : "transparent",
                    borderColor: isActive ? "transparent" : category.color,
                    color: isActive ? "white" : category.color
                  }}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category content panel */}
      <AnimatePresence>
        {activeCategoryId && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-28 bg-white rounded-lg shadow-lg p-4 w-64 max-h-[400px] overflow-y-auto"
          >
            {renderCategoryContent(activeCategoryId)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
