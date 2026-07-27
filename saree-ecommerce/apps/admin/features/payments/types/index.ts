
export interface Transaction {
    id: string;
    orderNumber: string;
    customer: string;
    gateway: string;
    paymentMethod: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    currency: string;
    transactionDate: string;
}

export interface Invoice {
    id: string;
    orderNumber: string;
    customer: string;
    amount: number;
    status: 'paid' | 'unpaid' | 'overdue';
    invoiceDate: string;
    dueDate: string;
}

export interface CreditNote {
    id: string;
    invoiceNumber: string;
    customer: string;
    amount: number;
    status: 'open' | 'applied' | 'void';
    creditNoteDate: string;
}

export interface DebitNote {
    id: string;
    invoiceNumber: string;
    customer: string;
    amount: number;
    status: 'open' | 'applied' | 'void';
    debitNoteDate: string;
}

export interface Refund {
    id: string;
    transactionId: string;
    customer: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected' | 'processed';
    refundDate: string;
}

export interface WalletTransaction {
    id: string;
    type: 'credit' | 'debit' | 'refund' | 'adjustment';
    amount: number;
    balance: number;
    transactionDate: string;
}
