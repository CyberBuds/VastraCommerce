// app/dashboard/flash-sales/new/page.tsx
import { FlashSaleForm } from '../components/flash-sale-form';

const NewFlashSalePage = () => {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Create Flash Sale</h1>
      <FlashSaleForm />
    </div>
  );
};

export default NewFlashSalePage;
