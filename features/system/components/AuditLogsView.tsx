'use client';

import * as React from 'react';
import { useSystemStore } from '@/store/systemStore';
import { Card } from '@/components/enterprise/FeedbackComponents';
import { Button, Input, Badge } from '@/components/enterprise/BaseInputs';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { Modal } from '@/components/enterprise/InteractiveComponents';
import { AuditLogItem } from '@/features/system/types/systemTypes';
import { Terminal, Download, Eye, ShieldAlert, Trash2, Code } from 'lucide-react';
import { toast } from 'sonner';

export function AuditLogsView() {
  const { auditLogs, clearAuditLogs } = useSystemStore();

  const [selectedLog, setSelectedLog] = React.useState<AuditLogItem | null>(null);
  const [globalFilter, setGlobalFilter] = React.useState<string>(''); // Add globalFilter state

  const handleExportLogs = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(auditLogs, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `audit_logs_${new Date().toISOString()}.json`;
    link.click();
    toast.success('Exported audit trail logs to JSON');
  };

  const columns = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (row: AuditLogItem) => (
        <span className="font-mono text-xs text-slate-500">
          {new Date(row.timestamp).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'userName',
      header: 'Actor',
      render: (row: AuditLogItem) => (
        <div>
          <span className="font-bold text-xs text-slate-900 dark:text-zinc-100 block">{row.userName}</span>
          <span className="text-[10px] text-slate-400 font-mono">{row.userEmail}</span>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action & Module',
      render: (row: AuditLogItem) => (
        <div>
          <Badge variant="outline" className="font-mono text-[10px] font-bold">
            {row.action}
          </Badge>
          <span className="text-xs text-slate-500 block mt-0.5">{row.module}</span>
        </div>
      ),
    },
    {
      key: 'ipAddress',
      header: 'IP / Terminal',
      render: (row: AuditLogItem) => (
        <span className="font-mono text-xs text-slate-600 dark:text-zinc-400">{row.ipAddress}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: AuditLogItem) => (
        <Badge variant={row.status === 'SUCCESS' ? 'success' : row.status === 'WARNING' ? 'warning' : 'danger'}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Inspect Diff',
      render: (row: AuditLogItem) => (
        <Button variant="ghost" size="sm" icon={Eye} onClick={() => setSelectedLog(row)}>
          Inspect
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
            Security Audit Trail & Activity Differential Logs
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Immutable log stream recording user actions, IP origins, administrative settings modifications, and object diffs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={Download} onClick={handleExportLogs}>
            Export Log Stream
          </Button>
          <Button
            variant="ghost"
            className="text-red-500"
            onClick={() => {
              clearAuditLogs();
              toast.success('Audit log cache cleared');
            }}
          >
            Clear Log View
          </Button>
        </div>
      </div>

      <Card>
        <EnterpriseTable
          data={auditLogs}
          columns={columns}
          searchPlaceholder="Search audit events by user, action, IP..."
          globalFilter={globalFilter} // Pass globalFilter
          setGlobalFilter={setGlobalFilter} // Pass setGlobalFilter
        />
      </Card>

      {/* Diff Inspector Modal */}
      <Modal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title={`Audit Inspection: ${selectedLog?.action}`}
        footer={
          <Button variant="primary" onClick={() => setSelectedLog(null)}>
            Close Inspector
          </Button>
        }
      >
        {selectedLog && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-lg space-y-1 text-xs">
              <p>
                <strong>Actor:</strong> {selectedLog.userName} ({selectedLog.userEmail})
              </p>
              <p>
                <strong>Timestamp:</strong> {new Date(selectedLog.timestamp).toISOString()}
              </p>
              <p>
                <strong>IP Address:</strong> {selectedLog.ipAddress}
              </p>
              <p>
                <strong>Details:</strong> {selectedLog.details}
              </p>
            </div>

            {selectedLog.changesJson && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">JSON Delta State Snapshot:</span>
                <pre className="bg-slate-950 text-sky-400 font-mono text-xs p-3 rounded-lg overflow-x-auto">
                  {selectedLog.changesJson}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
