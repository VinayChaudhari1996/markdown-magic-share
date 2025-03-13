
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, TerminalSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeBlockProps {
  language: string;
  code: string;
  showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ 
  language, 
  code,
  showLineNumbers = true 
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format language display
  const displayLanguage = language === 'text' ? '' : language;
  
  // Split code into lines for line numbering
  const codeLines = code.split('\n');
  
  // Calculate the width needed for line numbers (based on number of digits)
  const lineNumberWidth = codeLines.length.toString().length * 14 + 10;

  return (
    <motion.div 
      className="markdown-code group rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with language badge and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] text-white border-b border-gray-700">
        <div className="flex items-center gap-2">
          <TerminalSquare className="h-4 w-4 text-blue-400" />
          {displayLanguage && (
            <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">{displayLanguage}</span>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={copyToClipboard}
          className="text-gray-300 hover:text-white hover:bg-[#2d2d2d] transition-all duration-200"
        >
          {copied ? (
            <motion.div 
              initial={{ scale: 0.8 }} 
              animate={{ scale: 1 }}
              className="flex items-center gap-1 text-green-400"
            >
              <Check className="h-3.5 w-3.5" />
              <span className="text-xs">Copied!</span>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ scale: 0.8 }} 
              animate={{ scale: 1 }}
              className="flex items-center gap-1"
            >
              <Copy className="h-3.5 w-3.5" />
              <span className="text-xs">Copy</span>
            </motion.div>
          )}
        </Button>
      </div>

      {/* Code content with line numbers */}
      <div className="bg-[#1e1e1e] text-white overflow-auto pdf-code-block">
        <pre className="py-4 relative">
          {showLineNumbers && (
            <div 
              className="absolute top-0 left-0 py-4 flex flex-col items-end border-r border-gray-700 bg-[#252525] text-gray-500 select-none"
              style={{ width: `${lineNumberWidth}px` }}
            >
              {codeLines.map((_, i) => (
                <div key={`line-${i}`} className="px-2 h-6 leading-6 text-xs">
                  {i + 1}
                </div>
              ))}
            </div>
          )}
          <code className="block pl-4" style={{ paddingLeft: showLineNumbers ? `${lineNumberWidth + 16}px` : '16px' }}>
            {codeLines.map((line, i) => (
              <div key={i} className="line h-6 leading-6 hover:bg-[#2d2d2d]">
                {line || ' '}
              </div>
            ))}
          </code>
        </pre>
      </div>
    </motion.div>
  );
};
