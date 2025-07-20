import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { EInvoice, EInvoiceStatus, EInvoiceLineItem } from '../types/einvoice';
import type { Invoice } from '../types/billing';

interface EInvoiceContextType {
  eInvoices: EInvoice[];
  createEInvoice: (invoiceData: Partial<EInvoice>) => Promise<EInvoice>;
  updateEInvoice: (id: string, updates: Partial<EInvoice>) => void;
  deleteEInvoice: (id: string) => void;
  submitEInvoice: (id: string) => Promise<void>;
  cancelEInvoice: (id: string, reason: string) => Promise<void>;
  generateIRN: (eInvoice: EInvoice) => Promise<string>;
  convertInvoiceToEInvoice: (invoice: Invoice) => Partial<EInvoice>;
  validateEInvoice: (eInvoice: Partial<EInvoice>) => string[];
  getEInvoiceById: (id: string) => EInvoice | undefined;
  getEInvoicesByStatus: (status: EInvoiceStatus) => EInvoice[];
  searchEInvoices: (query: string) => EInvoice[];
}

const EInvoiceContext = createContext<EInvoiceContextType | undefined>(undefined);

export function useEInvoice() {
  const context = useContext(EInvoiceContext);
  if (!context) {
    throw new Error('useEInvoice must be used within an EInvoiceProvider');
  }
  return context;
}

interface EInvoiceProviderProps {
  children: ReactNode;
}

export function EInvoiceProvider({ children }: EInvoiceProviderProps) {
  const [eInvoices, setEInvoices] = useState<EInvoice[]>(generateSampleEInvoices());

  // Generate IRN (Invoice Reference Number) - 64 character hash
  const generateIRN = async (eInvoice: EInvoice): Promise<string> => {
    // In real implementation, this would call the GST portal API
    // For demo, we'll generate a mock IRN
    const data = `${eInvoice.supplierGstin}${eInvoice.invoiceNumber}${eInvoice.invoiceDate.getTime()}`;
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
    const hashArray = Array.from(new Uint8Array(hash));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 64);
  };

  // Generate QR Code data
  const generateQRCode = (eInvoice: EInvoice): string => {
    const qrData = {
      irn: eInvoice.irn,
      ackNo: eInvoice.ackNo,
      ackDt: eInvoice.ackDate.toISOString().split('T')[0],
      docNo: eInvoice.invoiceNumber,
      docDt: eInvoice.invoiceDate.toISOString().split('T')[0],
      docTyp: eInvoice.documentType,
      sellerGstin: eInvoice.supplierGstin,
      buyerGstin: eInvoice.buyerGstin || '',
      totInvVal: eInvoice.totalInvoiceValue.toFixed(2),
      mainHsnCode: eInvoice.lineItems[0]?.hsnCode || '',
      irdt: eInvoice.ackDate.toISOString()
    };
    return JSON.stringify(qrData);
  };

  // Convert regular invoice to e-invoice
  const convertInvoiceToEInvoice = (invoice: Invoice): Partial<EInvoice> => {
    const lineItems: EInvoiceLineItem[] = invoice.items.map((item, index) => ({
      serialNumber: index + 1,
      productDescription: item.description,
      isService: false,
      hsnCode: item.hsnCode || '1234',
      quantity: item.quantity,
      freeQuantity: 0,
      unit: 'NOS',
      unitPrice: item.price,
      totalAmount: item.total,
      discount: 0,
      preTaxValue: item.taxableValue,
      assessableValue: item.taxableValue,
      gstRate: item.gstRate,
      igstAmount: invoice.igstAmount > 0 ? item.gstAmount : 0,
      cgstAmount: invoice.cgstAmount > 0 ? (item.gstAmount / 2) : 0,
      sgstAmount: invoice.sgstAmount > 0 ? (item.gstAmount / 2) : 0,
      cessRate: 0,
      cessAmount: 0,
      stateCessRate: 0,
      stateCessAmount: 0,
      otherCharges: 0,
      totalItemValue: item.total,
      itemTotal: item.total
    }));

    const isInterstate = invoice.igstAmount > 0;

    return {
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.issueDate,
      invoiceType: 'Regular',
      documentType: 'Tax Invoice',
      
      supplierGstin: '29AABCU9603R1ZX', // Default company GSTIN
      supplierLegalName: 'Your Company Name',
      supplierAddress1: 'Company Address Line 1',
      supplierLocation: 'Bangalore',
      supplierPincode: '560001',
      supplierStateCode: '29',
      supplierEmail: 'company@email.com',
      supplierPhone: '9876543210',
      
      buyerGstin: invoice.customer?.gstNumber,
      buyerLegalName: invoice.customer?.name || 'Customer',
      buyerAddress1: invoice.customer?.address.street || 'Customer Address',
      buyerLocation: invoice.customer?.address.city || 'Delhi',
      buyerPincode: invoice.customer?.address.zipCode || '110001',
      buyerStateCode: invoice.customer?.stateCode || '07',
      buyerEmail: invoice.customer?.email,
      buyerPhone: invoice.customer?.phone,
      buyerType: invoice.customer?.gstNumber ? 'Regular' : 'Consumer',
      
      lineItems,
      
      totalAssessableValue: invoice.subtotal,
      totalCgstValue: invoice.cgstAmount,
      totalSgstValue: invoice.sgstAmount,
      totalIgstValue: invoice.igstAmount,
      totalCessValue: 0,
      totalOtherCharges: 0,
      totalInvoiceValue: invoice.total,
      roundOffAmount: 0,
      totalInvoiceValueInWords: numberToWords(invoice.total),
      
      reverseCharge: false,
      placeOfSupply: isInterstate ? (invoice.customer?.stateCode || '07') : '29',
      
      status: 'Draft',
      qrCodeData: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'System'
    };
  };

  // Convert number to words for Indian currency
  const numberToWords = (amount: number): string => {
    // Simplified implementation - in production, use a proper library
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    
    if (amount === 0) return 'Zero Rupees Only';
    
    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);
    
    let result = '';
    
    if (rupees > 0) {
      // Simplified conversion for demo
      if (rupees < 10) {
        result = ones[rupees];
      } else if (rupees < 100) {
        const ten = Math.floor(rupees / 10);
        const one = rupees % 10;
        if (rupees >= 10 && rupees < 20) {
          result = teens[rupees - 10];
        } else {
          result = tens[ten] + (one > 0 ? ' ' + ones[one] : '');
        }
      } else {
        result = 'Rupees ' + rupees.toString();
      }
      result += ' Rupees';
    }
    
    if (paise > 0) {
      result += (result ? ' and ' : '') + paise + ' Paise';
    }
    
    return (result || 'Zero') + ' Only';
  };

  // Create new E-Invoice
  const createEInvoice = async (invoiceData: Partial<EInvoice>): Promise<EInvoice> => {
    const id = `EINV-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    const eInvoice: EInvoice = {
      id,
      irn: '',
      ackNo: '',
      ackDate: new Date(),
      invoiceNumber: invoiceData.invoiceNumber || '',
      invoiceDate: invoiceData.invoiceDate || new Date(),
      invoiceType: invoiceData.invoiceType || 'Regular',
      documentType: invoiceData.documentType || 'Tax Invoice',
      
      supplierGstin: invoiceData.supplierGstin || '29AABCU9603R1ZX',
      supplierLegalName: invoiceData.supplierLegalName || 'ABC Company Ltd',
      supplierTradeName: invoiceData.supplierTradeName,
      supplierAddress1: invoiceData.supplierAddress1 || 'Block A, Industrial Area',
      supplierAddress2: invoiceData.supplierAddress2,
      supplierLocation: invoiceData.supplierLocation || 'Bangalore',
      supplierPincode: invoiceData.supplierPincode || '560001',
      supplierStateCode: invoiceData.supplierStateCode || '29',
      supplierPhone: invoiceData.supplierPhone,
      supplierEmail: invoiceData.supplierEmail,
      
      buyerGstin: invoiceData.buyerGstin,
      buyerLegalName: invoiceData.buyerLegalName || 'Customer Name',
      buyerTradeName: invoiceData.buyerTradeName,
      buyerAddress1: invoiceData.buyerAddress1 || 'Customer Address',
      buyerAddress2: invoiceData.buyerAddress2,
      buyerLocation: invoiceData.buyerLocation || 'Delhi',
      buyerPincode: invoiceData.buyerPincode || '110001',
      buyerStateCode: invoiceData.buyerStateCode || '07',
      buyerPhone: invoiceData.buyerPhone,
      buyerEmail: invoiceData.buyerEmail,
      buyerType: invoiceData.buyerType || 'Regular',
      
      dispatchGstin: invoiceData.dispatchGstin,
      dispatchLegalName: invoiceData.dispatchLegalName,
      dispatchAddress1: invoiceData.dispatchAddress1,
      dispatchAddress2: invoiceData.dispatchAddress2,
      dispatchLocation: invoiceData.dispatchLocation,
      dispatchPincode: invoiceData.dispatchPincode,
      dispatchStateCode: invoiceData.dispatchStateCode,
      
      shipToGstin: invoiceData.shipToGstin,
      shipToLegalName: invoiceData.shipToLegalName,
      shipToAddress1: invoiceData.shipToAddress1,
      shipToAddress2: invoiceData.shipToAddress2,
      shipToLocation: invoiceData.shipToLocation,
      shipToPincode: invoiceData.shipToPincode,
      shipToStateCode: invoiceData.shipToStateCode,
      
      lineItems: invoiceData.lineItems || [],
      
      totalAssessableValue: invoiceData.totalAssessableValue || 0,
      totalCgstValue: invoiceData.totalCgstValue || 0,
      totalSgstValue: invoiceData.totalSgstValue || 0,
      totalIgstValue: invoiceData.totalIgstValue || 0,
      totalCessValue: invoiceData.totalCessValue || 0,
      totalOtherCharges: invoiceData.totalOtherCharges || 0,
      totalInvoiceValue: invoiceData.totalInvoiceValue || 0,
      roundOffAmount: invoiceData.roundOffAmount || 0,
      totalInvoiceValueInWords: invoiceData.totalInvoiceValueInWords || '',
      
      paymentTerms: invoiceData.paymentTerms,
      paymentInstruction: invoiceData.paymentInstruction,
      paymentDueDate: invoiceData.paymentDueDate,
      advancePaid: invoiceData.advancePaid,
      
      transporterId: invoiceData.transporterId,
      transporterName: invoiceData.transporterName,
      transportMode: invoiceData.transportMode,
      vehicleNumber: invoiceData.vehicleNumber,
      vehicleType: invoiceData.vehicleType,
      distance: invoiceData.distance,
      
      reverseCharge: invoiceData.reverseCharge || false,
      placeOfSupply: invoiceData.placeOfSupply || '29',
      ecommerceGstin: invoiceData.ecommerceGstin,
      
      status: invoiceData.status || 'Draft',
      submissionDate: invoiceData.submissionDate,
      cancellationDate: invoiceData.cancellationDate,
      cancellationReason: invoiceData.cancellationReason,
      errorDetails: invoiceData.errorDetails,
      
      qrCodeData: invoiceData.qrCodeData || '',
      signedInvoice: invoiceData.signedInvoice,
      signedQRCode: invoiceData.signedQRCode,
      
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'Admin',
      ...invoiceData
    };

    setEInvoices(prev => [...prev, eInvoice]);
    return eInvoice;
  };

  // Update E-Invoice
  const updateEInvoice = (id: string, updates: Partial<EInvoice>) => {
    setEInvoices(prev => prev.map(eInvoice => 
      eInvoice.id === id 
        ? { ...eInvoice, ...updates, updatedAt: new Date() }
        : eInvoice
    ));
  };

  // Delete E-Invoice
  const deleteEInvoice = (id: string) => {
    setEInvoices(prev => prev.filter(eInvoice => eInvoice.id !== id));
  };

  // Submit E-Invoice to GST portal
  const submitEInvoice = async (id: string): Promise<void> => {
    const eInvoice = eInvoices.find(e => e.id === id);
    if (!eInvoice) throw new Error('E-Invoice not found');
    
    try {
      // In real implementation, this would call the GST portal API
      const irn = await generateIRN(eInvoice);
      const ackNo = `${Date.now()}${Math.random().toString().slice(2, 6)}`;
      const qrCodeData = generateQRCode({ ...eInvoice, irn, ackNo });
      
      updateEInvoice(id, {
        status: 'Acknowledged',
        irn,
        ackNo,
        ackDate: new Date(),
        qrCodeData,
        submissionDate: new Date()
      });
    } catch (error) {
      updateEInvoice(id, {
        status: 'Error',
        errorDetails: 'Failed to submit to GST portal'
      });
      throw error;
    }
  };

  // Cancel E-Invoice
  const cancelEInvoice = async (id: string, reason: string): Promise<void> => {
    const eInvoice = eInvoices.find(e => e.id === id);
    if (!eInvoice) throw new Error('E-Invoice not found');
    
    if (eInvoice.status === 'Cancelled') {
      throw new Error('E-Invoice is already cancelled');
    }
    
    // Check if cancellation is within 24 hours
    const hoursSinceAck = eInvoice.ackDate ? 
      (Date.now() - eInvoice.ackDate.getTime()) / (1000 * 60 * 60) : 0;
    
    if (hoursSinceAck > 24) {
      throw new Error('E-Invoice cannot be cancelled after 24 hours');
    }
    
    updateEInvoice(id, {
      status: 'Cancelled',
      cancellationDate: new Date(),
      cancellationReason: reason
    });
  };

  // Validate E-Invoice data
  const validateEInvoice = (eInvoice: Partial<EInvoice>): string[] => {
    const errors: string[] = [];
    
    if (!eInvoice.invoiceNumber) errors.push('Invoice number is required');
    if (!eInvoice.invoiceDate) errors.push('Invoice date is required');
    if (!eInvoice.supplierGstin) errors.push('Supplier GSTIN is required');
    if (!eInvoice.supplierLegalName) errors.push('Supplier name is required');
    if (!eInvoice.buyerLegalName) errors.push('Buyer name is required');
    if (!eInvoice.lineItems || eInvoice.lineItems.length === 0) {
      errors.push('At least one line item is required');
    }
    
    // Validate GSTIN format
    const gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (eInvoice.supplierGstin && !gstinPattern.test(eInvoice.supplierGstin)) {
      errors.push('Invalid supplier GSTIN format');
    }
    if (eInvoice.buyerGstin && !gstinPattern.test(eInvoice.buyerGstin)) {
      errors.push('Invalid buyer GSTIN format');
    }
    
    // Validate pincode format
    const pincodePattern = /^[0-9]{6}$/;
    if (eInvoice.supplierPincode && !pincodePattern.test(eInvoice.supplierPincode)) {
      errors.push('Invalid supplier pincode');
    }
    if (eInvoice.buyerPincode && !pincodePattern.test(eInvoice.buyerPincode)) {
      errors.push('Invalid buyer pincode');
    }
    
    return errors;
  };

  // Get E-Invoice by ID
  const getEInvoiceById = (id: string): EInvoice | undefined => {
    return eInvoices.find(eInvoice => eInvoice.id === id);
  };

  // Get E-Invoices by status
  const getEInvoicesByStatus = (status: EInvoiceStatus): EInvoice[] => {
    return eInvoices.filter(eInvoice => eInvoice.status === status);
  };

  // Search E-Invoices
  const searchEInvoices = (query: string): EInvoice[] => {
    const searchTerm = query.toLowerCase();
    return eInvoices.filter(eInvoice =>
      eInvoice.invoiceNumber.toLowerCase().includes(searchTerm) ||
      eInvoice.buyerLegalName.toLowerCase().includes(searchTerm) ||
      eInvoice.irn.toLowerCase().includes(searchTerm) ||
      eInvoice.ackNo.toLowerCase().includes(searchTerm)
    );
  };

  const contextValue: EInvoiceContextType = {
    eInvoices,
    createEInvoice,
    updateEInvoice,
    deleteEInvoice,
    submitEInvoice,
    cancelEInvoice,
    generateIRN,
    convertInvoiceToEInvoice,
    validateEInvoice,
    getEInvoiceById,
    getEInvoicesByStatus,
    searchEInvoices
  };

  return (
    <EInvoiceContext.Provider value={contextValue}>
      {children}
    </EInvoiceContext.Provider>
  );
}

// Generate sample E-Invoices for demo
function generateSampleEInvoices(): EInvoice[] {
  const sampleLineItems: EInvoiceLineItem[] = [
    {
      serialNumber: 1,
      productDescription: 'Office Stationery Items',
      isService: false,
      hsnCode: '48201020',
      quantity: 10,
      freeQuantity: 0,
      unit: 'NOS',
      unitPrice: 100,
      totalAmount: 1000,
      discount: 0,
      preTaxValue: 1000,
      assessableValue: 1000,
      gstRate: 18,
      igstAmount: 0,
      cgstAmount: 90,
      sgstAmount: 90,
      cessRate: 0,
      cessAmount: 0,
      stateCessRate: 0,
      stateCessAmount: 0,
      otherCharges: 0,
      totalItemValue: 1180,
      itemTotal: 1180
    }
  ];

  return [
    {
      id: 'EINV-001',
      irn: 'a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890123456',
      ackNo: '112023456789',
      ackDate: new Date('2025-07-15T10:30:00'),
      invoiceNumber: 'INV-2025-001',
      invoiceDate: new Date('2025-07-15'),
      invoiceType: 'Regular',
      documentType: 'Tax Invoice',
      
      supplierGstin: '29AABCU9603R1ZX',
      supplierLegalName: 'ABC Technologies Private Limited',
      supplierTradeName: 'ABC Tech',
      supplierAddress1: 'Block A, Tech Park, Electronic City',
      supplierLocation: 'Bangalore',
      supplierPincode: '560100',
      supplierStateCode: '29',
      supplierPhone: '9876543210',
      supplierEmail: 'accounts@abctech.com',
      
      buyerGstin: '07AADCR1234M1Z5',
      buyerLegalName: 'XYZ Enterprises Limited',
      buyerTradeName: 'XYZ Enterprises',
      buyerAddress1: 'Plot No 123, Industrial Area',
      buyerLocation: 'New Delhi',
      buyerPincode: '110020',
      buyerStateCode: '07',
      buyerPhone: '9123456789',
      buyerEmail: 'purchase@xyzent.com',
      buyerType: 'Regular',
      
      lineItems: sampleLineItems,
      
      totalAssessableValue: 1000,
      totalCgstValue: 90,
      totalSgstValue: 90,
      totalIgstValue: 0,
      totalCessValue: 0,
      totalOtherCharges: 0,
      totalInvoiceValue: 1180,
      roundOffAmount: 0,
      totalInvoiceValueInWords: 'One Thousand One Hundred Eighty Rupees Only',
      
      paymentTerms: 'Net 30 Days',
      paymentDueDate: new Date('2025-08-14'),
      
      reverseCharge: false,
      placeOfSupply: '07',
      
      status: 'Acknowledged',
      submissionDate: new Date('2025-07-15T10:30:00'),
      
      qrCodeData: '{"irn":"a1b2c3d4e5f6","ackNo":"112023456789","docNo":"INV-2025-001"}',
      
      createdAt: new Date('2025-07-15T09:00:00'),
      updatedAt: new Date('2025-07-15T10:30:00'),
      createdBy: 'Admin'
    },
    {
      id: 'EINV-002',
      irn: '',
      ackNo: '',
      ackDate: new Date(),
      invoiceNumber: 'INV-2025-002',
      invoiceDate: new Date('2025-07-20'),
      invoiceType: 'Regular',
      documentType: 'Tax Invoice',
      
      supplierGstin: '29AABCU9603R1ZX',
      supplierLegalName: 'ABC Technologies Private Limited',
      supplierAddress1: 'Block A, Tech Park, Electronic City',
      supplierLocation: 'Bangalore',
      supplierPincode: '560100',
      supplierStateCode: '29',
      supplierEmail: 'accounts@abctech.com',
      
      buyerGstin: '27AADCS1234N1Z6',
      buyerLegalName: 'PQR Industries Limited',
      buyerAddress1: 'Factory Road, MIDC Area',
      buyerLocation: 'Pune',
      buyerPincode: '411019',
      buyerStateCode: '27',
      buyerType: 'Regular',
      
      lineItems: [
        {
          ...sampleLineItems[0],
          productDescription: 'Computer Hardware Components',
          hsnCode: '84713000',
          unitPrice: 500,
          totalAmount: 5000,
          assessableValue: 5000,
          cgstAmount: 450,
          sgstAmount: 450,
          totalItemValue: 5900,
          itemTotal: 5900
        }
      ],
      
      totalAssessableValue: 5000,
      totalCgstValue: 450,
      totalSgstValue: 450,
      totalIgstValue: 0,
      totalCessValue: 0,
      totalOtherCharges: 0,
      totalInvoiceValue: 5900,
      roundOffAmount: 0,
      totalInvoiceValueInWords: 'Five Thousand Nine Hundred Rupees Only',
      
      reverseCharge: false,
      placeOfSupply: '27',
      
      status: 'Draft',
      
      qrCodeData: '',
      
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'Admin'
    }
  ];
}
