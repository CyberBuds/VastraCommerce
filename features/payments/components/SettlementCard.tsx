
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SettlementCardProps {
    title: string;
    count: number;
    amount: string;
}

export const SettlementCard = ({ title, count, amount }: SettlementCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-sm text-muted-foreground">{amount}</p>
            </CardContent>
        </Card>
    );
};
