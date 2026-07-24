'use client';

import * as React from 'react';
import { useSystemStore } from '@/store/systemStore';
import { Card, Alert } from '@/components/enterprise/FeedbackComponents';
import { Button, Input, Badge } from '@/components/enterprise/BaseInputs';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { Database, Download, Plus, Trash2, HardDrive, ShieldCheck, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export function StorageBackupView() {
  const { backups, createBackup, deleteBackup } = useSystemStore();

  const handleManualBackup = () => {
    const newB = createBackup('MANUAL');
    toast.success('Database Dump Created', {
      description: `Snapshot ${newB.filename} generated (${newB.sizeMb} MB)`,
    });
  };

  const columns = [
    {
      key: 'filename',
      header: 'Snapshot Filename',
      render: (row: any) => (
        <div>
          <span className="font-mono text-xs font-bold text-slate-900 dark:text-zinc-100 block">{row.filename}</span>
          <span className="text-[10px] text-slate-400">{new Date(row.createdAt).toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (row: any) => (
        <Badge variant={row.type === 'AUTOMATED' ? 'secondary' : 'info'}>
          {row.type}
        </Badge>
      ),
    },
    {
      key: 'sizeMb',
      header: 'Archive Size',
      render: (row: any) => <span className="font-mono text-xs font-bold">{row.sizeMb} MB</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: any) => <Badge variant="success">{row.status}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={RotateCcw}
            onClick={() => {
              toast.success(`Restoration Simulation Triggered`, {
                description: `Simulating rollback to ${row.filename}`,
              });
            }}
          >
            Simulate Restore
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              deleteBackup(row.id);
              toast.success('Snapshot deleted');
            }}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
            Database Backups & Cloud Disaster Recovery
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Manage scheduled database dumps, point-in-time recovery archives, and S3 / Cloud Storage bucket syncs
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleManualBackup}>
          Create SQL Snapshot
        </Button>
      </div>

      <Alert
        type="info"
        title="Disaster Recovery Policy Active"
        description="Automated SQL backups run every 24 hours. Snapshots are encrypted with AES-256 and replicated to multi-region cloud storage."
      />

      <Card>
        <EnterpriseTable data={backups} columns={columns} searchPlaceholder="Search backup snapshots..." />
      </Card>
    </div>
  );
}
