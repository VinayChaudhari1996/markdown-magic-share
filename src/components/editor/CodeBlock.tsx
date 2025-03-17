
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Code as CodeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { codeBlockThemes } from '@/lib/patterns';

interface CodeBlockProps {
  language: string;
  code: string;
  showLineNumbers?: boolean;
  themeId?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ 
  language, 
  code,
  showLineNumbers = true,
  themeId = 'light'
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

  // Get theme properties
  const theme = codeBlockThemes.find(theme => theme.id === themeId) || codeBlockThemes[0];

  console.log('Rendering CodeBlock with theme:', themeId, 'and language:', language);

  return (
    <motion.div 
      className="markdown-code group rounded-xl overflow-hidden break-inside-avoid mb-6 pdf-code-block"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor: theme.bgColor,
        color: theme.textColor,
        borderColor: theme.borderColor,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      data-code-block="true"
      data-pdf-codeblock="true"
      data-language={language}
    >
      {/* VS Code-like header with language badge */}
      <div 
        className="flex items-center justify-between px-4 py-2 border-b relative pdf-header"
        style={{ borderColor: theme.borderColor, backgroundColor: theme.lineNumberBg }}
        data-pdf-header="true"
      >
        <div className="flex items-center gap-2">
          <CodeIcon className="h-4 w-4 text-blue-500" />
          {displayLanguage && (
            <span 
              className="text-xs font-medium uppercase tracking-wide pdf-language" 
              style={{ color: theme.textColor }}
              data-pdf-language="true"
            >
              {displayLanguage}
            </span>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={copyToClipboard}
          className="hover:bg-gray-200 transition-all duration-200 print:hidden"
          style={{ color: theme.textColor }}
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
              className="flex items-center gap-1"
            >
              <Copy className="h-3.5 w-3.5" />
              <span className="text-xs">Copy</span>
            </motion.div>
          )}
        </Button>
      </div>

      {/* Code content with line numbers */}
      <div 
        className="pdf-code-content" 
        style={{ backgroundColor: theme.bgColor }}
        data-pdf-code-content="true"
      >
        <pre 
          className="py-4 relative" 
          data-pdf-code="true"
          style={{ color: theme.textColor }}
        >
          {showLineNumbers && (
            <div 
              className="absolute top-0 left-0 py-4 flex flex-col items-end border-r select-none pdf-line-numbers"
              style={{ 
                width: `${lineNumberWidth}px`, 
                backgroundColor: theme.lineNumberBg, 
                color: theme.lineNumberColor,
                borderColor: theme.borderColor
              }}
              data-pdf-line-numbers="true"
            >
              {codeLines.map((_, i) => (
                <div 
                  key={`line-${i}`} 
                  className="px-2 min-h-6 leading-6 text-xs pdf-line-number"
                  data-pdf-line-number="true"
                  style={{ color: theme.lineNumberColor }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          )}
          <code 
            className="block pl-4 text-sm whitespace-pre-wrap break-words font-mono pdf-code-text" 
            style={{ 
              paddingLeft: showLineNumbers ? `${lineNumberWidth + 16}px` : '16px',
              color: theme.textColor,
              fontFamily: "monospace"
            }}
            data-pdf-code-text="true"
          >
            {codeLines.map((line, i) => (
              <div 
                key={i} 
                className="line min-h-6 leading-6 pdf-code-line"
                style={{ color: theme.textColor }}
                data-pdf-line="true"
                data-line-number={i + 1}
              >
                {line || ' '}
              </div>
            ))}
          </code>
        </pre>
      </div>
    </motion.div>
  );
};
