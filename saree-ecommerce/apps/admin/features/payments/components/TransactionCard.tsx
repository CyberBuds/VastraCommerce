
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TransactionCardProps {
    title: string;
    count: number;
    icon: React.ReactNode;
}

export const TransactionCard = ({ title, count, icon }: TransactionCardProps) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{count}</div>
            </CardContent>
        </Card>
    );
};
