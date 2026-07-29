// app/banners/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { BannersTable } from './components/banner-table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { BannerForm } from './components/banner-form';
  

const BannersPage = () => {
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Banners</h1>
        <Dialog>
            <DialogTrigger asChild>
                <Button>Create Banner</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Banner</DialogTitle>
                    <DialogDescription>
                        Fill in the form below to create a new banner.
                    </DialogDescription>
                </DialogHeader>
                <BannerForm />
            </DialogContent>
        </Dialog>
      </div>
      <BannersTable />
    </div>
  );
};

export default BannersPage;
