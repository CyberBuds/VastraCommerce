
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TaxSummaryCardProps {
    title: string;
    amount: string;
}

export const TaxSummaryCard = ({ title, amount }: TaxSummaryCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{amount}</div>
            </CardContent>
        </Card>
    );
};
