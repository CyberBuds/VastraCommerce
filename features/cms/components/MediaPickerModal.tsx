'use client';

import * as React from 'react';
import { useCmsStore } from '@/store/cmsStore';
import { Button } from '@/components/enterprise/BaseInputs';
import { Search, Upload, Check, Folder, FileImage, X } from 'lucide-react';
import { toast } from 'sonner';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media Asset',
}: MediaPickerModalProps) {
  const { mediaItems, uploadMedia } = useCmsStore();
  const [search, setSearch] = React.useState('');
  const [selectedUrl, setSelectedUrl] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const filteredMedia = mediaItems.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.folder.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fakeUrl = URL.createObjectURL(file);
    const uploaded = uploadMedia({
      name: file.name,
      url: fakeUrl,
      fileType: file.type.startsWith('image/') ? 'image' : 'document',
      mimeType: file.type || 'image/png',
      size: file.size,
      folder: 'Uploads',
      uploadedBy: 'Current User',
    });

    setSelectedUrl(uploaded.url);
    toast.success('Media asset uploaded successfully!');
  };

  const handleConfirm = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-3xl flex flex-col max-h-[85vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50 dark:bg-zinc-900/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">{title}</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Choose from existing media library or upload a new file</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-3 bg-white dark:bg-zinc-900">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search files or folders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-brand"
            />
          </div>

          <label className="cursor-pointer">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white dark:bg-brand dark:text-white shadow-xs hover:opacity-90">
              <Upload className="w-3.5 h-3.5" /> Upload File
            </span>
            <input type="file" accept="image/*,video/*,.pdf" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Media Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 flex-1 min-h-[300px]">
          {filteredMedia.map((m) => {
            const isSelected = selectedUrl === m.url;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedUrl(m.url)}
                className={`group relative rounded-xl border p-2 flex flex-col items-center justify-between gap-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-slate-900 dark:border-brand bg-slate-100/80 dark:bg-brand/10 ring-2 ring-slate-900 dark:ring-brand'
                    : 'border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40 hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="w-full h-28 rounded-lg overflow-hidden bg-slate-100 dark:bg-zinc-800 flex items-center justify-center relative">
                  {m.fileType === 'image' ? (
                    <img src={m.url} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <FileImage className="w-8 h-8 text-slate-400" />
                  )}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-slate-900 dark:bg-brand text-white p-1 rounded-full shadow-md">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="w-full text-center">
                  <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate">{m.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{m.folder} • {(m.size / 1024).toFixed(0)} KB</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-end gap-3 bg-slate-50 dark:bg-zinc-900/50">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!selectedUrl}
            onClick={handleConfirm}
          >
            Select Asset
          </Button>
        </div>
      </div>
    </div>
  );
}
