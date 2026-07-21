'use client';

import * as React from 'react';
import { Upload, Trash2, ArrowLeft, ArrowRight, Crop, Layers, AlertCircle, Edit2, FileText, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Input } from '@/components/enterprise/BaseInputs';
import { toast } from 'sonner';

interface MediaItem {
  id: string;
  url: string;
  name: string;
  sizeKb: number;
  altText: string;
  type: 'image' | 'video' | 'document';
  optimized?: boolean;
}

interface MediaGalleryManagerProps {
  mediaList: MediaItem[];
  onChange: (list: MediaItem[]) => void;
}

export function MediaGalleryManager({ mediaList, onChange }: MediaGalleryManagerProps) {
  const [selectedItem, setSelectedItem] = React.useState<MediaItem | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const [cropModalItem, setCropModalItem] = React.useState<MediaItem | null>(null);
  const [cropRatio, setCropRatio] = React.useState<'1:1' | '16:9' | '4:3'>('1:1');

  // Drag and Drop files
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
      Array.from(e.dataTransfer.files).forEach(file => {
        addMockFile(file);
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => {
        addMockFile(file);
      });
    }
  };

  const addMockFile = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const type: 'image' | 'video' | 'document' = isImage ? 'image' : isVideo ? 'video' : 'document';

    // Generate unsplash image for visual fidelity if it is an image
    const mockUnsplashUrls = [
      'https://images.unsplash.com/photo-1518364538800-6bcb3f25da49?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&h=400&fit=crop',
    ];
    const randomUrl = mockUnsplashUrls[Math.floor(Math.random() * mockUnsplashUrls.length)];

    const newItem: MediaItem = {
      id: `media-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: file.name,
      sizeKb: Math.floor(file.size / 1024),
      url: isImage ? randomUrl : 'https://www.w3schools.com/html/mov_bbb.mp4',
      altText: file.name.split('.')[0],
      type,
    };

    onChange([...mediaList, newItem]);
    toast.success('Media catalog file added successfully!');
  };

  // Reorder list
  const moveItem = (index: number, direction: 'left' | 'right') => {
    const newList = [...mediaList];
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newList.length) return;

    // swap
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;

    onChange(newList);
  };

  // Delete Item
  const deleteItem = (id: string) => {
    const filtered = mediaList.filter(item => item.id !== id);
    onChange(filtered);
    if (selectedItem?.id === id) setSelectedItem(null);
    toast.info('Media asset deleted from registry.');
  };

  // Optimize (Compression Simulator)
  const optimizeImage = (item: MediaItem) => {
    const newList = mediaList.map(m => {
      if (m.id === item.id) {
        return {
          ...m,
          sizeKb: Math.round(m.sizeKb * 0.42), // 58% reduction
          optimized: true,
        };
      }
      return m;
    });
    onChange(newList);
    toast.success('Lossless compression executed successfully', {
      description: `Reduced size by 58%. Current size: ${Math.round(item.sizeKb * 0.42)} KB.`,
    });
  };

  // Apply crop simulator
  const handleCropSave = () => {
    if (!cropModalItem) return;
    const newList = mediaList.map(m => {
      if (m.id === cropModalItem.id) {
        return {
          ...m,
          url: m.url + '&crop=entropy&q=80', // visual simulation of cropper modification
          name: `cropped-${m.name}`,
          sizeKb: Math.round(m.sizeKb * 0.85),
        };
      }
      return m;
    });
    onChange(newList);
    setCropModalItem(null);
    toast.success(`Image cropped to ${cropRatio} viewport layout.`);
  };

  return (
    <div className="space-y-6" id="media-gallery-manager">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Drag/Drop and Visual Thumbnails */}
        <div className="lg:col-span-8 space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed border-slate-200 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-500 rounded-2xl p-6 text-center transition-colors cursor-pointer bg-slate-50/20 dark:bg-zinc-950/20',
              dragActive ? 'border-brand bg-brand/5 dark:border-brand' : ''
            )}
            onClick={() => document.getElementById('catalog-media-uploader')?.click()}
          >
            <input
              id="catalog-media-uploader"
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
            />
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">
              Drag and drop product assets here, or click to browse
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports Images, Videos (MP4), PDFs, and CAD Schematics (Up to 25MB)
            </p>
          </div>

          {/* Thumbnails grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mediaList.map((item, idx) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={cn(
                    'relative rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden group cursor-pointer aspect-square flex flex-col justify-between bg-white dark:bg-zinc-900 shadow-xs hover:shadow-md transition-all',
                    isSelected ? 'ring-2 ring-brand dark:ring-brand' : ''
                  )}
                >
                  {/* File Thumbnail */}
                  <div className="flex-1 w-full flex items-center justify-center bg-slate-50 dark:bg-zinc-950 relative">
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.altText}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : item.type === 'video' ? (
                      <div className="flex flex-col items-center gap-1">
                        <Video className="w-8 h-8 text-brand" />
                        <span className="text-[9px] font-bold text-slate-400">VIDEO</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <FileText className="w-8 h-8 text-indigo-500" />
                        <span className="text-[9px] font-bold text-slate-400">DOC</span>
                      </div>
                    )}

                    {idx === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-slate-900/80 dark:bg-brand text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                        Main SKU Cover
                      </span>
                    )}

                    {/* Quick action buttons on hover */}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-opacity duration-150">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveItem(idx, 'left');
                        }}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/25 disabled:opacity-30 cursor-pointer"
                        title="Move Left"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveItem(idx, 'right');
                        }}
                        disabled={idx === mediaList.length - 1}
                        className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/25 disabled:opacity-30 cursor-pointer"
                        title="Move Right"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem(item.id);
                        }}
                        className="p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-600 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Metadata line */}
                  <div className="p-2 border-t border-slate-100 dark:border-zinc-850 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-800 dark:text-zinc-200 truncate leading-snug">
                      {item.name}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5 font-semibold flex justify-between items-center">
                      <span>{item.sizeKb} KB</span>
                      {item.optimized && (
                        <span className="text-emerald-500 font-extrabold text-[8px]">COMPRESSED</span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Asset Editor Controls */}
        <div className="lg:col-span-4 bg-slate-50 dark:bg-zinc-950/20 border border-slate-200/60 dark:border-zinc-850 rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-850 pb-2.5">
            <Layers className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
              Asset Properties
            </h3>
          </div>

          {selectedItem ? (
            <div className="space-y-4 text-xs">
              <div className="aspect-video w-full rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 overflow-hidden relative">
                {selectedItem.type === 'image' ? (
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.altText}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-slate-400 font-bold">
                    {selectedItem.type.toUpperCase()} PREVIEW
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">File Identifier</span>
                <p className="font-mono text-[10px] bg-slate-100 dark:bg-zinc-900 p-2 rounded-md break-all text-slate-650 dark:text-zinc-400">
                  {selectedItem.id}
                </p>
              </div>

              <Input
                label="Alt Text / Accessibility Label"
                value={selectedItem.altText}
                onChange={(e) => {
                  const val = e.target.value;
                  const updated = mediaList.map(item => item.id === selectedItem.id ? { ...item, altText: val } : item);
                  onChange(updated);
                  setSelectedItem({ ...selectedItem, altText: val });
                }}
                placeholder="Product high-output turbine assembly cover"
              />

              <div className="flex flex-col gap-2 pt-2 border-t border-slate-150 dark:border-zinc-850">
                {selectedItem.type === 'image' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full font-bold text-xs"
                      onClick={() => setCropModalItem(selectedItem)}
                      icon={Crop}
                    >
                      Crop Image Layer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full font-bold text-xs"
                      disabled={selectedItem.optimized}
                      onClick={() => optimizeImage(selectedItem)}
                      icon={Layers}
                    >
                      Compress Image Size
                    </Button>
                  </>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  className="w-full font-bold text-xs"
                  onClick={() => deleteItem(selectedItem.id)}
                  icon={Trash2}
                >
                  Delete Asset
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5 text-slate-350" />
              <p className="text-xs font-bold leading-normal">
                Select any uploaded media card to edit properties, crop margins, or apply lossless compression.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Crop Simulated Dialog */}
      {cropModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="text-sm font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                Simulated Cropping Tool
              </h4>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                onClick={() => setCropModalItem(null)}
              >
                ✕
              </button>
            </div>

            <div className="aspect-square w-full bg-slate-100 relative rounded-xl border border-slate-200 overflow-hidden">
              <img
                src={cropModalItem.url}
                alt="Crop preview"
                className="w-full h-full object-cover blur-xs opacity-60"
                referrerPolicy="no-referrer"
              />
              {/* Cropper box selector overlay */}
              <div className={cn(
                "absolute inset-4 border-2 border-brand border-dashed bg-transparent transition-all duration-300",
                cropRatio === '16:9' ? 'top-10 bottom-10' : cropRatio === '4:3' ? 'top-6 bottom-6' : ''
              )}>
                <span className="absolute top-1 right-1 bg-brand text-white font-extrabold text-[8px] px-1 py-0.5 rounded-sm">
                  CROP GRID
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-500">Aspect Ratio:</span>
              <div className="flex gap-2">
                {(['1:1', '16:9', '4:3'] as const).map(ratio => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setCropRatio(ratio)}
                    className={cn(
                      "px-2.5 py-1 rounded-md font-extrabold border transition-colors cursor-pointer",
                      cropRatio === ratio ? "bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setCropModalItem(null)}>
                Discard
              </Button>
              <Button type="button" variant="primary" onClick={handleCropSave}>
                Save Crop Configuration
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
