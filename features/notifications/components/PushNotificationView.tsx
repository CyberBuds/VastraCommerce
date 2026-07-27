'use client';

import * as React from 'react';
import { Smartphone, Send, Globe, BellRing, Target } from 'lucide-react';
import { Button, Input, Textarea } from '@/components/enterprise/BaseInputs';
import { useSendNotificationMutation } from '../hooks/useNotifications';

export function PushNotificationView() {
  const [title, setTitle] = React.useState('🔥 Flash Sale Starts Now!');
  const [body, setBody] = React.useState('Enjoy up to 40% off all enterprise cloud server tiers for the next 24 hours.');
  const [targetType, setTargetType] = React.useState('topic');
  const [targetValue, setTargetValue] = React.useState('vip-subscribers');
  const sendMutation = useSendNotificationMutation();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMutation.mutate({
      title,
      message: body,
      recipient: targetValue,
      channel: 'push',
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 text-purple-600 rounded-xl">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Push Notification Bus (FCM & APNs)</h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Deliver high-priority mobile & web push messages to target device topics or individual registered tokens.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSend} className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-100 dark:border-zinc-800 pb-3">
            Push Payload Constructor
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Target Segment Type</label>
              <select
                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-sm outline-none focus:ring-1 focus:ring-slate-500"
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
              >
                <option value="topic">FCM Topic (e.g., all-users)</option>
                <option value="segment">User Segment (e.g., vip-subscribers)</option>
                <option value="device_token">Direct FCM Registration Token</option>
              </select>
            </div>
            <Input
              label="Target Topic / Identifier"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              required
            />
          </div>

          <Input
            label="Push Notification Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Push Body Text</label>
            <Textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" isLoading={sendMutation.isPending} variant="primary">
              <Send className="w-4 h-4 mr-2" /> Dispatch Push Notification
            </Button>
          </div>
        </form>

        {/* Lockscreen Preview */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs flex flex-col items-center justify-center">
          <div className="w-full max-w-xs bg-slate-900/90 text-white rounded-2xl p-4 border border-slate-700 shadow-xl space-y-2 font-sans">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-semibold text-indigo-400">
                <BellRing className="w-3.5 h-3.5" /> ENTERPRISE APP
              </span>
              <span>now</span>
            </div>
            <div className="font-bold text-sm text-slate-100">{title || 'Push Title'}</div>
            <div className="text-xs text-slate-300 leading-snug">{body || 'Push message content...'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
