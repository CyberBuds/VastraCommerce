'use client';

import * as React from 'react';
import { useCmsStore } from '@/store/cmsStore';
import { CmsHeader } from './CmsHeader';
import { Button, Input } from '@/components/enterprise/BaseInputs';
import {
  Image as ImageIcon,
  Folder,
  Upload,
  Search,
  Grid,
  List as ListIcon,
  Copy,
  Trash2,
  FileText,
  FileVideo,
  Check,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

export function CmsMediaLibraryView() {
  const { mediaItems, uploadMedia, deleteMedia } = useCmsStore();
  const [search, setSearch] = React.useState('');
  const [folderFilter, setFolderFilter] = React.useState('ALL');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [selectedAsset, setSelectedAsset] = React.useState<any | null>(null);

  const filteredMedia = React.useMemo(() => {
    return mediaItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesFolder = folderFilter === 'ALL' || item.folder === folderFilter;
      return matchesSearch && matchesFolder;
    });
  }, [mediaItems, search, folderFilter]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fakeUrl = URL.createObjectURL(file);
    const uploaded = uploadMedia({
      name: file.name,
      url: fakeUrl,
      fileType: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
      mimeType: file.type || 'image/png',
      size: file.size,
      folder: 'General Uploads',
      uploadedBy: 'Current User',
    });

    toast.success(`Uploaded file "${file.name}"`);
    setSelectedAsset(uploaded);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Asset URL copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <CmsHeader
        title="Enterprise Media & Digital Asset Library"
        description="Centralized Digital Asset Management (DAM) for images, PDFs, media kits, and brand collateral."
        breadcrumbs={[{ label: 'Media Library' }]}
        secondaryButton={{
          label: 'Upload New Media',
          icon: <Upload className="w-4 h-4" />,
          onClick: () => {
            const el = document.getElementById('mediaUploadInput');
            el?.click();
          },
        }}
      />
      <input id="mediaUploadInput" type="file" onChange={handleUpload} className="hidden" />

      {/* Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search media by filename..."
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            {['ALL', 'Hero Banners', 'Blog Collateral', 'Brand Assets', 'Downloads'].map((folder) => (
              <button
                key={folder}
                onClick={() => setFolderFilter(folder)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  folderFilter === folder
                    ? 'bg-slate-900 text-white dark:bg-brand dark:text-white'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}
              >
                {folder}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-900 shadow-xs' : 'text-slate-500'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white dark:bg-zinc-900 shadow-xs' : 'text-slate-500'}`}
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Media Content Grid / Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Media Grid (3 cols) */}
        <div className="lg:col-span-3">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredMedia.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedAsset(m)}
                  className={`group rounded-2xl border p-2 flex flex-col items-center justify-between gap-2 cursor-pointer transition-all bg-white dark:bg-zinc-900 shadow-2xs ${
                    selectedAsset?.id === m.id
                      ? 'border-slate-900 dark:border-brand ring-2 ring-slate-900 dark:ring-brand'
                      : 'border-slate-200 dark:border-zinc-850 hover:border-slate-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-950 flex items-center justify-center relative">
                    {m.fileType === 'image' ? (
                      <img src={m.url} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <FileText className="w-10 h-10 text-slate-400" />
                    )}
                  </div>
                  <div className="w-full text-center">
                    <p className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">{m.name}</p>
                    <p className="text-[10px] text-slate-400">{m.folder} • {(m.size / 1024).toFixed(0)} KB</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 overflow-hidden divide-y divide-slate-100 dark:divide-zinc-850">
              {filteredMedia.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedAsset(m)}
                  className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-zinc-800 shrink-0 flex items-center justify-center">
                      {m.fileType === 'image' ? <img src={m.url} alt={m.name} className="w-full h-full object-cover" /> : <FileText className="w-5 h-5 text-slate-400" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-zinc-100">{m.name}</p>
                      <p className="text-[11px] text-slate-400">{m.folder} • Uploaded by {m.uploadedBy}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyUrl(m.url)} className="h-8 text-xs gap-1">
                    <Copy className="w-3.5 h-3.5" /> Copy URL
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Asset Details Pane (1 col) */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 space-y-4 shadow-2xs h-fit">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-200 dark:border-zinc-800 pb-2">
            Asset Inspector
          </h3>

          {selectedAsset ? (
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 aspect-video bg-slate-950 flex items-center justify-center">
                {selectedAsset.fileType === 'image' ? (
                  <img src={selectedAsset.url} alt={selectedAsset.name} className="w-full h-full object-contain" />
                ) : (
                  <FileText className="w-12 h-12 text-slate-400" />
                )}
              </div>

              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-zinc-100">{selectedAsset.name}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{selectedAsset.mimeType}</p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-400 border-t border-slate-200 dark:border-zinc-800 pt-3">
                <div className="flex justify-between"><span>Size:</span> <strong className="text-slate-800 dark:text-zinc-200">{(selectedAsset.size / 1024).toFixed(0)} KB</strong></div>
                <div className="flex justify-between"><span>Folder:</span> <strong className="text-slate-800 dark:text-zinc-200">{selectedAsset.folder}</strong></div>
                <div className="flex justify-between"><span>Uploaded:</span> <strong className="text-slate-800 dark:text-zinc-200">{new Date(selectedAsset.createdAt).toLocaleDateString()}</strong></div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => copyUrl(selectedAsset.url)} className="w-full text-xs gap-1.5">
                  <Copy className="w-3.5 h-3.5" /> Copy CDN Link
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    deleteMedia(selectedAsset.id);
                    setSelectedAsset(null);
                    toast.success('Asset deleted');
                  }}
                  className="w-full text-xs gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete File
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic text-center py-8">Select an asset from the library to inspect metadata and links.</p>
          )}
        </div>
      </div>
    </div>
  );
}
