import * as React from 'react';
import { cn } from '@/lib/utils';
import { Search, X, Calendar as CalIcon, Upload, Image as ImageIcon, Bold, Italic, List, ListOrdered } from 'lucide-react';
import { Button } from './BaseInputs';

// ==========================================
// AUTOCOMPLETE / COMBOBOX
// ==========================================
interface AutocompleteProps {
  label?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const Autocomplete = ({ label, placeholder, options, value, onChange, error }: AutocompleteProps) => {
  const [query, setQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const activeLabel = options.find((opt) => opt.value === value)?.label || '';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery(activeLabel);
  }, [value, options]);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filteredOptions = query === ''
    ? options
    : options.filter((opt) => opt.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="w-full flex flex-col gap-1.5 relative" ref={containerRef}>
      {label && <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 tracking-wide">{label}</label>}
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className={cn(
            'w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg py-2 pl-9 pr-8 text-sm outline-none transition-all focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-slate-900 dark:text-zinc-100',
            { 'border-red-500': !!error }
          )}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        {value && (
          <button
            onClick={() => {
              onChange('');
              setQuery('');
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-56 overflow-auto bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-xl py-1">
          {filteredOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setQuery(opt.label);
                setIsOpen(false);
              }}
              className={cn(
                'w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors',
                { 'font-bold bg-slate-50 dark:bg-zinc-800/50': value === opt.value }
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
      {error && <span className="text-[11px] font-medium text-red-500">{error}</span>}
    </div>
  );
};

// ==========================================
// CALENDAR & DATE PICKER
// ==========================================
interface DatePickerProps {
  label?: string;
  value: string; // ISO string date
  onChange: (date: string) => void;
  error?: string;
}

export const DatePicker = ({ label, value, onChange, error }: DatePickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const today = value ? new Date(value) : new Date();
  const formatValue = value ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

  const generateDays = () => {
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  return (
    <div className="w-full flex flex-col gap-1.5 relative" ref={containerRef}>
      {label && <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 tracking-wide">{label}</label>}
      <div className="relative" onClick={() => setIsOpen(!isOpen)}>
        <input
          type="text"
          readOnly
          placeholder="Select a date..."
          value={formatValue}
          className={cn(
            'w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-sm outline-none transition-all cursor-pointer focus:border-slate-500 text-slate-900 dark:text-zinc-100',
            { 'border-red-500': !!error }
          )}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <CalIcon className="w-4 h-4" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-64 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-2xl p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
              {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400 mb-1">
            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {generateDays().map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} />;
              const isSelected = value ? new Date(value).toDateString() === day.toDateString() : false;
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => {
                    onChange(day.toISOString());
                    setIsOpen(false);
                  }}
                  className={cn(
                    'h-7 w-7 text-xs flex items-center justify-center rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-zinc-850',
                    isSelected ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold' : 'text-slate-700 dark:text-zinc-300'
                  )}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {error && <span className="text-[11px] font-medium text-red-500">{error}</span>}
    </div>
  );
};

// ==========================================
// MULTI SELECT
// ==========================================
interface MultiSelectProps {
  label?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
  error?: string;
}

export const MultiSelect = ({ label, placeholder, options, selected, onChange, error }: MultiSelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelect = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((x) => x !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  return (
    <div className="w-full flex flex-col gap-1.5 relative" ref={containerRef}>
      {label && <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 tracking-wide">{label}</label>}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full min-h-[38px] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-1.5 flex flex-wrap gap-1 items-center cursor-pointer outline-none transition-all focus-within:border-slate-500',
          { 'border-red-500': !!error }
        )}
      >
        {selected.length === 0 ? (
          <span className="text-sm text-slate-400 dark:text-zinc-500 px-1.5">{placeholder || 'Select multiple...'}</span>
        ) : (
          selected.map((val) => {
            const opt = options.find((o) => o.value === val);
            return (
              <span
                key={val}
                className="inline-flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 text-xs font-semibold pl-2 pr-1.5 py-0.5 rounded-md border border-slate-250 dark:border-zinc-700"
              >
                <span>{opt?.label || val}</span>
                <X
                  className="w-3.5 h-3.5 hover:text-red-500 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(selected.filter((x) => x !== val));
                  }}
                />
              </span>
            );
          })
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-56 overflow-auto bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-xl py-1">
          {options.map((opt) => {
            const isSelected = selected.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  'w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors flex justify-between items-center',
                  { 'bg-slate-50 dark:bg-zinc-800/30': isSelected }
                )}
              >
                <span>{opt.label}</span>
                {isSelected && <span className="text-xs font-bold text-slate-800 dark:text-zinc-300">✓</span>}
              </button>
            );
          })}
        </div>
      )}
      {error && <span className="text-[11px] font-medium text-red-500">{error}</span>}
    </div>
  );
};

// ==========================================
// TAG INPUT
// ==========================================
interface TagInputProps {
  label?: string;
  placeholder?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
}

export const TagInput = ({ label, placeholder, tags, onChange }: TagInputProps) => {
  const [input, setInput] = React.useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = input.trim();
      if (val && !tags.includes(val)) {
        onChange([...tags, val]);
      }
      setInput('');
    }
  };

  const handleRemove = (t: string) => {
    onChange(tags.filter((tag) => tag !== t));
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 tracking-wide">{label}</label>}
      <div className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-1.5 flex flex-wrap gap-1.5 items-center">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-300 text-xs font-semibold pl-2 pr-1.5 py-0.5 rounded-md border border-slate-250 dark:border-zinc-750"
          >
            <span>{tag}</span>
            <X className="w-3.5 h-3.5 hover:text-red-500 cursor-pointer" onClick={() => handleRemove(tag)} />
          </span>
        ))}
        <input
          type="text"
          placeholder={tags.length === 0 ? placeholder || 'Add tag...' : ''}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none py-1 px-1.5 text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400"
        />
      </div>
    </div>
  );
};

// ==========================================
// OTP INPUT
// ==========================================
interface OtpInputProps {
  length?: number;
  onChange: (otp: string) => void;
  error?: string;
}

export const OtpInput = ({ length = 6, onChange, error }: OtpInputProps) => {
  const [values, setValues] = React.useState<string[]>(Array(length).fill(''));
  const inputsRef = React.useRef<HTMLInputElement[]>([]);

  const handleChange = (val: string, index: number) => {
    const numericVal = val.replace(/\D/g, '').slice(-1);
    const updated = [...values];
    updated[index] = numericVal;
    setValues(updated);
    onChange(updated.join(''));

    // Shift focus forward
    if (numericVal && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex gap-2">
        {values.map((val, idx) => (
          <input
            key={idx}
            ref={(el) => { if (el) inputsRef.current[idx] = el; }}
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            maxLength={1}
            value={val}
            onChange={(e) => handleChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className="w-10 h-12 bg-white dark:bg-zinc-900 border border-slate-250 dark:border-zinc-800 rounded-lg text-center font-bold text-lg text-slate-900 dark:text-zinc-100 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          />
        ))}
      </div>
      {error && <span className="text-xs font-semibold text-red-500">{error}</span>}
    </div>
  );
};

// ==========================================
// FILE & IMAGE UPLOAD
// ==========================================
interface UploadProps {
  label?: string;
  accept?: string;
  onChange: (file: File | null) => void;
  type?: 'file' | 'image';
}

export const FileUpload = ({ label, accept, onChange, type = 'file' }: UploadProps) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      onChange(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onChange(file);
    }
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 tracking-wide">{label}</label>}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'w-full border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-50/50 dark:hover:bg-zinc-900/50',
          { 'border-slate-800 bg-slate-50 dark:bg-zinc-900': dragActive }
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
        />
        {type === 'image' ? (
          <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
        ) : (
          <Upload className="w-8 h-8 text-slate-400 mb-2" />
        )}

        {selectedFile ? (
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">{selectedFile.name}</p>
            <p className="text-xs text-slate-400 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">Drag & drop or Click to upload</p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG, PDF, or CSV up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// SIMULATED RICH TEXT EDITOR
// ==========================================
interface RichEditorProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const RichTextEditor = ({ label, value, onChange, placeholder }: RichEditorProps) => {
  const [html, setHtml] = React.useState(value);

  const applyFormat = (tag: string) => {
    // Simple mock markup injection
    if (tag === 'bold') {
      setHtml((prev) => prev + ' <b>bold text</b> ');
    } else if (tag === 'italic') {
      setHtml((prev) => prev + ' <i>italic text</i> ');
    } else if (tag === 'ul') {
      setHtml((prev) => prev + '\n• list item');
    }
  };

  React.useEffect(() => {
    onChange(html);
  }, [html, onChange]);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 tracking-wide">{label}</label>}
      <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
        <div className="bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 px-3 py-1.5 flex gap-2">
          <Button variant="ghost" size="icon" className="w-8 h-8 p-0" onClick={() => applyFormat('bold')} title="Bold">
            <Bold className="w-4 h-4 text-slate-600" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 p-0" onClick={() => applyFormat('italic')} title="Italic">
            <Italic className="w-4 h-4 text-slate-600" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 p-0" onClick={() => applyFormat('ul')} title="Unordered List">
            <List className="w-4 h-4 text-slate-600" />
          </Button>
        </div>
        <textarea
          value={html}
          placeholder={placeholder || 'Write descriptive details...'}
          onChange={(e) => setHtml(e.target.value)}
          className="w-full min-h-[140px] px-3 py-2 text-sm text-slate-800 dark:text-zinc-200 bg-transparent border-none outline-none focus:ring-0 placeholder-slate-400"
        />
      </div>
    </div>
  );
};
