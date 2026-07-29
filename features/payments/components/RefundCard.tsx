
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RefundCardProps {
    title: string;
    count: number;
    amount: string;
}

export const RefundCard = ({ title, count, amount }: RefundCardProps) => {
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
