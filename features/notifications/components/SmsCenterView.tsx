'use client';

import * as React from 'react';
import { MessageSquare, Send, Smartphone, Clock, AlertCircle } from 'lucide-react';
import { Button, Input, Textarea } from '@/components/enterprise/BaseInputs';
import { useSendNotificationMutation } from '../hooks/useNotifications';

export function SmsCenterView() {
  const [phoneNumber, setPhoneNumber] = React.useState('+1 (555) 234-5678');
  const [message, setMessage] = React.useState('Your Enterprise verification code is 884920. Valid for 5 mins.');
  const sendMutation = useSendNotificationMutation();

  const charCount = message.length;
  const segments = Math.ceil(charCount / 160) || 1;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMutation.mutate({
      title: 'SMS Message',
      message,
      recipient: phoneNumber,
      channel: 'sms',
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100">SMS Gateway Dispatcher</h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Send single or batch SMS messages, calculate GSM-7 / Unicode segment counts, and preview phone screen UI.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSend} className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-100 dark:border-zinc-800 pb-3">
            SMS Message Builder
          </h2>

          <Input
            label="Recipient Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1 555-000-0000"
            required
          />

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300">
              <span>SMS Body Content</span>
              <span className="text-slate-400 font-mono">
                {charCount} chars | {segments} SMS segment(s)
              </span>
            </div>
            <Textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter SMS message..."
              required
            />
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Standard carrier messaging rates apply. Ensure recipients have opted in for SMS alerts.
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" isLoading={sendMutation.isPending} variant="primary">
              <Send className="w-4 h-4 mr-2" /> Dispatch SMS
            </Button>
          </div>
        </form>

        {/* Mobile Mock Preview */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs flex flex-col items-center justify-center">
          <div className="w-64 h-96 bg-slate-900 border-4 border-slate-700 rounded-[2.5rem] p-3 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto" />

            <div className="my-auto space-y-2">
              <div className="bg-slate-800 text-slate-300 p-3 rounded-2xl text-xs max-w-[85%] rounded-tl-none font-sans">
                {message || 'Type a message to preview...'}
              </div>
            </div>

            <div className="w-16 h-1 bg-slate-700 rounded-full mx-auto mb-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
