// app/whatsapp-campaigns/page.tsx
import { Button } from '@/components/enterprise/BaseInputs';
import Link from 'next/link';
import { WhatsAppCampaignsTable } from './components/whatsapp-campaign-table';

const WhatsAppCampaignsPage = () => {
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">WhatsApp Campaigns</h1>
        <Button asChild>
          <Link href="/dashboard/whatsapp-campaigns/new">Create Campaign</Link>
        </Button>
      </div>
      <WhatsAppCampaignsTable />
    </div>
  );
};

export default WhatsAppCampaignsPage;
