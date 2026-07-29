// app/referral-program/page.tsx
import { ReferralRules } from "./components/referral-rules";
import { ReferralHistory } from "./components/referral-history";

const ReferralProgramPage = () => {
    return (
        <div className="p-4 md:p-8 space-y-6">
            <h1 className="text-3xl font-bold">Referral Program</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <ReferralRules />
                </div>
                <div className="lg:col-span-2">
                    <ReferralHistory />
                </div>
            </div>
        </div>
    );
}

export default ReferralProgramPage;
