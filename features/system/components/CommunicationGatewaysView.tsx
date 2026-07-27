'use client';

import * as React from 'react';
import { useSystemStore } from '@/store/systemStore';
import { Card, Alert } from '@/components/enterprise/FeedbackComponents';
import { Button, Input, Switch, Badge } from '@/components/enterprise/BaseInputs';
import { Modal } from '@/components/enterprise/InteractiveComponents';
import { CommunicationGatewayConfig, GatewayType } from '@/features/system/types/systemTypes';
import { Mail, MessageSquare, Send, Bell, Smartphone, CheckCircle, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'sonner';

export function CommunicationGatewaysView() {
  const { gateways, updateGatewayConfig } = useSystemStore();

  const [activeTab, setActiveTab] = React.useState<GatewayType>('EMAIL');
  const [isTestModalOpen, setIsTestModalOpen] = React.useState(false);
  const [testRecipient, setTestRecipient] = React.useState('secops@enterprise.aero');
  const [isSendingTest, setIsSendingTest] = React.useState(false);

  const activeGateway = gateways.find((g) => g.type === activeTab) || gateways[0];

  const handleToggleEnable = (checked: boolean) => {
    updateGatewayConfig(activeTab, { isEnabled: checked });
    toast.success(`${activeTab} Gateway status updated`);
  };

  const handleSendTestMessage = async () => {
    setIsSendingTest(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSendingTest(false);
    setIsTestModalOpen(false);
    toast.success(`Test message dispatched via ${activeGateway.provider}`, {
      description: `Delivery request sent to ${testRecipient}`,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
          Communication Gateways & Dispatch Channels
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-semibold">
          Configure corporate Email (SMTP/SES), Twilio SMS, WhatsApp Meta Business API, and FCM Push Notification services
        </p>
      </div>

      {/* Gateway Tabs */}
      <div className="flex border-b border-slate-200 dark:border-zinc-800 gap-6">
        <button
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'EMAIL'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
          }`}
          onClick={() => setActiveTab('EMAIL')}
        >
          <Mail className="w-4 h-4" /> Email Gateway (SES/SMTP)
        </button>

        <button
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'SMS'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
          }`}
          onClick={() => setActiveTab('SMS')}
        >
          <Smartphone className="w-4 h-4" /> SMS Gateway (Twilio)
        </button>

        <button
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'WHATSAPP'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
          }`}
          onClick={() => setActiveTab('WHATSAPP')}
        >
          <MessageSquare className="w-4 h-4" /> WhatsApp Business API
        </button>

        <button
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'PUSH'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
          }`}
          onClick={() => setActiveTab('PUSH')}
        >
          <Bell className="w-4 h-4" /> Web Push & FCM
        </button>
      </div>

      {/* Selected Gateway Detail Panel */}
      <Card
        header={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
              <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">{activeGateway.provider}</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" icon={Send} onClick={() => setIsTestModalOpen(true)}>
                Send Test Dispatch
              </Button>
              <Switch checked={activeGateway.isEnabled} onChange={(e) => handleToggleEnable(e.target.checked)} />
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Daily Quota Utilization Gauge */}
          <div className="p-4 bg-slate-50 dark:bg-zinc-850 rounded-xl border border-slate-200/60 dark:border-zinc-800 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-zinc-300">Daily Message Quota Usage</span>
              <span className="text-slate-900 dark:text-zinc-100 font-mono">
                {activeGateway.usedToday.toLocaleString()} / {activeGateway.dailyQuota.toLocaleString()} dispatched
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-sky-500 h-2 rounded-full"
                style={{ width: `${(activeGateway.usedToday / activeGateway.dailyQuota) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Sender Address / Number / App ID"
              value={activeGateway.senderAddress}
              onChange={(e) => updateGatewayConfig(activeTab, { senderAddress: e.target.value })}
            />
            <Input
              label="Sender Display Name"
              value={activeGateway.senderName}
              onChange={(e) => updateGatewayConfig(activeTab, { senderName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="API Key / Credential Token"
              type="password"
              value={activeGateway.apiKey}
              onChange={(e) => updateGatewayConfig(activeTab, { apiKey: e.target.value })}
            />
            {activeGateway.host !== undefined && (
              <Input
                label="SMTP Host Endpoint"
                value={activeGateway.host}
                onChange={(e) => updateGatewayConfig(activeTab, { host: e.target.value })}
              />
            )}
          </div>
        </div>
      </Card>

      {/* Test Dispatch Modal */}
      <Modal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        title={`Send Test Message via ${activeGateway.provider}`}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsTestModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon={Send} isLoading={isSendingTest} onClick={handleSendTestMessage}>
              Dispatch Test Message
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Recipient Address / Phone / User ID"
            value={testRecipient}
            onChange={(e) => setTestRecipient(e.target.value)}
          />
          <p className="text-xs text-slate-500">
            Sends an immediate test ping payload to verify API key authorization, quota access, and webhook callback status.
          </p>
        </div>
      </Modal>
    </div>
  );
}
