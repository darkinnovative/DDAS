export interface EInvoice {
  id: string;
  irn: string; // Invoice Reference Number (64-character hash)
  ackNo: string; // Acknowledgment Number
  ackDate: Date;
  invoiceNumber: string;
  invoiceDate: Date;
  invoiceType: EInvoiceType;
  documentType: EInvoiceDocumentType;
  
  // Supplier Details (Seller)
  supplierGstin: string;
  supplierLegalName: string;
  supplierTradeName?: string;
  supplierAddress1: string;
  supplierAddress2?: string;
  supplierLocation: string;
  supplierPincode: string;
  supplierStateCode: string;
  supplierPhone?: string;
  supplierEmail?: string;
  
  // Buyer Details
  buyerGstin?: string; // Optional for B2C
  buyerLegalName: string;
  buyerTradeName?: string;
  buyerAddress1: string;
  buyerAddress2?: string;
  buyerLocation: string;
  buyerPincode: string;
  buyerStateCode: string;
  buyerPhone?: string;
  buyerEmail?: string;
  buyerType: BuyerType;
  
  // Dispatch Details (if different from supplier)
  dispatchGstin?: string;
  dispatchLegalName?: string;
  dispatchAddress1?: string;
  dispatchAddress2?: string;
  dispatchLocation?: string;
  dispatchPincode?: string;
  dispatchStateCode?: string;
  
  // Ship To Details (if different from buyer)
  shipToGstin?: string;
  shipToLegalName?: string;
  shipToAddress1?: string;
  shipToAddress2?: string;
  shipToLocation?: string;
  shipToPincode?: string;
  shipToStateCode?: string;
  
  // Line Items
  lineItems: EInvoiceLineItem[];
  
  // Value Details
  totalAssessableValue: number;
  totalCgstValue: number;
  totalSgstValue: number;
  totalIgstValue: number;
  totalCessValue: number;
  totalOtherCharges: number;
  totalInvoiceValue: number;
  roundOffAmount: number;
  totalInvoiceValueInWords: string;
  
  // Payment Details
  paymentTerms?: string;
  paymentInstruction?: string;
  paymentDueDate?: Date;
  advancePaid?: number;
  
  // Transport Details
  transporterId?: string;
  transporterName?: string;
  transportMode?: TransportMode;
  vehicleNumber?: string;
  vehicleType?: VehicleType;
  distance?: number;
  
  // Additional Details
  reverseCharge: boolean;
  placeOfSupply: string;
  ecommerceGstin?: string;
  
  // Status and Processing
  status: EInvoiceStatus;
  submissionDate?: Date;
  cancellationDate?: Date;
  cancellationReason?: string;
  errorDetails?: string;
  
  // QR Code
  qrCodeData: string;
  signedInvoice?: string;
  signedQRCode?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface EInvoiceLineItem {
  serialNumber: number;
  productDescription: string;
  isService: boolean;
  hsnCode: string;
  barcode?: string;
  quantity: number;
  freeQuantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  discount: number;
  preTaxValue: number;
  assessableValue: number;
  gstRate: number;
  igstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  cessRate: number;
  cessAmount: number;
  cessNonAdvol?: number;
  stateCessRate?: number;
  stateCessAmount?: number;
  stateCessNonAdvol?: number;
  otherCharges: number;
  totalItemValue: number;
  orderLineRef?: string;
  originCountry?: string;
  itemSerialNumber?: string;
  itemTotal: number;
}

export type EInvoiceType = 
  | 'Regular' 
  | 'SEZ supplies with payment' 
  | 'SEZ supplies without payment'
  | 'Deemed Export';

export type EInvoiceDocumentType = 
  | 'Tax Invoice'
  | 'Bill of Supply'
  | 'Bill of Entry'
  | 'Credit Note'
  | 'Debit Note';

export type BuyerType = 
  | 'Regular'
  | 'SEZ'
  | 'Export'
  | 'Deemed Export'
  | 'UIN Holders'
  | 'Consumer'
  | 'Overseas';

export type EInvoiceStatus = 
  | 'Draft'
  | 'Generated'
  | 'Submitted'
  | 'Acknowledged'
  | 'Failed'
  | 'Cancelled'
  | 'Error';

export type TransportMode = 
  | 'Road'
  | 'Rail'
  | 'Air'
  | 'Ship';

export type VehicleType = 
  | 'Regular'
  | 'Over Dimensional Cargo (ODC)';

// Indian State Codes for E-Invoice
export const E_INVOICE_STATE_CODES: Record<string, string> = {
  'Andaman and Nicobar Islands': '35',
  'Andhra Pradesh': '28',
  'Arunachal Pradesh': '12',
  'Assam': '18',
  'Bihar': '10',
  'Chandigarh': '04',
  'Chhattisgarh': '22',
  'Dadra and Nagar Haveli and Daman and Diu': '26',
  'Delhi': '07',
  'Goa': '30',
  'Gujarat': '24',
  'Haryana': '06',
  'Himachal Pradesh': '02',
  'Jammu and Kashmir': '01',
  'Jharkhand': '20',
  'Karnataka': '29',
  'Kerala': '32',
  'Ladakh': '38',
  'Lakshadweep': '31',
  'Madhya Pradesh': '23',
  'Maharashtra': '27',
  'Manipur': '14',
  'Meghalaya': '17',
  'Mizoram': '15',
  'Nagaland': '13',
  'Odisha': '21',
  'Puducherry': '34',
  'Punjab': '03',
  'Rajasthan': '08',
  'Sikkim': '11',
  'Tamil Nadu': '33',
  'Telangana': '36',
  'Tripura': '16',
  'Uttar Pradesh': '09',
  'Uttarakhand': '05',
  'West Bengal': '19'
};

// HSN Code patterns for validation
export const HSN_CODE_PATTERNS = {
  GOODS_2_DIGIT: /^\d{2}$/,
  GOODS_4_DIGIT: /^\d{4}$/,
  GOODS_6_DIGIT: /^\d{6}$/,
  GOODS_8_DIGIT: /^\d{8}$/,
  SERVICES_6_DIGIT: /^99\d{4}$/
};

// E-Invoice validation rules
export const E_INVOICE_VALIDATION = {
  IRN_LENGTH: 64,
  ACK_NO_LENGTH: 14,
  GSTIN_LENGTH: 15,
  PINCODE_LENGTH: 6,
  MAX_LINE_ITEMS: 1000,
  MAX_DESCRIPTION_LENGTH: 300,
  MAX_ADDRESS_LENGTH: 100,
  MAX_NAME_LENGTH: 100
};

// Error codes for E-Invoice processing
export const E_INVOICE_ERROR_CODES: Record<string, string> = {
  '1001': 'Invalid GSTIN format',
  '1002': 'GSTIN not found in GST system',
  '1003': 'Invalid HSN/SAC code',
  '1004': 'Duplicate IRN',
  '1005': 'Invalid invoice date',
  '1006': 'Invoice date cannot be future date',
  '1007': 'Invalid place of supply',
  '1008': 'Mandatory field missing',
  '1009': 'Invalid field value',
  '1010': 'Mathematical calculation error',
  '2001': 'IRN generation failed',
  '2002': 'Digital signature failed',
  '2003': 'QR code generation failed',
  '2004': 'System temporarily unavailable',
  '3001': 'Invoice already cancelled',
  '3002': 'Cancellation time limit exceeded',
  '3003': 'Invalid cancellation reason'
};
