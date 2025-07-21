export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  gstNumber?: string;
  stateCode: string;
  panNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  contactPerson?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  gstNumber?: string;
  stateCode: string;
  panNumber?: string;
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    branchName: string;
    ifscCode: string;
  };
  category: 'goods' | 'services' | 'both';
  paymentTerms: 'immediate' | 'net15' | 'net30' | 'net45' | 'net60';
  creditLimit?: number;
  isActive: boolean;
  rating: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  totalPurchases: number;
  lastPurchaseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
  gstRate: number;
  gstAmount: number;
  hsnCode?: string;
  taxableValue: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customer?: Customer;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalGst: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  notes?: string;
  placeOfSupply?: string;
  gstType: 'intrastate' | 'interstate';
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoice?: Invoice;
  amount: number;
  paymentMethod: 'cash' | 'credit_card' | 'bank_transfer' | 'upi' | 'check' | 'other';
  transactionId?: string;
  reference?: string;
  paymentDate: Date;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalRevenue: number;
  totalInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  totalCustomers: number;
  recentInvoices: Invoice[];
  recentPayments: Payment[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'accountant' | 'user';
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  sku: string;
  category: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  minQuantity: number;
  maxQuantity?: number;
  supplier?: string;
  location?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LedgerAccount {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  subType?: string;
  parentId?: string;
  balance: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LedgerEntry {
  id: string;
  date: Date;
  description: string;
  reference?: string;
  accountId: string;
  account?: LedgerAccount;
  debit: number;
  credit: number;
  balance: number;
  transactionId: string;
  createdBy: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  date: Date;
  type: 'journal' | 'receipt' | 'payment' | 'contra' | 'sales' | 'purchase';
  description: string;
  reference?: string;
  totalAmount: number;
  entries: LedgerEntry[];
  createdBy: string;
  approvedBy?: string;
  status: 'draft' | 'posted' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  email: string;
  website?: string;
  taxId: string;
  gstNumber: string;
  panNumber: string;
  stateCode: string;
  registrationNumber?: string;
  logo?: string;
  financialYear: {
    startDate: Date;
    endDate: Date;
  };
  currency: string;
  taxRate: number;
  createdAt: Date;
  updatedAt: Date;
}
