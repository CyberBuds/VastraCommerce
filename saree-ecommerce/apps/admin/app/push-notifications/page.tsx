// app/push-notifications/page.tsx
'use client';

import { Button } from '@/components/enterprise/BaseInputs';
import { PushNotificationsTable } from './components/push-notification-table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/enterprise/FeedbackComponents"
import { PushNotificationForm } from './components/push-notification-form';

const PushNotificationsPage = () => {
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Push Notifications</h1>
        <Dialog>
            <DialogTrigger asChild>
                <Button>Create Notification</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Push Notification</DialogTitle>
                </DialogHeader>
                <PushNotificationForm />
            </DialogContent>
        </Dialog>
      </div>
      <PushNotificationsTable />
    </div>
  );
};

export default PushNotificationsPage;
