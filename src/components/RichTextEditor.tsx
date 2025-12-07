'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Undo,
  Redo,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  minHeight = 400,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Convert plain text to HTML for initial load
  React.useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      // If value already contains HTML tags, use it directly
      if (value.includes('<')) {
        editorRef.current.innerHTML = value;
      } else {
        // Convert plain text to HTML
        const htmlContent = value
          .split('\n\n')
          .map(paragraph => {
            // Check if it's a numbered section
            if (/^\d+\./.test(paragraph.trim())) {
              const [title, ...rest] = paragraph.split('\n');
              return `<p><strong>${title}</strong></p>${rest.map(line => `<p>${line}</p>`).join('')}`;
            }
            return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
          })
          .join('');
        editorRef.current.innerHTML = htmlContent;
      }
    }
  }, [value]);

  return (
    <Card className={`rounded-lg overflow-hidden ${
      isFocused ? 'ring-2 ring-[#2164ef] border-transparent' : 'border border-[#E9EAEB]'
    }`}>
      {/* Toolbar */}
      <div className="flex gap-1 p-2 bg-[#FAFAFA] border-b border-[#E9EAEB] flex-wrap">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand('bold')}
                className="h-8 w-8 p-0 hover:bg-[#E9EAEB]"
              >
                <Bold className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand('italic')}
                className="h-8 w-8 p-0 hover:bg-[#E9EAEB]"
              >
                <Italic className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand('underline')}
                className="h-8 w-8 p-0 hover:bg-[#E9EAEB]"
              >
                <Underline className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Underline</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-8" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand('insertUnorderedList')}
                className="h-8 w-8 p-0 hover:bg-[#E9EAEB]"
              >
                <List className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand('insertOrderedList')}
                className="h-8 w-8 p-0 hover:bg-[#E9EAEB]"
              >
                <ListOrdered className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Numbered List</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-8" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand('undo')}
                className="h-8 w-8 p-0 hover:bg-[#E9EAEB]"
              >
                <Undo className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand('redo')}
                className="h-8 w-8 p-0 hover:bg-[#E9EAEB]"
              >
                <Redo className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        suppressContentEditableWarning
        className="p-6 overflow-y-auto text-sm leading-relaxed text-[#181D27] outline-none"
        style={{
          minHeight: `${minHeight}px`,
          maxHeight: '600px',
        }}
        data-placeholder={placeholder}
      />
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #A4A7AE;
        }
        [contenteditable] p {
          margin: 0 0 1em 0;
        }
        [contenteditable] strong {
          font-weight: 600;
        }
        [contenteditable] ul,
        [contenteditable] ol {
          padding-left: 1.5em;
          margin-bottom: 1em;
        }
      `}</style>
    </Card>
  );
}
