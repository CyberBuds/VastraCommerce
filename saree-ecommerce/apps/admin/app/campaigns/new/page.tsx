// app/campaigns/new/page.tsx
import { CampaignForm } from '../components/campaign-form';

const NewCampaignPage = () => {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Create Campaign</h1>
      <CampaignForm />
    </div>
  );
};

export default NewCampaignPage;
