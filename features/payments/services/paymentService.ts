
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
    const response = await api.get('/invoices', {
        params: { pageSize: 100, sortBy: 'invoiceDate', sortOrder: 'desc' }
    });
    const invoices = response.data?.data?.items ?? response.data?.data ?? [];
    return invoices.map((invoice: any): Invoice => ({
        id: String(invoice.id),
        orderNumber: invoice.order?.orderNumber || '',
        customer: [invoice.order?.customer?.firstName, invoice.order?.customer?.lastName].filter(Boolean).join(' ') || 'Customer',
        amount: Number(invoice.netAmount || 0),
        status: invoice.invoiceStatus === 'PAID' ? 'paid' : invoice.invoiceStatus === 'CANCELLED' ? 'void' : 'unpaid',
        invoiceDate: invoice.invoiceDate || invoice.createdAt,
        dueDate: invoice.dueDate || invoice.invoiceDate || invoice.createdAt
    }));
};

export const getInvoiceById = async (id: string): Promise<Invoice> => {
    const response = await api.get(`/invoices/${id}`);
    const invoice = response.data?.data;
    return {
        id: String(invoice.id),
        orderNumber: invoice.order?.orderNumber || '',
        customer: [invoice.order?.customer?.firstName, invoice.order?.customer?.lastName].filter(Boolean).join(' ') || 'Customer',
        amount: Number(invoice.netAmount || 0),
        status: invoice.invoiceStatus === 'PAID' ? 'paid' : invoice.invoiceStatus === 'CANCELLED' ? 'void' : 'unpaid',
        invoiceDate: invoice.invoiceDate || invoice.createdAt,
        dueDate: invoice.dueDate || invoice.invoiceDate || invoice.createdAt
    };
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
