import type { Invoice, Customer, Vendor, Payment } from '../types/billing';

// Local Storage Keys
const STORAGE_KEYS = {
  INVOICES: 'ddas_invoices',
  CUSTOMERS: 'ddas_customers',
  VENDORS: 'ddas_vendors',
  PAYMENTS: 'ddas_payments',
  SETTINGS: 'ddas_settings',
} as const;

// Generic Storage Service
class StorageService {
  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}

// Invoice Service
export class InvoiceService {
  static getAll(): Invoice[] {
    return StorageService.get(STORAGE_KEYS.INVOICES, []);
  }

  static save(invoices: Invoice[]): void {
    StorageService.set(STORAGE_KEYS.INVOICES, invoices);
  }

  static create(invoice: Omit<Invoice, 'id'>): Invoice {
    const invoices = this.getAll();
    const newInvoice: Invoice = {
      ...invoice,
      id: crypto.randomUUID(),
    };
    invoices.push(newInvoice);
    this.save(invoices);
    return newInvoice;
  }

  static update(id: string, updatedInvoice: Partial<Invoice>): Invoice | null {
    const invoices = this.getAll();
    const index = invoices.findIndex(inv => inv.id === id);
    if (index === -1) return null;

    invoices[index] = { ...invoices[index], ...updatedInvoice };
    this.save(invoices);
    return invoices[index];
  }

  static delete(id: string): boolean {
    const invoices = this.getAll();
    const filteredInvoices = invoices.filter(inv => inv.id !== id);
    if (filteredInvoices.length === invoices.length) return false;

    this.save(filteredInvoices);
    return true;
  }

  static getById(id: string): Invoice | null {
    const invoices = this.getAll();
    return invoices.find(inv => inv.id === id) || null;
  }
}

// Customer Service
export class CustomerService {
  static getAll(): Customer[] {
    return StorageService.get(STORAGE_KEYS.CUSTOMERS, []);
  }

  static save(customers: Customer[]): void {
    StorageService.set(STORAGE_KEYS.CUSTOMERS, customers);
  }

  static create(customer: Omit<Customer, 'id'>): Customer {
    const customers = this.getAll();
    const newCustomer: Customer = {
      ...customer,
      id: crypto.randomUUID(),
    };
    customers.push(newCustomer);
    this.save(customers);
    return newCustomer;
  }

  static update(id: string, updatedCustomer: Partial<Customer>): Customer | null {
    const customers = this.getAll();
    const index = customers.findIndex(cust => cust.id === id);
    if (index === -1) return null;

    customers[index] = { ...customers[index], ...updatedCustomer };
    this.save(customers);
    return customers[index];
  }

  static delete(id: string): boolean {
    const customers = this.getAll();
    const filteredCustomers = customers.filter(cust => cust.id !== id);
    if (filteredCustomers.length === customers.length) return false;

    this.save(filteredCustomers);
    return true;
  }
}

// Vendor Service
export class VendorService {
  static getAll(): Vendor[] {
    return StorageService.get(STORAGE_KEYS.VENDORS, []);
  }

  static save(vendors: Vendor[]): void {
    StorageService.set(STORAGE_KEYS.VENDORS, vendors);
  }

  static create(vendor: Omit<Vendor, 'id'>): Vendor {
    const vendors = this.getAll();
    const newVendor: Vendor = {
      ...vendor,
      id: crypto.randomUUID(),
    };
    vendors.push(newVendor);
    this.save(vendors);
    return newVendor;
  }

  static update(id: string, updatedVendor: Partial<Vendor>): Vendor | null {
    const vendors = this.getAll();
    const index = vendors.findIndex(vendor => vendor.id === id);
    if (index === -1) return null;

    vendors[index] = { ...vendors[index], ...updatedVendor };
    this.save(vendors);
    return vendors[index];
  }

  static delete(id: string): boolean {
    const vendors = this.getAll();
    const filteredVendors = vendors.filter(vendor => vendor.id !== id);
    if (filteredVendors.length === vendors.length) return false;

    this.save(filteredVendors);
    return true;
  }
}

// Payment Service
export class PaymentService {
  static getAll(): Payment[] {
    return StorageService.get(STORAGE_KEYS.PAYMENTS, []);
  }

  static save(payments: Payment[]): void {
    StorageService.set(STORAGE_KEYS.PAYMENTS, payments);
  }

  static create(payment: Omit<Payment, 'id'>): Payment {
    const payments = this.getAll();
    const newPayment: Payment = {
      ...payment,
      id: crypto.randomUUID(),
    };
    payments.push(newPayment);
    this.save(payments);
    return newPayment;
  }

  static update(id: string, updatedPayment: Partial<Payment>): Payment | null {
    const payments = this.getAll();
    const index = payments.findIndex(payment => payment.id === id);
    if (index === -1) return null;

    payments[index] = { ...payments[index], ...updatedPayment };
    this.save(payments);
    return payments[index];
  }

  static delete(id: string): boolean {
    const payments = this.getAll();
    const filteredPayments = payments.filter(payment => payment.id !== id);
    if (filteredPayments.length === payments.length) return false;

    this.save(filteredPayments);
    return true;
  }
}

export default StorageService;
