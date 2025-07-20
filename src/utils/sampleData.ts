import type { Customer, Invoice, Payment, Vendor } from '../types/billing';
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

  // Sample vendors
  const vendors: Vendor[] = [
    {
      id: uuidv4(),
      name: 'Office Supplies Co.',
      email: 'sales@officesupplies.in',
      phone: '+91 9876543210',
      contactPerson: 'Rajesh Kumar',
      address: {
        street: '123 Industrial Area',
        city: 'Delhi',
        state: 'Delhi',
        zipCode: '110001',
        country: 'India'
      },
      gstNumber: '07ABCDE1234F1Z5',
      stateCode: '07',
      panNumber: 'ABCDE1234F',
      bankDetails: {
        accountNumber: '1234567890',
        bankName: 'State Bank of India',
        branchName: 'Connaught Place',
        ifscCode: 'SBIN0000123'
      },
      category: 'goods',
      paymentTerms: 'net30',
      creditLimit: 500000,
      isActive: true,
      rating: 4,
      notes: 'Reliable supplier for office equipment',
      totalPurchases: 250000,
      lastPurchaseDate: subDays(new Date(), 15),
      createdAt: subDays(new Date(), 90),
      updatedAt: subDays(new Date(), 15),
    },
    {
      id: uuidv4(),
      name: 'IT Services Mumbai',
      email: 'billing@itservices.in',
      phone: '+91 9123456789',
      contactPerson: 'Priya Sharma',
      address: {
        street: '456 Tech Hub',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India'
      },
      gstNumber: '27FGHIJ5678K1Z2',
      stateCode: '27',
      panNumber: 'FGHIJ5678K',
      bankDetails: {
        accountNumber: '9876543210',
        bankName: 'HDFC Bank',
        branchName: 'Bandra Kurla Complex',
        ifscCode: 'HDFC0000456'
      },
      category: 'services',
      paymentTerms: 'net15',
      creditLimit: 300000,
      isActive: true,
      rating: 5,
      notes: 'Excellent service provider for IT solutions',
      totalPurchases: 180000,
      lastPurchaseDate: subDays(new Date(), 7),
      createdAt: subDays(new Date(), 60),
      updatedAt: subDays(new Date(), 7),
    },
    {
      id: uuidv4(),
      name: 'Raw Materials Pvt Ltd',
      email: 'accounts@rawmaterials.in',
      phone: '+91 8765432109',
      contactPerson: 'Amit Patel',
      address: {
        street: '789 Industrial Zone',
        city: 'Ahmedabad',
        state: 'Gujarat',
        zipCode: '380001',
        country: 'India'
      },
      gstNumber: '24KLMNO9012P1Z3',
      stateCode: '24',
      panNumber: 'KLMNO9012P',
      bankDetails: {
        accountNumber: '5432109876',
        bankName: 'ICICI Bank',
        branchName: 'CG Road',
        ifscCode: 'ICIC0000789'
      },
      category: 'goods',
      paymentTerms: 'net45',
      creditLimit: 750000,
      isActive: true,
      rating: 3,
      notes: 'Good quality materials, sometimes delayed delivery',
      totalPurchases: 420000,
      lastPurchaseDate: subDays(new Date(), 22),
      createdAt: subDays(new Date(), 120),
      updatedAt: subDays(new Date(), 22),
    },
    {
      id: uuidv4(),
      name: 'Logistics Express',
      email: 'operations@logisticsexpress.in',
      phone: '+91 7654321098',
      contactPerson: 'Sunita Reddy',
      address: {
        street: '321 Transport Nagar',
        city: 'Hyderabad',
        state: 'Telangana',
        zipCode: '500001',
        country: 'India'
      },
      gstNumber: '36QRSTU3456V1Z4',
      stateCode: '36',
      panNumber: 'QRSTU3456V',
      bankDetails: {
        accountNumber: '6789012345',
        bankName: 'Axis Bank',
        branchName: 'Secunderabad',
        ifscCode: 'UTIB0000321'
      },
      category: 'services',
      paymentTerms: 'immediate',
      creditLimit: 200000,
      isActive: true,
      rating: 4,
      notes: 'Fast and reliable logistics partner',
      totalPurchases: 95000,
      lastPurchaseDate: subDays(new Date(), 3),
      createdAt: subDays(new Date(), 45),
      updatedAt: subDays(new Date(), 3),
    },
    {
      id: uuidv4(),
      name: 'Tech Equipment Suppliers',
      email: 'sales@techequipment.in',
      phone: '+91 6543210987',
      contactPerson: 'Vikash Singh',
      address: {
        street: '654 Electronic Market',
        city: 'Pune',
        state: 'Maharashtra',
        zipCode: '411001',
        country: 'India'
      },
      gstNumber: '27WXYZ7890A1Z5',
      stateCode: '27',
      panNumber: 'WXYZ7890A',
      category: 'both',
      paymentTerms: 'net60',
      creditLimit: 400000,
      isActive: false,
      rating: 2,
      notes: 'Currently on hold due to quality issues',
      totalPurchases: 75000,
      lastPurchaseDate: subDays(new Date(), 60),
      createdAt: subDays(new Date(), 180),
      updatedAt: subDays(new Date(), 60),
    }
  ];

  return { customers, vendors, invoices, payments };
}
