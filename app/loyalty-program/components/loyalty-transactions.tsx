// app/loyalty-program/components/loyalty-transactions.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetLoyaltyTransactions } from "@/features/marketing/hooks/useLoyaltyProgram";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
  

export function LoyaltyTransactions() {
    const { data: transactions, isLoading, isError } = useGetLoyaltyTransactions({});

    return (
        <Card>
            <CardHeader>
                <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading && <div>Loading...</div>}
                {isError && <div>Error loading history.</div>}
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Customer ID</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions?.data.map((t: any) => (
                            <TableRow key={t.id}>
                                <TableCell>{t.customerId}</TableCell>
                                <TableCell>{t.points}</TableCell>
                                <TableCell><Badge variant={t.type === 'EARN' ? 'default' : 'secondary'}>{t.type}</Badge></TableCell>
                                <TableCell>{t.description}</TableCell>
                                <TableCell>{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
