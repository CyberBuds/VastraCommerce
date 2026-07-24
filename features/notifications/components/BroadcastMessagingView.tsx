'use client';

import * as React from 'react';
import { Radio, Send, Users, Mail, MessageSquare, PhoneCall, Smartphone, CheckSquare, Layers } from 'lucide-react';
import { Button, Input, Textarea } from '@/components/enterprise/BaseInputs';
import { useSendNotificationMutation } from '../hooks/useNotifications';

export function BroadcastMessagingView() {
  const [broadcastTitle, setBroadcastTitle] = React.useState('Q3 Enterprise Roadmap & Policy Updates');
  const [targetAudience, setTargetAudience] = React.useState('all_active_enterprises');
  const [selectedChannels, setSelectedChannels] = React.useState<string[]>(['email', 'in-app']);
  const [messageContent, setMessageContent] = React.useState(
    'Attention Workspace Administrators:\n\nWe have updated our SLA data privacy policies and deployed Q3 performance enhancements across all global regions.'
  );
  const sendMutation = useSendNotificationMutation();

  const toggleChannel = (ch: string) => {
    if (selectedChannels.includes(ch)) {
      setSelectedChannels(selectedChannels.filter((c) => c !== ch));
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    sendMutation.mutate({
      title: broadcastTitle,
      message: messageContent,
      recipient: `Audience (${targetAudience}) via [${selectedChannels.join(', ')}]`,
      channel: 'email',
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 text-rose-600 rounded-xl">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Multi-Channel Broadcast Hub</h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Dispatch synchronized mass broadcasts simultaneously across Email, SMS, WhatsApp, Push, and In-App channels.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleBroadcast} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Broadcast Campaign Title"
            value={broadcastTitle}
            onChange={(e) => setBroadcastTitle(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Target Audience Segment</label>
            <select
              className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-sm outline-none focus:ring-1 focus:ring-slate-500"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            >
              <option value="all_active_enterprises">All Active Enterprise Accounts (~4,850 Users)</option>
              <option value="paying_subscribers">Paying Premium Subscribers (~12,200 Users)</option>
              <option value="inactive_users">Inactive Accounts &gt; 90 Days (~28,400 Users)</option>
              <option value="global_all_contacts">Global All Contacts Opted-In (~148,000 Recipients)</option>
            </select>
          </div>
        </div>

        {/* Multi-Channel Selection Grid */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
            Select Delivery Channels
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { id: 'email', label: 'Email', icon: Mail, color: 'text-blue-500' },
              { id: 'sms', label: 'SMS', icon: MessageSquare, color: 'text-emerald-500' },
              { id: 'whatsapp', label: 'WhatsApp', icon: PhoneCall, color: 'text-green-500' },
              { id: 'push', label: 'Push', icon: Smartphone, color: 'text-purple-500' },
              { id: 'in-app', label: 'In-App', icon: Layers, color: 'text-indigo-500' },
            ].map((ch) => {
              const Icon = ch.icon;
              const isSelected = selectedChannels.includes(ch.id);
              return (
                <button
                  type="button"
                  key={ch.id}
                  onClick={() => toggleChannel(ch.id)}
                  className={`p-3 rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-900 dark:text-indigo-200 shadow-xs'
                      : 'bg-slate-50 dark:bg-zinc-850 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Icon className={`w-4 h-4 ${ch.color}`} /> {ch.label}
                  </div>
                  {isSelected && <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Master Broadcast Body</label>
          <Textarea
            rows={6}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            required
          />
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800">
          <div className="text-xs text-slate-500 dark:text-zinc-400">
            Estimated total reach: <strong className="text-slate-900 dark:text-zinc-100">~14,850 Messages</strong> across {selectedChannels.length} active channels.
          </div>
          <Button type="submit" isLoading={sendMutation.isPending} variant="primary" size="lg">
            <Send className="w-4 h-4 mr-2" /> Launch Multi-Channel Broadcast
          </Button>
        </div>
      </form>
    </div>
  );
}
