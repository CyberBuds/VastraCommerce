// app/loyalty-program/components/loyalty-program-settings.tsx
'use client';

import { useGetLoyaltyProgram, useUpdateLoyaltyProgram } from "@/features/marketing/hooks/useLoyaltyProgram";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { loyaltyProgramSchema } from "@/features/marketing/types/validation";
import { LoyaltyProgram } from "@/types/marketing";


export function LoyaltyProgramSettings() {
    const { data: program, isLoading, isError } = useGetLoyaltyProgram();
    const updateProgramMutation = useUpdateLoyaltyProgram();

    if (isLoading) return <div>Loading settings...</div>
    if (isError) return <div>Error loading settings.</div>

    const onSubmit = (data: LoyaltyProgram) => {
        updateProgramMutation.mutate(data);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Loyalty Program Settings</CardTitle>
            </CardHeader>
            <CardContent>
                {program && <SettingsForm program={program} onSubmit={onSubmit} isLoading={updateProgramMutation.isPending} />}
            </CardContent>
        </Card>
    );
}

function SettingsForm({ program, onSubmit, isLoading }: { program: LoyaltyProgram, onSubmit: (data: LoyaltyProgram) => void, isLoading: boolean }) {

    type SettingsFormValues = z.infer<typeof loyaltyProgramSchema>;

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(loyaltyProgramSchema),
        defaultValues: program
    });

    const handleSubmit = (data: SettingsFormValues) => {
        onSubmit({ ...program, ...data });
    }

    //
    // TODO: Add fields for pointRules and membershipLevels
    //

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Program Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="pointExpiryDays"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Point Expiry (days)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
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
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Settings'}</Button>
            </form>
        </Form>
    )
}
