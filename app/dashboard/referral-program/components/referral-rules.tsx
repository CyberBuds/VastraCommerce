// app/referral-program/components/referral-rules.tsx
'use client';

import { useGetReferralRules, useUpdateReferralRule } from "@/features/marketing/hooks/useReferralProgram";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { referralRuleSchema } from "@/features/marketing/types/validation";
import { ReferralRule } from "@/types/marketing";


export function ReferralRules() {
    const { data: rules, isLoading, isError } = useGetReferralRules();
    const updateRuleMutation = useUpdateReferralRule();

    if (isLoading) return <div>Loading rules...</div>
    if (isError) return <div>Error loading rules.</div>

    const onSubmit = (data: ReferralRule) => {
        updateRuleMutation.mutate({ id: data.id, data });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Referral Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {rules?.map(rule => (
                    <RuleForm key={rule.id} rule={rule} onSubmit={onSubmit} isLoading={updateRuleMutation.isPending} />
                ))}
            </CardContent>
        </Card>
    );
}

function RuleForm({ rule, onSubmit, isLoading }: { rule: ReferralRule, onSubmit: (data: ReferralRule) => void, isLoading: boolean }) {

    type RuleFormValues = z.infer<typeof referralRuleSchema>;

    const form = useForm<RuleFormValues>({
        resolver: zodResolver(referralRuleSchema),
        defaultValues: rule
    });

    const handleSubmit = (data: RuleFormValues) => {
        onSubmit({ ...rule, ...data });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-4 border rounded-md space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rule Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="reward"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Reward Amount</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="minSpend"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Minimum Spend</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                                <Switch
                                    checked={field.value === 'ACTIVE'}
                                    onCheckedChange={(checked) => field.onChange(checked ? 'ACTIVE' : 'INACTIVE')}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Rule'}</Button>
            </form>
        </Form>
    )
}
