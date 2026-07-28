'use client';

import * as React from 'react';
import { useSystemStore } from '@/store/systemStore';
import { Card } from '@/components/enterprise/FeedbackComponents';
import { Button, Input, Badge, Switch } from '@/components/enterprise/BaseInputs';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { Modal } from '@/components/enterprise/InteractiveComponents';
import { SystemUser, SystemRoleType, UserStatus } from '@/features/system/types/systemTypes';
import { Users, UserPlus, Shield, Lock, RotateCcw, Trash2, Edit3, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export function UserManagementView() {
  const { users, addUser, updateUser, toggleUserStatus, deleteUser } = useSystemStore();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<SystemUser | null>(null);
  const [globalFilter, setGlobalFilter] = React.useState<string>(''); // Add globalFilter state

  const [email, setEmail] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [roleCode, setRoleCode] = React.useState<SystemRoleType>('ADMIN');
  const [department, setDepartment] = React.useState('IT Operations');

  const openAddModal = () => {
    setEditingUser(null);
    setEmail('');
    setFirstName('');
    setLastName('');
    setRoleCode('ADMIN');
    setDepartment('IT Operations');
    setIsModalOpen(true);
  };

  const openEditModal = (u: SystemUser) => {
    setEditingUser(u);
    setEmail(u.email);
    setFirstName(u.firstName);
    setLastName(u.lastName);
    setRoleCode(u.roleCode);
    setDepartment(u.department);
    setIsModalOpen(true);
  };

  const handleSaveUser = () => {
    if (!email || !firstName || !lastName) {
      toast.error('Email, First Name and Last Name are required');
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, {
        email,
        firstName,
        lastName,
        roleCode,
        department,
      });
      toast.success('User updated successfully');
    } else {
      addUser({
        email,
        firstName,
        lastName,
        roleCode,
        department,
        status: 'ACTIVE',
        mfaEnabled: true,
        avatarUrl: `https://picsum.photos/seed/${firstName.toLowerCase()}/80`,
      });
      toast.success('New user provisioned');
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      key: 'name',
      header: 'User Identity',
      render: (row: SystemUser) => (
        <div className="flex items-center gap-3">
          <img src={row.avatarUrl} alt={row.firstName} className="w-8 h-8 rounded-full border border-slate-200 dark:border-zinc-800" />
          <div>
            <span className="font-bold text-sm text-slate-900 dark:text-zinc-100 block">
              {row.firstName} {row.lastName}
            </span>
            <span className="text-xs text-slate-500 font-mono">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'roleCode',
      header: 'Role & Department',
      render: (row: SystemUser) => (
        <div>
          <Badge variant="secondary" className="font-bold text-[10px]">
            {row.roleCode}
          </Badge>
          <span className="text-xs text-slate-500 block mt-0.5">{row.department}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: SystemUser) => (
        <Badge variant={row.status === 'ACTIVE' ? 'success' : 'danger'}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'mfaEnabled',
      header: 'MFA Status',
      render: (row: SystemUser) => (
        <span className="text-xs font-semibold flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: SystemUser) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEditModal(row)}>
            <Edit3 className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              toggleUserStatus(row.id, row.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE');
              toast.success(`User status changed to ${row.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'}`);
            }}
          >
            <Lock className="w-4 h-4 text-amber-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              deleteUser(row.id);
              toast.success('User account removed');
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
            User Administration & Provisioning Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Manage enterprise administrator accounts, department assignments, MFA resets, and session revocations
          </p>
        </div>
        <Button variant="primary" icon={UserPlus} onClick={openAddModal}>
          Provision User Seat
        </Button>
      </div>

      <Card>
        <EnterpriseTable
          data={users}
          columns={columns}
          searchPlaceholder="Search users by name, email, department..."
          globalFilter={globalFilter} // Pass globalFilter
          setGlobalFilter={setGlobalFilter} // Pass setGlobalFilter
        />
      </Card>

      {/* User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User Credentials' : 'Provision New Enterprise User'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveUser}>
              Save User
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" placeholder="Sarah" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <Input label="Last Name" placeholder="Connor" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>

          <Input label="Corporate Email Address" placeholder="sarah@enterprise.aero" value={email} onChange={(e) => setEmail(e.target.value)} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">Assigned Role</label>
              <select
                className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-semibold"
                value={roleCode}
                onChange={(e) => setRoleCode(e.target.value as any)}
              >
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                <option value="ADMIN">ADMIN</option>
                <option value="MANAGER">MANAGER</option>
                <option value="ACCOUNTANT">ACCOUNTANT</option>
                <option value="OPERATOR">OPERATOR</option>
              </select>
            </div>

            <Input label="Department" placeholder="SecOps / Engineering" value={department} onChange={(e) => setDepartment(e.target.value)} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
