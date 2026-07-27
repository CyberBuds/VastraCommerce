
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RevenueCardProps {
    title: string;
    amount: string;
    icon: React.ReactNode;
}

export const RevenueCard = ({ title, amount, icon }: RevenueCardProps) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{amount}</div>
            </CardContent>
        </Card>
    );
};
