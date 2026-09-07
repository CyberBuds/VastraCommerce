// app/email-campaigns/page.tsx
import { Button } from '@/components/enterprise/BaseInputs';
import Link from 'next/link';
import { EmailCampaignsTable } from './components/email-campaign-table';

const EmailCampaignsPage = () => {
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Email Campaigns</h1>
        <Button asChild>
          <Link href="/email-campaigns/new">Create Campaign</Link>
        </Button>
      </div>
      <EmailCampaignsTable />
    </div>
  );
};

export default EmailCampaignsPage;
