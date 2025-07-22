// Invoice API service for FastAPI backend
import { api, type FastAPIPaginatedResponse } from '../lib/api';

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address: string;
  customer_gstin?: string;
  invoice_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  notes?: string;
  terms_and_conditions?: string;
  payment_method?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id?: string;
  product_id?: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  tax_rate: number;
  tax_amount: number;
  hsn_sac_code?: string;
}

export interface CreateInvoiceRequest {
  customer_id: string;
  invoice_date: string;
  due_date: string;
  items: Omit<InvoiceItem, 'id'>[];
  notes?: string;
  terms_and_conditions?: string;
  discount_amount?: number;
}

export interface UpdateInvoiceRequest extends Partial<CreateInvoiceRequest> {
  status?: Invoice['status'];
}

export interface InvoiceFilters {
  status?: string;
  customer_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  size?: number;
}

export interface InvoiceAnalytics {
  total_invoices: number;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  overdue_amount: number;
  monthly_revenue: Array<{ month: string; revenue: number }>;
}

export const invoiceApi = {
  // Get all invoices with filters and pagination
  getInvoices: async (filters?: InvoiceFilters): Promise<FastAPIPaginatedResponse<Invoice>> => {
    const params = {
      page: 1,
      size: 20,
      ...filters,
    };
    const response = await api.get<FastAPIPaginatedResponse<Invoice>>('/invoices/', { params });
    return response.data;
  },

  // Get single invoice by ID
  getInvoice: async (id: string): Promise<Invoice> => {
    const response = await api.get<Invoice>(`/invoices/${id}`);
    return response.data;
  },

  // Create new invoice
  createInvoice: async (invoiceData: CreateInvoiceRequest): Promise<Invoice> => {
    const response = await api.post<Invoice>('/invoices/', invoiceData);
    return response.data;
  },

  // Update invoice
  updateInvoice: async (id: string, invoiceData: UpdateInvoiceRequest): Promise<Invoice> => {
    const response = await api.put<Invoice>(`/invoices/${id}`, invoiceData);
    return response.data;
  },

  // Delete invoice
  deleteInvoice: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/invoices/${id}`);
    return response.data;
  },

  // Mark invoice as paid
  markAsPaid: async (id: string, paymentData: { 
    payment_method: string; 
    paid_at?: string; 
    notes?: string; 
  }): Promise<Invoice> => {
    const response = await api.post<Invoice>(`/invoices/${id}/mark-paid`, paymentData);
    return response.data;
  },

  // Send invoice to customer
  sendInvoice: async (id: string, emailData?: { 
    subject?: string; 
    message?: string; 
  }): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/invoices/${id}/send`, emailData);
    return response.data;
  },

  // Download invoice as PDF
  downloadPdf: async (id: string): Promise<void> => {
    const response = await api.get(`/invoices/${id}/pdf`, {
      responseType: 'blob',
    });
    
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Get invoice analytics
  getAnalytics: async (filters?: { 
    date_from?: string; 
    date_to?: string; 
  }): Promise<InvoiceAnalytics> => {
    const response = await api.get<InvoiceAnalytics>('/invoices/analytics', { params: filters });
    return response.data;
  },

  // Duplicate invoice
  duplicateInvoice: async (id: string): Promise<Invoice> => {
    const response = await api.post<Invoice>(`/invoices/${id}/duplicate`);
    return response.data;
  },

  // Get next invoice number
  getNextInvoiceNumber: async (): Promise<{ invoice_number: string }> => {
    const response = await api.get<{ invoice_number: string }>('/invoices/next-number');
    return response.data;
  },

  // Export invoices to CSV
  exportToCsv: async (filters?: InvoiceFilters): Promise<void> => {
    const response = await api.get('/invoices/export/csv', {
      params: filters,
      responseType: 'blob',
    });
    
    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoices-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Get invoice by number
  getInvoiceByNumber: async (invoiceNumber: string): Promise<Invoice> => {
    const response = await api.get<Invoice>(`/invoices/by-number/${invoiceNumber}`);
    return response.data;
  },

  // Update invoice status
  updateStatus: async (id: string, status: Invoice['status']): Promise<Invoice> => {
    const response = await api.patch<Invoice>(`/invoices/${id}/status`, { status });
    return response.data;
  },
};
