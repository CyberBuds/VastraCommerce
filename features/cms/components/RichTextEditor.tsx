'use client';

import * as React from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Eye,
  Edit3,
  Maximize2,
  Minimize2,
  Undo,
  Redo,
} from 'lucide-react';
import { Button } from '@/components/enterprise/BaseInputs';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  label?: string;
  error?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write content here...',
  minHeight = '320px',
  label,
  error,
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = React.useState<'editor' | 'preview' | 'html'>('editor');
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const insertTag = (before: string, after: string = '') => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = value.substring(start, end);
    const replacement = `${before}${selectedText || 'text'}${after}`;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div
      className={cn(
        'flex flex-col border border-slate-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden shadow-xs transition-all',
        {
          'fixed inset-4 z-50 shadow-2xl': isFullscreen,
        }
      )}
    >
      {/* Editor Top Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 border-b border-slate-200/80 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/80 gap-2">
        {/* Left Toolbar formatting buttons */}
        <div className="flex items-center flex-wrap gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertTag('<strong>', '</strong>')}
            title="Bold (Ctrl+B)"
            className="h-8 w-8 p-0"
          >
            <Bold className="w-4 h-4 text-slate-700 dark:text-zinc-300" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertTag('<em>', '</em>')}
            title="Italic (Ctrl+I)"
            className="h-8 w-8 p-0"
          >
            <Italic className="w-4 h-4 text-slate-700 dark:text-zinc-300" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertTag('<u>', '</u>')}
            title="Underline"
            className="h-8 w-8 p-0"
          >
            <UnderlineIcon className="w-4 h-4 text-slate-700 dark:text-zinc-300" />
          </Button>

          <div className="h-4 w-px bg-slate-200 dark:bg-zinc-800 mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertTag('<h2>', '</h2>')}
            title="Heading 2"
            className="h-8 w-8 p-0"
          >
            <Heading2 className="w-4 h-4 text-slate-700 dark:text-zinc-300" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertTag('<h3>', '</h3>')}
            title="Heading 3"
            className="h-8 w-8 p-0"
          >
            <Heading3 className="w-4 h-4 text-slate-700 dark:text-zinc-300" />
          </Button>

          <div className="h-4 w-px bg-slate-200 dark:bg-zinc-800 mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')}
            title="Bullet List"
            className="h-8 w-8 p-0"
          >
            <List className="w-4 h-4 text-slate-700 dark:text-zinc-300" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertTag('<ol>\n  <li>', '</li>\n</ol>')}
            title="Numbered List"
            className="h-8 w-8 p-0"
          >
            <ListOrdered className="w-4 h-4 text-slate-700 dark:text-zinc-300" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertTag('<blockquote>', '</blockquote>')}
            title="Blockquote"
            className="h-8 w-8 p-0"
          >
            <Quote className="w-4 h-4 text-slate-700 dark:text-zinc-300" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertTag('<pre><code>', '</code></pre>')}
            title="Code Block"
            className="h-8 w-8 p-0"
          >
            <Code className="w-4 h-4 text-slate-700 dark:text-zinc-300" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertTag('<a href="https://">', '</a>')}
            title="Insert Link"
            className="h-8 w-8 p-0"
          >
            <LinkIcon className="w-4 h-4 text-slate-700 dark:text-zinc-300" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertTag('<img src="https://picsum.photos/seed/cms/800/400" alt="', '" />')}
            title="Insert Image"
            className="h-8 w-8 p-0"
          >
            <ImageIcon className="w-4 h-4 text-slate-700 dark:text-zinc-300" />
          </Button>
        </div>

        {/* View mode toggle & Fullscreen */}
        <div className="flex items-center gap-1.5 text-xs">
          <div className="flex bg-slate-200/70 dark:bg-zinc-800 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={cn(
                'px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 text-[11px]',
                activeTab === 'editor'
                  ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400'
              )}
            >
              <Edit3 className="w-3 h-3" />
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={cn(
                'px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 text-[11px]',
                activeTab === 'preview'
                  ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400'
              )}
            >
              <Eye className="w-3 h-3" />
              Preview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('html')}
              className={cn(
                'px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 text-[11px]',
                activeTab === 'html'
                  ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400'
              )}
            >
              <Code className="w-3 h-3" />
              Source
            </button>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="h-8 w-8 p-0"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex-1 flex flex-col">
        {activeTab === 'editor' || activeTab === 'html' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ minHeight: isFullscreen ? 'calc(100vh - 120px)' : minHeight }}
            className={cn(
              'w-full p-4 bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-900 dark:text-zinc-100 text-sm font-mono leading-relaxed resize-y',
              activeTab === 'html' ? 'bg-slate-950 text-emerald-400 font-mono' : ''
            )}
          />
        ) : (
          <div
            style={{ minHeight: isFullscreen ? 'calc(100vh - 120px)' : minHeight }}
            className="p-5 prose dark:prose-invert max-w-none text-slate-800 dark:text-zinc-200 text-sm leading-relaxed overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: value || '<p className="text-slate-400 italic">No content written yet.</p>' }}
          />
        )}
      </div>

      {/* Editor Footer Metrics */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200/80 dark:border-zinc-800 text-[11px] font-medium text-slate-500 dark:text-zinc-400 bg-slate-50/50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-4">
          <span>Words: <strong className="text-slate-800 dark:text-zinc-200">{wordCount}</strong></span>
          <span>Characters: <strong className="text-slate-800 dark:text-zinc-200">{charCount}</strong></span>
          <span>Reading time: <strong className="text-slate-800 dark:text-zinc-200">{Math.ceil(wordCount / 200)} min</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span>Auto-saving draft active</span>
        </div>
      </div>
      {error && <p className="text-xs text-rose-500 font-medium px-4 py-1">{error}</p>}
    </div>
  );
}
