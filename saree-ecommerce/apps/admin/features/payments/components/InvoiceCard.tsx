
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InvoiceCardProps {
    title: string;
    count: number;
    amount: string;
}

export const InvoiceCard = ({ title, count, amount }: InvoiceCardProps) => {
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
