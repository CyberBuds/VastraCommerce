'use client';

import * as React from 'react';
import { SystemService } from '@/services/systemService';
import { Card, Alert } from '@/components/enterprise/FeedbackComponents';
import { Button, Input, Badge } from '@/components/enterprise/BaseInputs';
import { Modal } from '@/components/enterprise/InteractiveComponents';
import { SystemRole } from '@/features/system/types/systemTypes';
import { ShieldCheck, Plus, Edit3, Trash2, Users, Check, Lock } from 'lucide-react';
import { toast } from 'sonner';

const MODULE_PERMISSIONS = [
  { module: 'Catalog Management', perms: ['view:catalog', 'create:catalog', 'edit:catalog', 'delete:catalog'] },
  { module: 'Inventory & Warehouse', perms: ['view:inventory', 'edit:inventory', 'manage:stock'] },
  { module: 'Order Processing', perms: ['view:orders', 'edit:orders', 'hold:orders', 'cancel:orders'] },
  { module: 'CRM & Customers', perms: ['view:crm', 'edit:crm', 'delete:crm'] },
  { module: 'Payment & Finance', perms: ['view:finance', 'export:finance', 'manage:billing'] },
  { module: 'System Administration', perms: ['manage:system', 'view:logs', 'manage:users'] },
];

export function RolesPermissionsView() {
  const [roles, setRoles] = React.useState<SystemRole[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [selectedRole, setSelectedRole] = React.useState<SystemRole | null>(null);
  const [isAddRoleOpen, setIsAddRoleOpen] = React.useState(false);
  const [newRoleName, setNewRoleName] = React.useState('');
  const [newRoleDesc, setNewRoleDesc] = React.useState('');

  const loadRoles = React.useCallback(async () => {
    const response = await SystemService.listRoles();
    const mapped = response.data.map((role: any): SystemRole => ({
      id: String(role.id), roleCode: role.roleCode, name: role.name, description: role.description,
      isSystem: role.isSystem, userCount: role.userCount, updatedAt: role.updatedAt,
      permissions: role.permissions.map((permission: any) => `${String(permission.action).toLowerCase()}:${String(permission.resource).toLowerCase()}`),
    }));
    setRoles(mapped);
    setSelectedRole((current) => mapped.find((role) => role.id === current?.id) || mapped[0] || null);
  }, []);

  React.useEffect(() => {
    void Promise.resolve()
      .then(loadRoles)
      .catch(() => toast.error('Unable to load roles and permissions'))
      .finally(() => setIsLoading(false));
  }, [loadRoles]);

  const handleTogglePerm = (perm: string) => {
    if (!selectedRole) return;
    const currentPerms = selectedRole.permissions;
    const updated = currentPerms.includes(perm)
      ? currentPerms.filter((p) => p !== perm)
      : [...currentPerms, perm];

    void SystemService.updateRole(selectedRole.id, { permissions: updated }).then(loadRoles);
    setSelectedRole({ ...selectedRole, permissions: updated });
    toast.success('Permission matrix updated for role');
  };

  const handleCreateRole = () => {
    if (!newRoleName) {
      toast.error('Role Name is required');
      return;
    }
    void SystemService.createRole({ name: newRoleName, description: newRoleDesc, permissions: ['view:catalog'] })
      .then(() => { void loadRoles(); toast.success('New RBAC Role Created'); setIsAddRoleOpen(false); })
      .catch(() => toast.error('Unable to create role'));
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
            Roles & Granular Permissions Matrix (RBAC)
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Define system access roles, grant fine-grained module privileges, and inspect user counts
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsAddRoleOpen(true)}>
          Create Custom Role
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side Role Selector Cards */}
        <div className="lg:col-span-4 space-y-3">
          {!isLoading && roles.map((r) => (
            <div
              key={r.id}
              onClick={() => setSelectedRole(r)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedRole?.id === r.id
                  ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20 ring-2 ring-sky-500/20'
                  : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-850'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-zinc-100">{r.name}</span>
                <Badge variant={r.isSystem ? 'secondary' : 'outline'} className="text-[10px]">
                  {r.isSystem ? 'SYSTEM' : 'CUSTOM'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{r.description}</p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-semibold">
                  <Users className="w-3.5 h-3.5" /> {r.userCount} Assigned Users
                </span>
                <span className="font-mono text-[10px]">{r.roleCode}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side Permissions Matrix */}
        <div className="lg:col-span-8">
          {selectedRole && (
            <Card
              header={
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-base text-slate-900 dark:text-zinc-100 block">{selectedRole.name} Matrix</span>
                    <span className="text-xs text-slate-500 font-mono">{selectedRole.roleCode}</span>
                  </div>
                  {!selectedRole.isSystem && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        void SystemService.deleteRole(selectedRole.id).then(() => { void loadRoles(); toast.success('Role deleted'); });
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete Role
                    </Button>
                  )}
                </div>
              }
            >
              <div className="space-y-6">
                {MODULE_PERMISSIONS.map((group) => (
                  <div key={group.module} className="space-y-2">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block">
                      {group.module}
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {group.perms.map((perm) => {
                        const isGranted = selectedRole.permissions.includes(perm) || selectedRole.permissions.includes('all:access');
                        return (
                          <button
                            key={perm}
                            type="button"
                            onClick={() => handleTogglePerm(perm)}
                            disabled={selectedRole.permissions.includes('all:access')}
                            className={`p-2.5 rounded-lg border text-left flex items-center justify-between text-xs transition-all ${
                              isGranted
                                ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300'
                                : 'bg-slate-50 dark:bg-zinc-850 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
                            }`}
                          >
                            <span className="font-mono">{perm}</span>
                            {isGranted && <Check className="w-4 h-4 text-emerald-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Add Role Modal */}
      <Modal
        isOpen={isAddRoleOpen}
        onClose={() => setIsAddRoleOpen(false)}
        title="Create New Custom Role"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddRoleOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateRole}>
              Save Role
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Role Title" placeholder="e.g. Lead Inventory Auditor" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} />
          <Input label="Description" placeholder="Access scope summary" value={newRoleDesc} onChange={(e) => setNewRoleDesc(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
