'use client';

import * as React from 'react';
import { PhoneCall, Send, Image, FileText, CheckCheck, Sparkles } from 'lucide-react';
import { Button, Input, Textarea } from '@/components/enterprise/BaseInputs';
import { useSendNotificationMutation } from '../hooks/useNotifications';

export function WhatsAppCenterView() {
  const [phoneNumber, setPhoneNumber] = React.useState('+44 7700 900077');
  const [templateName, setTemplateName] = React.useState('order_dispatch_update');
  const [customerName, setCustomerName] = React.useState('Emma Watson');
  const [orderId, setOrderId] = React.useState('ORD-99421');
  const sendMutation = useSendNotificationMutation();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMutation.mutate({
      title: `WhatsApp: ${templateName}`,
      message: `Hi ${customerName}, your order #${orderId} is dispatched!`,
      recipient: phoneNumber,
      channel: 'whatsapp',
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-green-500/10 text-green-600 rounded-xl">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100">WhatsApp Business API Hub</h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Send verified Meta WhatsApp template messages with rich media, header documents, and quick reply buttons.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSend} className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-100 dark:border-zinc-800 pb-3">
            WhatsApp Meta Template Selector
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Recipient WhatsApp Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+44 7700 000000"
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Meta Template Name</label>
              <select
                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-sm outline-none focus:ring-1 focus:ring-slate-500"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              >
                <option value="order_dispatch_update">order_dispatch_update (Utility)</option>
                <option value="auth_2fa_passcode">auth_2fa_passcode (Authentication)</option>
                <option value="vip_flash_offer">vip_flash_offer (Marketing)</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-zinc-850 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase">Template Variable Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="{{1}} Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <Input
                label="{{2}} Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" isLoading={sendMutation.isPending} variant="primary">
              <Send className="w-4 h-4 mr-2" /> Dispatch WhatsApp Message
            </Button>
          </div>
        </form>

        {/* WhatsApp Preview Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs flex flex-col items-center justify-center">
          <div className="w-full max-w-xs bg-[#0b141a] text-white rounded-2xl p-4 shadow-xl border border-emerald-900/50 space-y-3 font-sans">
            <div className="flex items-center gap-2 border-b border-emerald-900/40 pb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs">
                WB
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-400">Enterprise Verified</div>
                <div className="text-[10px] text-slate-400">WhatsApp Business API</div>
              </div>
            </div>

            <div className="bg-[#1f2c34] p-3 rounded-xl text-xs space-y-2 relative">
              <p className="text-slate-200 leading-relaxed">
                Hi <strong className="text-white">{customerName}</strong>! Your order <strong className="text-white">#{orderId}</strong> has been shipped with Express Courier.
              </p>
              <div className="flex items-center justify-end text-[10px] text-slate-400 gap-1">
                <span>13:54</span>
                <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
              </div>
            </div>

            <div className="space-y-1">
              <button type="button" className="w-full py-2 bg-[#1f2c34] hover:bg-[#2a3942] rounded-lg text-xs font-semibold text-sky-400 text-center">
                Track Package Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
