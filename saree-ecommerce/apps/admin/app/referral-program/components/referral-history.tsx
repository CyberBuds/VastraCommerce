// app/referral-program/components/referral-history.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetReferrals } from "@/features/marketing/hooks/useReferralProgram";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
  

export function ReferralHistory() {
    const { data: referrals, isLoading, isError } = useGetReferrals({});

    return (
        <Card>
            <CardHeader>
                <CardTitle>Referral History</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading && <div>Loading...</div>}
                {isError && <div>Error loading history.</div>}
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Referrer ID</TableHead>
                        <TableHead>Referred User ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reward</TableHead>
                        <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {referrals?.data.map(r => (
                            <TableRow key={r.id}>
                                <TableCell>{r.referrerId}</TableCell>
                                <TableCell>{r.referredUserId}</TableCell>
                                <TableCell><Badge variant={r.status === 'COMPLETED' ? 'default' : 'secondary'}>{r.status}</Badge></TableCell>
                                <TableCell>${r.rewardAmount?.toFixed(2)}</TableCell>
                                <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
