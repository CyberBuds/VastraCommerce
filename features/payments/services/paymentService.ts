
import { api } from '@/services/api';
import { Transaction, Invoice, CreditNote, DebitNote, Refund, WalletTransaction } from '../types';

export const getTransactions = async (): Promise<Transaction[]> => {
    const response = await api.get('/payments/transactions');
    return response.data;
};

export const getTransactionById = async (id: string): Promise<Transaction> => {
    const response = await api.get(`/payments/transactions/${id}`);
    return response.data;
};

export const getInvoices = async (): Promise<Invoice[]> => {
    const response = await api.get('/payments/invoices');
    return response.data;
};

export const getInvoiceById = async (id: string): Promise<Invoice> => {
    const response = await api.get(`/payments/invoices/${id}`);
    return response.data;
};

export const getCreditNotes = async (): Promise<CreditNote[]> => {
    const response = await api.get('/payments/credit-notes');
    return response.data;
};

export const getDebitNotes = async (): Promise<DebitNote[]> => {
    const response = await api.get('/payments/debit-notes');
    return response.data;
};

export const getRefunds = async (): Promise<Refund[]> => {
    const response = await api.get('/payments/refunds');
    return response.data;
};

export const getRefundById = async (id: string): Promise<Refund> => {
    const response = await api.get(`/payments/refunds/${id}`);
    return response.data;
};

export const getWalletTransactions = async (): Promise<WalletTransaction[]> => {
    const response = await api.get('/payments/wallet/transactions');
    return response.data;
};
