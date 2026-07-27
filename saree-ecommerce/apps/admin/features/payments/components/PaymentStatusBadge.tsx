
import { Badge } from "@/components/enterprise/BaseInputs";
import { cn } from "@/lib/utils";

interface PaymentStatusBadgeProps {
    status: 'pending' | 'completed' | 'failed';
}

export const PaymentStatusBadge = ({ status }: PaymentStatusBadgeProps) => {
    return (
        <Badge
            className={cn({
                "bg-yellow-500": status === "pending",
                "bg-green-500": status === "completed",
                "bg-red-500": status === "failed",
            })}
        >
            {status}
        </Badge>
    );
};
