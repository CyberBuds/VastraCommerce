'use client';

import * as React from 'react';
import { Inbox, Send, AlertCircle, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { Button, Input, Textarea } from '@/components/enterprise/BaseInputs';
import { useSendNotificationMutation } from '../hooks/useNotifications';

export function InAppNotificationView() {
  const [title, setTitle] = React.useState('Scheduled Platform Maintenance');
  const [content, setContent] = React.useState('The system will undergo database index optimization tonight between 02:00 - 03:00 UTC.');
  const [type, setType] = React.useState<'banner' | 'modal' | 'toast'>('banner');
  const [priority, setPriority] = React.useState('high');
  const sendMutation = useSendNotificationMutation();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMutation.mutate({
      title,
      message: content,
      recipient: 'all-logged-in-users',
      channel: 'in-app',
      priority: priority as any,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-600 rounded-xl">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100">In-App Banner & Toast Manager</h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Publish real-time workspace alert banners, modal dialogs, and toast messages to active logged-in sessions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSend} className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-100 dark:border-zinc-800 pb-3">
            In-App Announcement Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Display Layout Type</label>
              <select
                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-sm outline-none focus:ring-1 focus:ring-slate-500"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
              >
                <option value="banner">Sticky Top Banner</option>
                <option value="modal">Blocking System Modal</option>
                <option value="toast">Corner Toast Notification</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Priority Level</label>
              <select
                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-sm outline-none focus:ring-1 focus:ring-slate-500"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low (Informational)</option>
                <option value="normal">Normal</option>
                <option value="high">High (Action Required)</option>
                <option value="urgent">Urgent (Critical System Alert)</option>
              </select>
            </div>
          </div>

          <Input
            label="Notification Heading"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Message Content</label>
            <Textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" isLoading={sendMutation.isPending} variant="primary">
              <Send className="w-4 h-4 mr-2" /> Publish In-App Alert
            </Button>
          </div>
        </form>

        {/* Live Banner / Modal Preview */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-100 dark:border-zinc-800 pb-2">
            UI Render Preview
          </h3>

          {type === 'banner' && (
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-900 dark:text-indigo-200 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm">{title}</div>
                <div className="mt-1 text-slate-600 dark:text-zinc-300">{content}</div>
              </div>
            </div>
          )}

          {type === 'modal' && (
            <div className="p-5 bg-white dark:bg-zinc-850 border border-slate-300 dark:border-zinc-700 rounded-2xl shadow-xl text-xs space-y-3">
              <div className="font-bold text-base text-slate-900 dark:text-zinc-100">{title}</div>
              <div className="text-slate-600 dark:text-zinc-300 leading-relaxed">{content}</div>
              <Button variant="primary" size="sm" className="w-full">Acknowledge</Button>
            </div>
          )}

          {type === 'toast' && (
            <div className="p-4 bg-slate-900 text-white rounded-xl shadow-2xl text-xs space-y-1 border border-slate-700">
              <div className="font-bold text-indigo-400">{title}</div>
              <div className="text-slate-300">{content}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
