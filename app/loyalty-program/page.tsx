// app/loyalty-program/page.tsx
import { LoyaltyProgramSettings } from "./components/loyalty-program-settings";
import { LoyaltyTransactions } from "./components/loyalty-transactions";

const LoyaltyProgramPage = () => {
    return (
        <div className="p-4 md:p-8 space-y-6">
            <h1 className="text-3xl font-bold">Loyalty Program</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <LoyaltyProgramSettings />
                </div>
                <div className="lg:col-span-2">
                    <LoyaltyTransactions />
                </div>
            </div>
        </div>
    );
}

export default LoyaltyProgramPage;
