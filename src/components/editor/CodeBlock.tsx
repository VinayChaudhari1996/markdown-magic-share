
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

  return (
    <motion.div 
      className="markdown-code group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Language badge and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100/80 border-b border-gray-200/50">
        <div className="flex items-center gap-2">
          <TerminalSquare className="h-4 w-4 text-gray-500" />
          {displayLanguage && (
            <span className="text-xs font-medium text-gray-600 uppercase">{displayLanguage}</span>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={copyToClipboard}
          className="opacity-80 hover:opacity-100 hover:bg-gray-200/50 transition-all duration-200"
        >
          {copied ? (
            <motion.div 
              initial={{ scale: 0.8 }} 
              animate={{ scale: 1 }}
              className="flex items-center gap-1 text-green-600"
            >
              <Check className="h-3.5 w-3.5" />
              <span className="text-xs">Copied!</span>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ scale: 0.8 }} 
              animate={{ scale: 1 }}
              className="flex items-center gap-1 text-gray-600"
            >
              <Copy className="h-3.5 w-3.5" />
              <span className="text-xs">Copy</span>
            </motion.div>
          )}
        </Button>
      </div>

      {/* Code content */}
      <pre>
        <code>
          {code.split('\n').map((line, i) => (
            <div key={i} className="line">
              {line || ' '}
            </div>
          ))}
        </code>
      </pre>
    </motion.div>
  );
};
