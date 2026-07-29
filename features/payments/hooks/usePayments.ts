
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getTransactions,
    getTransactionById,
    getInvoices,
    getInvoiceById,
    getCreditNotes,
    getDebitNotes,
    getRefunds,
    getRefundById,
    getWalletTransactions,
} from '../services/paymentService';

export const useTransactions = () => {
    return useQuery({
        queryKey: ['transactions'],
        queryFn: getTransactions,
    });
};

export const useTransaction = (id: string) => {
    return useQuery({
        queryKey: ['transaction', id],
        queryFn: () => getTransactionById(id),
    });
};

export const useInvoices = () => {
    return useQuery({
        queryKey: ['invoices'],
        queryFn: getInvoices,
    });
};

export const useInvoice = (id: string) => {
    return useQuery({
        queryKey: ['invoice', id],
        queryFn: () => getInvoiceById(id),
    });
};

export const useCreditNotes = () => {
    return useQuery({
        queryKey: ['creditNotes'],
        queryFn: getCreditNotes,
    });
};

export const useDebitNotes = () => {
    return useQuery({
        queryKey: ['debitNotes'],
        queryFn: getDebitNotes,
    });
};

export const useRefunds = () => {
    return useQuery({
        queryKey: ['refunds'],
        queryFn: getRefunds,
    });
};

export const useRefund = (id: string) => {
    return useQuery({
        queryKey: ['refund', id],
        queryFn: () => getRefundById(id),
    });
};

export const useWalletTransactions = () => {
    return useQuery({
        queryKey: ['walletTransactions'],
        queryFn: getWalletTransactions,
    });
};
