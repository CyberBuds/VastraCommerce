'use client';

import * as React from 'react';
import { Mail, Send, Paperclip, Clock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { Button, Input, Textarea } from '@/components/enterprise/BaseInputs';
import { useSendNotificationMutation } from '../hooks/useNotifications';

export function EmailCenterView() {
  const [recipient, setRecipient] = React.useState('client@enterprise.com');
  const [subject, setSubject] = React.useState('Q3 Enterprise Account Update');
  const [body, setBody] = React.useState(
    'Dear Enterprise Partner,\n\nWe are pleased to inform you that your cloud workspace limits have been expanded.\n\nBest regards,\nEnterprise Support Team'
  );
  const [scheduledAt, setScheduledAt] = React.useState('');
  const [attachments, setAttachments] = React.useState<string[]>(['Q3_Executive_Summary.pdf']);
  const sendMutation = useSendNotificationMutation();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMutation.mutate({
      title: subject,
      message: body,
      recipient,
      channel: 'email',
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-xl">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Email Center & Dispatcher</h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Compose rich HTML emails, attach files, apply transactional templates, and configure delayed schedules.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Form */}
        <form onSubmit={handleSend} className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-100 dark:border-zinc-800 pb-3">
            Compose Outbound Email
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Recipient Email(s)"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="user@domain.com"
              required
            />
            <Input
              label="Sender Alias"
              value="Enterprise Cloud <notifications@enterprise.io>"
              readOnly
            />
          </div>

          <Input
            label="Email Subject Line"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject..."
            required
          />

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
              Email Content Body (Supports Markdown/HTML)
            </label>
            <Textarea
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type message content..."
              required
            />
          </div>

          {/* Attachments Section */}
          <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300">
              <span className="flex items-center gap-1.5"><Paperclip className="w-4 h-4 text-slate-400" /> Attached Files</span>
              <button
                type="button"
                onClick={() => setAttachments([...attachments, `Attachment_${attachments.length + 1}.pdf`])}
                className="text-xs text-indigo-600 hover:underline cursor-pointer"
              >
                + Add File
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, idx) => (
                <div key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-medium text-slate-700 dark:text-zinc-300">
                  <FileText className="w-3.5 h-3.5 text-slate-400" /> {file}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-4 h-4" /> Immediate delivery active
            </div>
            <Button type="submit" isLoading={sendMutation.isPending} variant="primary">
              <Send className="w-4 h-4 mr-2" /> Dispatch Email Now
            </Button>
          </div>
        </form>

        {/* Live Email Preview Panel */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs flex flex-col">
          <div className="flex items-center gap-2 text-slate-900 dark:text-zinc-100 font-bold border-b border-slate-100 dark:border-zinc-800 pb-3 mb-4 text-sm">
            <Eye className="w-4 h-4 text-indigo-500" /> Live HTML Mail Render
          </div>

          <div className="flex-1 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 font-sans text-xs space-y-3">
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-2 text-slate-500 dark:text-zinc-400">
              <div><strong>To:</strong> {recipient}</div>
              <div><strong>Subject:</strong> {subject}</div>
            </div>

            <div className="text-slate-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap pt-2">
              {body}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-zinc-800 text-[11px] text-slate-400 text-center">
              Enterprise Global Communications Inc. &bull; Unsubscribe Preferences
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
