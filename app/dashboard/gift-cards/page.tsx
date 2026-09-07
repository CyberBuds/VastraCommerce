// app/gift-cards/page.tsx
'use client';

import { Button } from '@/components/enterprise/BaseInputs';
import { GiftCardsTable } from './components/gift-card-table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/enterprise/FeedbackComponents"
import { GiftCardForm } from './components/gift-card-form';

const GiftCardsPage = () => {
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gift Cards</h1>
        <Dialog>
            <DialogTrigger asChild>
                <Button>Create Gift Card</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Gift Card</DialogTitle>
                </DialogHeader>
                <GiftCardForm />
            </DialogContent>
        </Dialog>
      </div>
      <GiftCardsTable />
    </div>
  );
};

export default GiftCardsPage;
