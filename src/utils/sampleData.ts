import type { Customer, Invoice, Payment } from '../types/billing';
import { v4 as uuidv4 } from 'uuid';
import { addDays, subDays } from 'date-fns';

export function generateSampleData() {
  // Sample customers
  const customers: Customer[] = [
    {
      id: uuidv4(),
      name: 'Tech Innovations Pvt Ltd',
      email: 'accounts@techinnovations.in',
      phone: '+91 9876543210',
      address: {
        street: '123 IT Park Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560001',
        country: 'India'
      },
      gstNumber: '29ABCDE1234F1Z5',
      stateCode: '29',
      panNumber: 'ABCDE1234F',
      createdAt: subDays(new Date(), 30),
      updatedAt: subDays(new Date(), 30),
    },
    {
      id: uuidv4(),
      name: 'Digital Solutions India Ltd',
      email: 'billing@digitalsolutions.in',
      phone: '+91 9123456789',
      address: {
        street: '456 Cyber City',
        city: 'Gurgaon',
        state: 'Haryana',
        zipCode: '122001',
        country: 'India'
      },
      gstNumber: '06FGHIJ5678K1Z2',
      stateCode: '06',
      panNumber: 'FGHIJ5678K',
      createdAt: subDays(new Date(), 25),
      updatedAt: subDays(new Date(), 25),
    },
    {
      id: uuidv4(),
      name: 'Mumbai Marketing Agency',
      email: 'accounts@mumbaimarketing.in',
      phone: '+91 8765432109',
      address: {
        street: '789 Business District',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India'
      },
      gstNumber: '27LMNOP9012Q1Z8',
      stateCode: '27',
      panNumber: 'LMNOP9012Q',
      createdAt: subDays(new Date(), 20),
      updatedAt: subDays(new Date(), 20),
    }
  ];

  // Sample invoices
  const invoices: Invoice[] = [
    {
      id: uuidv4(),
      invoiceNumber: 'INV-001',
      customerId: customers[0].id,
      customer: customers[0],
      items: [
        {
          id: uuidv4(),
          description: 'Website Development',
          quantity: 1,
          price: 50000,
          gstRate: 18,
          taxableValue: 50000,
          gstAmount: 9000,
          total: 59000,
          hsnCode: '9983'
        },
        {
          id: uuidv4(),
          description: 'SEO Optimization',
          quantity: 3,
          price: 15000,
          gstRate: 18,
          taxableValue: 45000,
          gstAmount: 8100,
          total: 53100,
          hsnCode: '9983'
        }
      ],
      subtotal: 95000,
      taxRate: 18,
      taxAmount: 17100,
      cgstAmount: 8550,
      sgstAmount: 8550,
      igstAmount: 0,
      totalGst: 17100,
      total: 112100,
      gstType: 'intrastate',
      status: 'paid',
      issueDate: subDays(new Date(), 15),
      dueDate: subDays(new Date(), 0),
      paidDate: subDays(new Date(), 5),
      notes: 'Thank you for your business!',
      placeOfSupply: 'Karnataka',
      createdAt: subDays(new Date(), 15),
      updatedAt: subDays(new Date(), 5),
    },
    {
      id: uuidv4(),
      invoiceNumber: 'INV-002',
      customerId: customers[1].id,
      customer: customers[1],
      items: [
        {
          id: uuidv4(),
          description: 'Mobile App Development',
          quantity: 1,
          price: 120000,
          gstRate: 18,
          taxableValue: 120000,
          gstAmount: 21600,
          total: 141600,
          hsnCode: '9983'
        }
      ],
      subtotal: 120000,
      taxRate: 18,
      taxAmount: 21600,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 21600,
      totalGst: 21600,
      total: 141600,
      gstType: 'interstate',
      status: 'sent',
      issueDate: subDays(new Date(), 10),
      dueDate: addDays(new Date(), 20),
      notes: 'Payment terms: Net 30',
      placeOfSupply: 'Haryana',
      createdAt: subDays(new Date(), 10),
      updatedAt: subDays(new Date(), 10),
    },
    {
      id: uuidv4(),
      invoiceNumber: 'INV-003',
      customerId: customers[2].id,
      customer: customers[2],
      items: [
        {
          id: uuidv4(),
          description: 'Marketing Campaign',
          quantity: 1,
          price: 75000,
          gstRate: 18,
          taxableValue: 75000,
          gstAmount: 13500,
          total: 88500,
          hsnCode: '997312'
        },
        {
          id: uuidv4(),
          description: 'Social Media Management',
          quantity: 3,
          price: 25000,
          gstRate: 18,
          taxableValue: 75000,
          gstAmount: 13500,
          total: 88500,
          hsnCode: '997312'
        }
      ],
      subtotal: 150000,
      taxRate: 18,
      taxAmount: 27000,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 27000,
      totalGst: 27000,
      total: 177000,
      gstType: 'interstate',
      status: 'overdue',
      issueDate: subDays(new Date(), 45),
      dueDate: subDays(new Date(), 15),
      notes: 'Overdue - please pay immediately',
      placeOfSupply: 'Maharashtra',
      createdAt: subDays(new Date(), 45),
      updatedAt: subDays(new Date(), 45),
    }
  ];

  // Sample payments
  const payments: Payment[] = [
    {
      id: uuidv4(),
      invoiceId: invoices[0].id,
      invoice: invoices[0],
      amount: 112100,
      paymentMethod: 'credit_card',
      transactionId: 'TXN-12345',
      paymentDate: subDays(new Date(), 5),
      status: 'completed',
      notes: 'Paid via Razorpay',
      createdAt: subDays(new Date(), 5),
      updatedAt: subDays(new Date(), 5),
    }
  ];

  return { customers, invoices, payments };
}
