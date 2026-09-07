// app/campaigns/page.tsx
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CampaignsTable } from './components/campaign-table';

const CampaignsPage = () => {
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <Button asChild>
          <Link href="/dashboard/campaigns/new">Create Campaign</Link>
        </Button>
      </div>
      <CampaignsTable />
    </div>
  );
};

export default CampaignsPage;
