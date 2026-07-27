'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/services/api';
import { useLayoutStore } from '@/store/layoutStore';
import { useDialog } from '@/hooks/useDialog';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { ColumnDef } from '@tanstack/react-table';
import { Card, Dialog } from '@/components/enterprise/FeedbackComponents';
import { Button, Input, Badge } from '@/components/enterprise/BaseInputs';
import { Select } from '@/components/enterprise/InteractiveComponents';
import { Users, UserCheck, Trash2, Plus, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

// Zod Validation Schema for adding/editing users
const userSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Enter a valid enterprise email address' }),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'OPERATOR']),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

type UserFormValues = z.infer<typeof userSchema>;

interface EnterpriseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export default function UserManagementPage() {
  const queryClient = useQueryClient();
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();
  const [globalFilter, setGlobalFilter] = React.useState('');

  // Dialog Control
  const userDialog = useDialog<EnterpriseUser>();

  // Page Header & Breadcrumbs
  React.useEffect(() => {
    setActiveMenuId('administration');
    setBreadcrumbs([
      { label: 'Administration', href: '/dashboard/administration/users' },
      { label: 'User Directory' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  // Fetch Users Query
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const res = await api.get('/api/administration/users');
      return res.data.data as EnterpriseUser[];
    },
  });

  // Add User Mutation
  const addUserMutation = useMutation({
    mutationFn: async (newUser: UserFormValues) => {
      const res = await api.post('/api/administration/users', newUser);
      return res.data;
    },
    onSuccess: () => {
      toast.success('User added successfully');
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      userDialog.close();
    },
  });

  // Edit User Mutation
  const editUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UserFormValues }) => {
      const res = await api.put(`/api/administration/users/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      userDialog.close();
    },
  });

  // Delete User Mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/administration/users/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'OPERATOR',
      status: 'ACTIVE',
    },
  });

  // Sync form states when dialog opens (create vs edit)
  React.useEffect(() => {
    if (userDialog.isOpen) {
      if (userDialog.data) {
        reset({
          firstName: userDialog.data.firstName,
          lastName: userDialog.data.lastName,
          email: userDialog.data.email,
          role: userDialog.data.role as any,
          status: userDialog.data.status,
        });
      } else {
        reset({
          firstName: '',
          lastName: '',
          email: '',
          role: 'OPERATOR',
          status: 'ACTIVE',
        });
      }
    }
  }, [userDialog.isOpen, userDialog.data, reset]);

  const handleFormSubmit = (values: UserFormValues) => {
    if (userDialog.data) {
      editUserMutation.mutate({ id: userDialog.data.id, data: values });
    } else {
      addUserMutation.mutate(values);
    }
  };

  // Bulk Actions callbacks
  const handleBulkDelete = (selectedRows: EnterpriseUser[]) => {
    selectedRows.forEach((row) => {
      deleteUserMutation.mutate(row.id);
    });
    toast.success(`Triggered bulk deletion of ${selectedRows.length} users`);
  };

  const handleBulkStatusChange = (selectedRows: EnterpriseUser[], status: string) => {
    selectedRows.forEach((row) => {
      const updateData: UserFormValues = {
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        role: row.role as any,
        status: status as any,
      };
      editUserMutation.mutate({ id: row.id, data: updateData });
    });
    toast.success(`Updated status of ${selectedRows.length} users to ${status}`);
  };

  // Define Columns for `@tanstack/react-table`
  const columns = React.useMemo<ColumnDef<EnterpriseUser>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
            className="rounded-sm border-slate-300 text-slate-800"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(!!e.target.checked)}
            className="rounded-sm border-slate-300 text-slate-800"
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'firstName',
        header: 'Full Name',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 dark:text-zinc-150">
              {row.original.firstName} {row.original.lastName}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Enterprise Email',
        cell: ({ row }) => <span className="font-medium text-slate-500 dark:text-zinc-400">{row.original.email}</span>,
      },
      {
        accessorKey: 'role',
        header: 'Security Role',
        cell: ({ row }) => {
          const role = row.original.role;
          return <Badge variant={role === 'SUPER_ADMIN' ? 'purple' : 'neutral'}>{role}</Badge>;
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <Badge variant={status === 'ACTIVE' ? 'success' : 'error'}>
              {status}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => userDialog.open(row.original)}>
              Edit
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-red-500 hover:bg-red-50"
              onClick={() => {
                if (confirm(`Are you sure you want to delete ${row.original.firstName}?`)) {
                  deleteUserMutation.mutate(row.original.id);
                }
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    [userDialog, deleteUserMutation]
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
            User Administration
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Manage enterprise user accounts, access roles, and permission maps
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => userDialog.open()} icon={Plus}>
          Add Enterprise User
        </Button>
      </div>

      {/* Main Table Card */}
      <Card>
        <EnterpriseTable
          data={usersData || []}
          columns={columns}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          onBulkStatusChange={handleBulkStatusChange}
        />
      </Card>

      {/* Dialog: Create/Edit User */}
      <Dialog
        isOpen={userDialog.isOpen}
        onClose={userDialog.close}
        title={userDialog.data ? 'Modify User Profile' : 'Register Enterprise User'}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <Input
            label="Corporate Email"
            placeholder="johndoe@enterprise.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Security Clearance Role"
              options={[
                { value: 'SUPER_ADMIN', label: 'Super Admin' },
                { value: 'ADMIN', label: 'Admin' },
                { value: 'MANAGER', label: 'Manager' },
                { value: 'OPERATOR', label: 'Operator' },
              ]}
              error={errors.role?.message}
              {...register('role')}
            />

            <Select
              label="Account Status"
              options={[
                { value: 'ACTIVE', label: 'Active' },
                { value: 'INACTIVE', label: 'Suspended / Inactive' },
              ]}
              error={errors.status?.message}
              {...register('status')}
            />
          </div>

          <div className="flex gap-2.5 justify-end pt-4 border-t border-slate-100 dark:border-zinc-850 mt-4">
            <Button type="button" variant="outline" onClick={userDialog.close}>
              Discard
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={!isDirty}>
              {userDialog.data ? 'Save Modifications' : 'Register Account'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
