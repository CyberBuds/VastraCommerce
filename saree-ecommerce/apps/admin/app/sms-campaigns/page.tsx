// app/sms-campaigns/page.tsx
import { Button } from '@/components/enterprise/BaseInputs';
import Link from 'next/link';
import { SmsCampaignsTable } from './components/sms-campaign-table';

const SmsCampaignsPage = () => {
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">SMS Campaigns</h1>
        <Button asChild>
          <Link href="/sms-campaigns/new">Create Campaign</Link>
        </Button>
      </div>
      <SmsCampaignsTable />
    </div>
  );
};

export default SmsCampaignsPage;
