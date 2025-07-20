import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Invoice, Customer, Payment, DashboardStats, Vendor } from '../types/billing';
import { v4 as uuidv4 } from 'uuid';
import { generateSampleData } from '../utils/sampleData';

interface BillingState {
  invoices: Invoice[];
  customers: Customer[];
  vendors: Vendor[];
  payments: Payment[];
  loading: boolean;
  error: string | null;
}

type BillingAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_SAMPLE_DATA'; payload: { customers: Customer[]; vendors: Vendor[]; invoices: Invoice[]; payments: Payment[] } }
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_INVOICE'; payload: Invoice }
  | { type: 'DELETE_INVOICE'; payload: string }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'DELETE_CUSTOMER'; payload: string }
  | { type: 'ADD_VENDOR'; payload: Vendor }
  | { type: 'UPDATE_VENDOR'; payload: Vendor }
  | { type: 'DELETE_VENDOR'; payload: string }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'UPDATE_PAYMENT'; payload: Payment }
  | { type: 'DELETE_PAYMENT'; payload: string };

const initialState: BillingState = {
  invoices: [],
  customers: [],
  vendors: [],
  payments: [],
  loading: false,
  error: null,
};

function billingReducer(state: BillingState, action: BillingAction): BillingState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'LOAD_SAMPLE_DATA':
      return {
        ...state,
        customers: action.payload.customers,
        vendors: action.payload.vendors,
        invoices: action.payload.invoices,
        payments: action.payload.payments,
      };
    case 'ADD_INVOICE':
      return { ...state, invoices: [...state.invoices, action.payload] };
    case 'UPDATE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.map(invoice =>
          invoice.id === action.payload.id ? action.payload : invoice
        ),
      };
    case 'DELETE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.filter(invoice => invoice.id !== action.payload),
      };
    case 'ADD_CUSTOMER':
      return { ...state, customers: [...state.customers, action.payload] };
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer.id === action.payload.id ? action.payload : customer
        ),
      };
    case 'DELETE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.filter(customer => customer.id !== action.payload),
      };
    case 'ADD_VENDOR':
      return { ...state, vendors: [...state.vendors, action.payload] };
    case 'UPDATE_VENDOR':
      return {
        ...state,
        vendors: state.vendors.map(vendor =>
          vendor.id === action.payload.id ? action.payload : vendor
        ),
      };
    case 'DELETE_VENDOR':
      return {
        ...state,
        vendors: state.vendors.filter(vendor => vendor.id !== action.payload),
      };
    case 'ADD_PAYMENT':
      return { ...state, payments: [...state.payments, action.payload] };
    case 'UPDATE_PAYMENT':
      return {
        ...state,
        payments: state.payments.map(payment =>
          payment.id === action.payload.id ? action.payload : payment
        ),
      };
    case 'DELETE_PAYMENT':
      return {
        ...state,
        payments: state.payments.filter(payment => payment.id !== action.payload),
      };
    default:
      return state;
  }
}

interface BillingContextType extends BillingState {
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  addVendor: (vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateVendor: (vendor: Vendor) => void;
  deleteVendor: (id: string) => void;
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePayment: (payment: Payment) => void;
  deletePayment: (id: string) => void;
  getDashboardStats: () => DashboardStats;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export function BillingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(billingReducer, initialState);

  // Load sample data on mount
  useEffect(() => {
    const sampleData = generateSampleData();
    dispatch({ type: 'LOAD_SAMPLE_DATA', payload: {
      customers: sampleData.customers,
      vendors: sampleData.vendors,
      invoices: sampleData.invoices,
      payments: sampleData.payments
    }});
  }, []);

  const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_INVOICE', payload: newInvoice });
  };

  const updateInvoice = (invoice: Invoice) => {
    const updatedInvoice = { ...invoice, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_INVOICE', payload: updatedInvoice });
  };

  const deleteInvoice = (id: string) => {
    dispatch({ type: 'DELETE_INVOICE', payload: id });
  };

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_CUSTOMER', payload: newCustomer });
  };

  const updateCustomer = (customer: Customer) => {
    const updatedCustomer = { ...customer, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_CUSTOMER', payload: updatedCustomer });
  };

  const deleteCustomer = (id: string) => {
    dispatch({ type: 'DELETE_CUSTOMER', payload: id });
  };

  const addVendor = (vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newVendor: Vendor = {
      ...vendor,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_VENDOR', payload: newVendor });
  };

  const updateVendor = (vendor: Vendor) => {
    const updatedVendor = { ...vendor, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_VENDOR', payload: updatedVendor });
  };

  const deleteVendor = (id: string) => {
    dispatch({ type: 'DELETE_VENDOR', payload: id });
  };

  const addPayment = (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPayment: Payment = {
      ...payment,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_PAYMENT', payload: newPayment });
  };

  const updatePayment = (payment: Payment) => {
    const updatedPayment = { ...payment, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_PAYMENT', payload: updatedPayment });
  };

  const deletePayment = (id: string) => {
    dispatch({ type: 'DELETE_PAYMENT', payload: id });
  };

  const getDashboardStats = (): DashboardStats => {
    const totalRevenue = state.invoices
      .filter(invoice => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + invoice.total, 0);

    const totalInvoices = state.invoices.length;
    const paidInvoices = state.invoices.filter(invoice => invoice.status === 'paid').length;
    const overdueInvoices = state.invoices.filter(
      invoice => invoice.status === 'overdue' || 
      (invoice.status === 'sent' && new Date() > invoice.dueDate)
    ).length;

    const totalCustomers = state.customers.length;

    const recentInvoices = state.invoices
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    const recentPayments = state.payments
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    return {
      totalRevenue,
      totalInvoices,
      paidInvoices,
      overdueInvoices,
      totalCustomers,
      recentInvoices,
      recentPayments,
    };
  };

  return (
    <BillingContext.Provider
      value={{
        ...state,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addVendor,
        updateVendor,
        deleteVendor,
        addPayment,
        updatePayment,
        deletePayment,
        getDashboardStats,
      }}
    >
      {children}
    </BillingContext.Provider>
  );
}

export function useBilling() {
  const context = useContext(BillingContext);
  if (context === undefined) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
}
