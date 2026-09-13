'use client';

import * as React from 'react';
import { SystemService } from '@/services/systemService';
import { Card } from '@/components/enterprise/FeedbackComponents';
import { Button, Input, Badge, Switch } from '@/components/enterprise/BaseInputs';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { Modal } from '@/components/enterprise/InteractiveComponents';
import { SystemUser, SystemRoleType, UserStatus } from '@/features/system/types/systemTypes';
import { Users, UserPlus, Shield, Lock, RotateCcw, Trash2, Edit3, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export function UserManagementView() {
  const [users, setUsers] = React.useState<SystemUser[]>([]);
  const [roles, setRoles] = React.useState<Array<{ id: number; name: string; roleCode: SystemRoleType }>>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<SystemUser | null>(null);
  const [globalFilter, setGlobalFilter] = React.useState<string>(''); // Add globalFilter state

  const [email, setEmail] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [roleCode, setRoleCode] = React.useState<SystemRoleType>('ADMIN');
  const [department, setDepartment] = React.useState('IT Operations');

  const loadUsers = React.useCallback(async () => {
    const response = await SystemService.listUsers();
    setUsers(response.data.items.map((user: any) => ({
      id: String(user.id), email: user.email, firstName: user.firstName, lastName: user.lastName,
      roleCode: (user.role?.name || 'OPERATOR').toUpperCase().replace(/[^A-Z0-9]+/g, '_') as SystemRoleType,
      department: '', status: user.status, mfaEnabled: false,
      lastLoginAt: user.lastLogin || '', ipAddress: '', avatarUrl: user.profileImage || '', createdAt: user.createdAt,
    })));
  }, []);

  React.useEffect(() => {
    Promise.all([SystemService.listUsers(), SystemService.listRoles()]).then(([usersResponse, rolesResponse]) => {
      setRoles(rolesResponse.data.map((role: any) => ({
        id: role.id,
        name: role.name,
        roleCode: role.roleCode as SystemRoleType,
      })));
      setUsers(usersResponse.data.items.map((user: any) => ({
        id: String(user.id), email: user.email, firstName: user.firstName, lastName: user.lastName,
        roleCode: (user.role?.name || 'OPERATOR').toUpperCase().replace(/[^A-Z0-9]+/g, '_') as SystemRoleType,
        department: '', status: user.status, mfaEnabled: false,
        lastLoginAt: user.lastLogin || '', ipAddress: '', avatarUrl: user.profileImage || '', createdAt: user.createdAt,
      })));
    }).catch(() => toast.error('Unable to load users and roles')).finally(() => setIsLoading(false));
  }, []);

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

  const handleSaveUser = async () => {
    if (!email || !firstName || !lastName) {
      toast.error('Email, First Name and Last Name are required');
      return;
    }

    if (editingUser) {
      const role = roles.find((item) => item.roleCode === roleCode);
      await SystemService.updateUser(editingUser.id, { email, firstName, lastName, roleId: role?.id });
      await loadUsers();
      toast.success('User updated successfully');
    } else {
      const role = roles.find((item) => item.roleCode === roleCode);
      await SystemService.createUser({ email, firstName, lastName, password: 'Admin@123', roleId: role?.id });
      await loadUsers();
      toast.success('New user provisioned');
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      id: 'name',
      header: 'User Identity',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-3">
          {row.original.avatarUrl ? <img src={row.original.avatarUrl} alt={row.original.firstName} className="w-8 h-8 rounded-full border border-slate-200 dark:border-zinc-800" /> : <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-800" />}
          <div>
            <span className="font-bold text-sm text-slate-900 dark:text-zinc-100 block">
              {row.original.firstName} {row.original.lastName}
            </span>
            <span className="text-xs text-slate-500 font-mono">{row.original.email}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'roleCode',
      header: 'Role & Department',
      cell: ({ row }: any) => (
        <div>
          <Badge variant="secondary" className="font-bold text-[10px]">
            {row.original.roleCode}
          </Badge>
          <span className="text-xs text-slate-500 block mt-0.5">{row.original.department}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => (
        <Badge variant={row.original.status === 'ACTIVE' ? 'success' : 'danger'}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'mfaEnabled',
      header: 'MFA Status',
      cell: () => (
        <span className="text-xs font-semibold flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            title="Edit user"
            className="text-slate-700 hover:bg-slate-100 hover:text-indigo-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-indigo-400"
            onClick={() => openEditModal(row.original)}
          >
            <Edit3 className="w-4 h-4 !text-current" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title={row.original.status === 'ACTIVE' ? 'Suspend user' : 'Activate user'}
            className="text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:text-amber-400 dark:hover:bg-amber-950/30"
            onClick={() => {
              void SystemService.setUserStatus(row.original.id, row.original.status !== 'ACTIVE').then(loadUsers);
              toast.success(`User status changed to ${row.original.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'}`);
            }}
          >
            <Lock className="w-4 h-4 !text-current" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Delete user"
            className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
            onClick={() => {
              void SystemService.deleteUser(row.original.id).then(() => { setUsers((current) => current.filter((user) => user.id !== row.original.id)); toast.success('User account removed'); });
            }}
          >
            <Trash2 className="w-4 h-4 !text-current" />
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
          isLoading={isLoading}
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
                {roles.map((role) => <option key={role.id} value={role.roleCode}>{role.roleCode}</option>)}
              </select>
            </div>

            <Input label="Department" placeholder="SecOps / Engineering" value={department} onChange={(e) => setDepartment(e.target.value)} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
