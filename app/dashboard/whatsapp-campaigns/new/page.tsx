import { WhatsAppCampaignForm } from '../components/whatsapp-campaign-form';

const NewWhatsAppCampaignPage = () => {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Create WhatsApp Campaign</h1>
      <WhatsAppCampaignForm />
    </div>
  );
};

export default NewWhatsAppCampaignPage;
