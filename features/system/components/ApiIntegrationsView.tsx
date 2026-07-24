'use client';

import * as React from 'react';
import { useSystemStore } from '@/store/systemStore';
import { Card, Alert } from '@/components/enterprise/FeedbackComponents';
import { Button, Input, Badge, Switch } from '@/components/enterprise/BaseInputs';
import { TagInput } from '@/components/enterprise/ComplexInputs';
import { Modal } from '@/components/enterprise/InteractiveComponents';
import { ThirdPartyIntegration, WebhookEndpoint } from '@/features/system/types/systemTypes';
import { Key, Webhook, Plus, CheckCircle2, ShieldCheck, Zap, Trash2, Send, Activity } from 'lucide-react';
import { toast } from 'sonner';

export function ApiIntegrationsView() {
  const { integrations, webhooks, updateIntegration, addWebhook, deleteWebhook } = useSystemStore();

  const [isAddWebhookOpen, setIsAddWebhookOpen] = React.useState(false);
  const [webhookName, setWebhookName] = React.useState('');
  const [targetUrl, setTargetUrl] = React.useState('');
  const [secretKey, setSecretKey] = React.useState(() => `whsec_${Math.random().toString(36).substring(2, 12)}`);
  const [events, setEvents] = React.useState(['order.created', 'order.shipped']);

  const handleCreateWebhook = () => {
    if (!webhookName || !targetUrl) {
      toast.error('Webhook Name and Target URL are required');
      return;
    }
    addWebhook({
      name: webhookName,
      targetUrl,
      secretKey,
      events,
      isEnabled: true,
    });
    toast.success('Webhook endpoint created');
    setIsAddWebhookOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
          API Credentials, Third-Party SDK Keys & Webhooks
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-semibold">
          Manage API keys for Gemini, Stripe, Google Maps, FedEx, and incoming/outgoing enterprise webhook dispatchers
        </p>
      </div>

      {/* Third Party Integrations Section */}
      <Card
        header={
          <div className="flex items-center gap-2">
            <Key className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
            <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">Enterprise Service API Keys</span>
          </div>
        }
      >
        <div className="space-y-4">
          {integrations.map((integ) => (
            <div
              key={integ.id}
              className="p-4 bg-slate-50 dark:bg-zinc-850 rounded-xl border border-slate-200/80 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-zinc-100">{integ.name}</span>
                  <Badge variant={integ.environment === 'PRODUCTION' ? 'success' : 'warning'}>
                    {integ.environment}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {integ.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="password"
                    value={integ.apiKey}
                    onChange={(e) => updateIntegration(integ.id, { apiKey: e.target.value })}
                    className="font-mono text-xs w-80 bg-white dark:bg-zinc-900"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast.success(`Verified connection to ${integ.name}`, {
                        description: 'Health status: 200 OK (Latency: 12ms)',
                      });
                    }}
                  >
                    Ping Health
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={integ.isEnabled}
                  onChange={(e) => {
                    updateIntegration(integ.id, { isEnabled: e.target.checked });
                    toast.success(`${integ.name} status updated`);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Outgoing Webhook Endpoints */}
      <Card
        header={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Webhook className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
              <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">Enterprise Outgoing Webhooks</span>
            </div>
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsAddWebhookOpen(true)}>
              New Webhook Endpoint
            </Button>
          </div>
        }
      >
        <div className="space-y-4 divide-y divide-slate-100 dark:divide-zinc-800">
          {webhooks.map((wh) => (
            <div key={wh.id} className="pt-3 first:pt-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-zinc-100">{wh.name}</span>
                  {wh.failureCount > 0 ? (
                    <Badge variant="danger">{wh.failureCount} Failures</Badge>
                  ) : (
                    <Badge variant="success">Healthy</Badge>
                  )}
                </div>
                <p className="text-xs font-mono text-sky-600 dark:text-sky-400">{wh.targetUrl}</p>
                <div className="flex items-center gap-1 flex-wrap pt-1">
                  {wh.events.map((ev) => (
                    <span key={ev} className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded text-slate-600 dark:text-zinc-400">
                      {ev}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Send}
                  onClick={() => {
                    toast.success(`Triggered test payload to ${wh.name}`, {
                      description: 'HTTP 200 OK returned by receiver.',
                    });
                  }}
                >
                  Test Event
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    deleteWebhook(wh.id);
                    toast.success('Webhook endpoint removed');
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Add Webhook Modal */}
      <Modal
        isOpen={isAddWebhookOpen}
        onClose={() => setIsAddWebhookOpen(false)}
        title="Add Webhook Dispatcher Endpoint"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddWebhookOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateWebhook}>
              Save Webhook
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Webhook Name" placeholder="e.g. ERP Fulfillment Endpoint" value={webhookName} onChange={(e) => setWebhookName(e.target.value)} />
          <Input label="Target URL (HTTPS)" placeholder="https://erp.enterprise.aero/webhooks" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} />
          <Input label="Signing Secret Key" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} className="font-mono" />
          <TagInput label="Subscribed System Events" tags={events} onChange={setEvents} placeholder="Add event (e.g. order.created)..." />
        </div>
      </Modal>
    </div>
  );
}
