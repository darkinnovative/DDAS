import type { InvoiceItem } from '../types/billing';

// Standard GST rates in India
export const GST_RATES = [
  { label: '0% (Nil)', value: 0 },
  { label: '3%', value: 3 },
  { label: '5%', value: 5 },
  { label: '12%', value: 12 },
  { label: '18%', value: 18 },
  { label: '28%', value: 28 }
];

// Indian State Codes for GST
export const STATE_CODES = {
  'Andaman and Nicobar Islands': '35',
  'Andhra Pradesh': '28',
  'Arunachal Pradesh': '12',
  'Assam': '18',
  'Bihar': '10',
  'Chandigarh': '04',
  'Chhattisgarh': '22',
  'Dadra and Nagar Haveli': '26',
  'Daman and Diu': '25',
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

export interface GSTCalculation {
  taxableValue: number;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
  totalAmount: number;
}

export function calculateItemGST(
  quantity: number,
  price: number,
  gstRate: number,
  isInterstate: boolean = false
): GSTCalculation {
  const taxableValue = quantity * price;
  const totalGstAmount = (taxableValue * gstRate) / 100;
  
  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  
  if (isInterstate) {
    // Interstate supply - IGST only
    igst = totalGstAmount;
  } else {
    // Intrastate supply - CGST + SGST
    cgst = totalGstAmount / 2;
    sgst = totalGstAmount / 2;
  }
  
  return {
    taxableValue,
    gstRate,
    cgst,
    sgst,
    igst,
    totalGst: totalGstAmount,
    totalAmount: taxableValue + totalGstAmount
  };
}

export function calculateInvoiceGST(
  items: InvoiceItem[],
  companyStateCode: string,
  customerStateCode: string
): {
  subtotal: number;
  totalCGST: number;
  totalSGST: number;
  totalIGST: number;
  totalGST: number;
  grandTotal: number;
  isInterstate: boolean;
} {
  const isInterstate = companyStateCode !== customerStateCode;
  
  let subtotal = 0;
  let totalCGST = 0;
  let totalSGST = 0;
  let totalIGST = 0;
  
  items.forEach(item => {
    const gstCalc = calculateItemGST(
      item.quantity,
      item.price,
      item.gstRate,
      isInterstate
    );
    
    subtotal += gstCalc.taxableValue;
    totalCGST += gstCalc.cgst;
    totalSGST += gstCalc.sgst;
    totalIGST += gstCalc.igst;
  });
  
  const totalGST = totalCGST + totalSGST + totalIGST;
  const grandTotal = subtotal + totalGST;
  
  return {
    subtotal,
    totalCGST,
    totalSGST,
    totalIGST,
    totalGST,
    grandTotal,
    isInterstate
  };
}

export function formatGSTNumber(gstNumber: string): string {
  // Remove spaces and convert to uppercase
  const cleaned = gstNumber.replace(/\s/g, '').toUpperCase();
  
  // GST number format: 15 characters
  // Format: 22AAAAA0000A1Z5 (State Code + PAN + Entity Number + Z + Check Digit)
  if (cleaned.length === 15) {
    return `${cleaned.substring(0, 2)} ${cleaned.substring(2, 12)} ${cleaned.substring(12, 13)} ${cleaned.substring(13, 14)} ${cleaned.substring(14, 15)}`;
  }
  
  return cleaned;
}

export function validateGSTNumber(gstNumber: string): boolean {
  // Basic GST validation
  const cleaned = gstNumber.replace(/\s/g, '').toUpperCase();
  
  // Check length
  if (cleaned.length !== 15) return false;
  
  // Check format: First 2 digits are state code
  const stateCode = cleaned.substring(0, 2);
  const validStateCodes = Object.values(STATE_CODES);
  
  if (!validStateCodes.includes(stateCode)) return false;
  
  // Check if characters 3-12 are alphanumeric (PAN format)
  const panPart = cleaned.substring(2, 12);
  const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  
  if (!panPattern.test(panPart)) return false;
  
  // Check if 13th character is a digit (entity number)
  const entityNumber = cleaned.substring(12, 13);
  if (!/^[0-9]$/.test(entityNumber)) return false;
  
  // Check if 14th character is 'Z'
  const zChar = cleaned.substring(13, 14);
  if (zChar !== 'Z') return false;
  
  // Check if 15th character is alphanumeric (check digit)
  const checkDigit = cleaned.substring(14, 15);
  if (!/^[0-9A-Z]$/.test(checkDigit)) return false;
  
  return true;
}

export function getStateFromStateCode(stateCode: string): string {
  const state = Object.keys(STATE_CODES).find(
    key => STATE_CODES[key as keyof typeof STATE_CODES] === stateCode
  );
  return state || 'Unknown State';
}

export function getStateCodeFromState(stateName: string): string {
  return STATE_CODES[stateName as keyof typeof STATE_CODES] || '00';
}

// HSN (Harmonized System of Nomenclature) Code utilities
export const COMMON_HSN_CODES = [
  { code: '9983', description: 'IT Software Services' },
  { code: '9954', description: 'Business Support Services' },
  { code: '997312', description: 'Advertising Services' },
  { code: '998313', description: 'Consulting Services' },
  { code: '8443', description: 'Printing Machinery' },
  { code: '8471', description: 'Computer Hardware' },
  { code: '8517', description: 'Telecommunication Equipment' },
  { code: '9801', description: 'Maintenance & Repair Services' }
];

export function searchHSNCode(searchTerm: string): typeof COMMON_HSN_CODES {
  return COMMON_HSN_CODES.filter(
    hsn => 
      hsn.code.includes(searchTerm) || 
      hsn.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
}
