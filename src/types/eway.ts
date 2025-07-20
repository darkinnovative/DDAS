export interface EwayBill {
  id: string;
  ewayBillNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerGstin: string;
  supplierGstin: string;
  documentType: 'Tax Invoice' | 'Credit Note' | 'Debit Note' | 'Bill of Supply';
  documentNumber: string;
  documentDate: Date;
  fromPincode: string;
  fromState: string;
  fromStateCode: string;
  toPincode: string;
  toState: string;
  toStateCode: string;
  productType: 'Goods' | 'Services';
  hsnCode: string;
  productName: string;
  productDesc: string;
  quantity: number;
  qtyUnit: string;
  taxableValue: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  cessRate: number;
  cessAmount: number;
  totalInvoiceValue: number;
  transactionType: 'Regular' | 'Bill To - Ship To' | 'Bill From - Dispatch From' | 'Combination of 2 & 3';
  subSupplyType: 'Supply' | 'Import' | 'Export' | 'Job Work' | 'For Own Use' | 'Job work Returns' | 'Sales Return' | 'Others';
  subSupplyDescription?: string;
  transporterId?: string;
  transporterName?: string;
  transportMode: 'Road' | 'Rail' | 'Air' | 'Ship';
  vehicleNumber?: string;
  vehicleType: 'Regular' | 'Over Dimensional Cargo';
  approxDistance: number;
  status: 'Generated' | 'Active' | 'Cancelled' | 'Expired';
  generatedDate: Date;
  validUpto: Date;
  cancelledDate?: Date;
  cancelledBy?: string;
  cancelReason?: string;
  partBUpdatedBy?: string;
  partBUpdatedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface EwayBillSummary {
  totalGenerated: number;
  totalActive: number;
  totalCancelled: number;
  totalExpired: number;
  totalValue: number;
  recentBills: EwayBill[];
}

export interface TransporterDetails {
  id: string;
  transporterId: string;
  name: string;
  address: string;
  gstin?: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleDetails {
  id: string;
  vehicleNumber: string;
  vehicleType: 'Regular' | 'Over Dimensional Cargo';
  transporterId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const HSN_CODES = [
  { code: '1001', description: 'Wheat and meslin' },
  { code: '8471', description: 'Automatic data processing machines' },
  { code: '8517', description: 'Telephone sets and other apparatus' },
  { code: '9983', description: 'Information technology software' },
  { code: '9954', description: 'Business support services' },
  { code: '997312', description: 'Advertising services' },
  { code: '998313', description: 'Management consulting services' },
];

export const SUPPLY_TYPES = [
  { value: 'Supply', label: 'Supply' },
  { value: 'Import', label: 'Import' },
  { value: 'Export', label: 'Export' },
  { value: 'Job Work', label: 'Job Work' },
  { value: 'For Own Use', label: 'For Own Use' },
  { value: 'Job work Returns', label: 'Job work Returns' },
  { value: 'Sales Return', label: 'Sales Return' },
  { value: 'Others', label: 'Others' },
];

export const DOCUMENT_TYPES = [
  { value: 'Tax Invoice', label: 'Tax Invoice' },
  { value: 'Credit Note', label: 'Credit Note' },
  { value: 'Debit Note', label: 'Debit Note' },
  { value: 'Bill of Supply', label: 'Bill of Supply' },
];

export const TRANSPORT_MODES = [
  { value: 'Road', label: 'Road' },
  { value: 'Rail', label: 'Rail' },
  { value: 'Air', label: 'Air' },
  { value: 'Ship', label: 'Ship' },
];

export const VEHICLE_TYPES = [
  { value: 'Regular', label: 'Regular' },
  { value: 'Over Dimensional Cargo', label: 'Over Dimensional Cargo' },
];
