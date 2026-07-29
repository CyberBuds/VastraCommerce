
import { Badge } from "@/components/enterprise/BaseInputs";

interface GatewayBadgeProps {
    gateway: string;
}

export const GatewayBadge = ({ gateway }: GatewayBadgeProps) => {
    return <Badge>{gateway}</Badge>;
};
