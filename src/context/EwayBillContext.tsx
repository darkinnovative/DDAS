import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { EwayBill, EwayBillSummary, TransporterDetails, VehicleDetails } from '../types/eway';
import { v4 as uuidv4 } from 'uuid';
import { addDays } from 'date-fns';

interface EwayBillState {
  ewayBills: EwayBill[];
  transporters: TransporterDetails[];
  vehicles: VehicleDetails[];
  loading: boolean;
  error: string | null;
}

type EwayBillAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_SAMPLE_DATA'; payload: { ewayBills: EwayBill[]; transporters: TransporterDetails[]; vehicles: VehicleDetails[] } }
  | { type: 'ADD_EWAY_BILL'; payload: EwayBill }
  | { type: 'UPDATE_EWAY_BILL'; payload: EwayBill }
  | { type: 'CANCEL_EWAY_BILL'; payload: { id: string; reason: string; cancelledBy: string } }
  | { type: 'ADD_TRANSPORTER'; payload: TransporterDetails }
  | { type: 'UPDATE_TRANSPORTER'; payload: TransporterDetails }
  | { type: 'ADD_VEHICLE'; payload: VehicleDetails }
  | { type: 'UPDATE_VEHICLE'; payload: VehicleDetails };

const initialState: EwayBillState = {
  ewayBills: [],
  transporters: [],
  vehicles: [],
  loading: false,
  error: null,
};

function ewayBillReducer(state: EwayBillState, action: EwayBillAction): EwayBillState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'LOAD_SAMPLE_DATA':
      return {
        ...state,
        ewayBills: action.payload.ewayBills,
        transporters: action.payload.transporters,
        vehicles: action.payload.vehicles,
      };
    case 'ADD_EWAY_BILL':
      return { ...state, ewayBills: [...state.ewayBills, action.payload] };
    case 'UPDATE_EWAY_BILL':
      return {
        ...state,
        ewayBills: state.ewayBills.map(bill =>
          bill.id === action.payload.id ? action.payload : bill
        ),
      };
    case 'CANCEL_EWAY_BILL':
      return {
        ...state,
        ewayBills: state.ewayBills.map(bill =>
          bill.id === action.payload.id
            ? {
                ...bill,
                status: 'Cancelled',
                cancelledDate: new Date(),
                cancelReason: action.payload.reason,
                cancelledBy: action.payload.cancelledBy,
                updatedAt: new Date(),
              }
            : bill
        ),
      };
    case 'ADD_TRANSPORTER':
      return { ...state, transporters: [...state.transporters, action.payload] };
    case 'UPDATE_TRANSPORTER':
      return {
        ...state,
        transporters: state.transporters.map(transporter =>
          transporter.id === action.payload.id ? action.payload : transporter
        ),
      };
    case 'ADD_VEHICLE':
      return { ...state, vehicles: [...state.vehicles, action.payload] };
    case 'UPDATE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.map(vehicle =>
          vehicle.id === action.payload.id ? action.payload : vehicle
        ),
      };
    default:
      return state;
  }
}

interface EwayBillContextType extends EwayBillState {
  addEwayBill: (bill: Omit<EwayBill, 'id' | 'ewayBillNumber' | 'status' | 'generatedDate' | 'validUpto' | 'createdAt' | 'updatedAt'>) => void;
  updateEwayBill: (bill: EwayBill) => void;
  cancelEwayBill: (id: string, reason: string, cancelledBy: string) => void;
  addTransporter: (transporter: Omit<TransporterDetails, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransporter: (transporter: TransporterDetails) => void;
  addVehicle: (vehicle: Omit<VehicleDetails, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateVehicle: (vehicle: VehicleDetails) => void;
  getEwayBillSummary: () => EwayBillSummary;
  generateEwayBillNumber: () => string;
}

const EwayBillContext = createContext<EwayBillContextType | undefined>(undefined);

export function EwayBillProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ewayBillReducer, initialState);

  // Load sample data on mount
  useEffect(() => {
    const sampleData = generateSampleEwayData();
    dispatch({ type: 'LOAD_SAMPLE_DATA', payload: sampleData });
  }, []);

  const generateEwayBillNumber = (): string => {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${timestamp}${random}`;
  };

  const addEwayBill = (bill: Omit<EwayBill, 'id' | 'ewayBillNumber' | 'status' | 'generatedDate' | 'validUpto' | 'createdAt' | 'updatedAt'>) => {
    const newBill: EwayBill = {
      ...bill,
      id: uuidv4(),
      ewayBillNumber: generateEwayBillNumber(),
      status: 'Generated',
      generatedDate: new Date(),
      validUpto: addDays(new Date(), bill.approxDistance > 200 ? 3 : 1), // Validity based on distance
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_EWAY_BILL', payload: newBill });
  };

  const updateEwayBill = (bill: EwayBill) => {
    const updatedBill = { ...bill, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_EWAY_BILL', payload: updatedBill });
  };

  const cancelEwayBill = (id: string, reason: string, cancelledBy: string) => {
    dispatch({ type: 'CANCEL_EWAY_BILL', payload: { id, reason, cancelledBy } });
  };

  const addTransporter = (transporter: Omit<TransporterDetails, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransporter: TransporterDetails = {
      ...transporter,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_TRANSPORTER', payload: newTransporter });
  };

  const updateTransporter = (transporter: TransporterDetails) => {
    const updatedTransporter = { ...transporter, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_TRANSPORTER', payload: updatedTransporter });
  };

  const addVehicle = (vehicle: Omit<VehicleDetails, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newVehicle: VehicleDetails = {
      ...vehicle,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_VEHICLE', payload: newVehicle });
  };

  const updateVehicle = (vehicle: VehicleDetails) => {
    const updatedVehicle = { ...vehicle, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_VEHICLE', payload: updatedVehicle });
  };

  const getEwayBillSummary = (): EwayBillSummary => {
    const totalGenerated = state.ewayBills.length;
    const totalActive = state.ewayBills.filter(bill => bill.status === 'Active').length;
    const totalCancelled = state.ewayBills.filter(bill => bill.status === 'Cancelled').length;
    const totalExpired = state.ewayBills.filter(bill => bill.status === 'Expired').length;
    const totalValue = state.ewayBills.reduce((sum, bill) => sum + bill.totalInvoiceValue, 0);
    const recentBills = state.ewayBills
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    return {
      totalGenerated,
      totalActive,
      totalCancelled,
      totalExpired,
      totalValue,
      recentBills,
    };
  };

  return (
    <EwayBillContext.Provider
      value={{
        ...state,
        addEwayBill,
        updateEwayBill,
        cancelEwayBill,
        addTransporter,
        updateTransporter,
        addVehicle,
        updateVehicle,
        getEwayBillSummary,
        generateEwayBillNumber,
      }}
    >
      {children}
    </EwayBillContext.Provider>
  );
}

export function useEwayBill() {
  const context = useContext(EwayBillContext);
  if (context === undefined) {
    throw new Error('useEwayBill must be used within an EwayBillProvider');
  }
  return context;
}

// Sample data generator
function generateSampleEwayData() {
  const transporters: TransporterDetails[] = [
    {
      id: uuidv4(),
      transporterId: 'TRN001',
      name: 'Reliable Transport Co.',
      address: '123 Transport Hub, Mumbai, Maharashtra',
      gstin: '27ABCTR1234F1Z5',
      phone: '+91 9876543210',
      email: 'info@reliabletransport.in',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      transporterId: 'TRN002',
      name: 'Express Logistics Ltd.',
      address: '456 Logistics Park, Delhi',
      gstin: '07DEFTR5678K1Z2',
      phone: '+91 9123456789',
      email: 'contact@expresslogistics.in',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const vehicles: VehicleDetails[] = [
    {
      id: uuidv4(),
      vehicleNumber: 'MH12AB1234',
      vehicleType: 'Regular',
      transporterId: transporters[0].id,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      vehicleNumber: 'DL01CD5678',
      vehicleType: 'Regular',
      transporterId: transporters[1].id,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const ewayBills: EwayBill[] = [
    {
      id: uuidv4(),
      ewayBillNumber: '12345678901',
      invoiceId: 'inv-001',
      invoiceNumber: 'INV-001',
      customerId: 'cust-001',
      customerName: 'Tech Innovations Pvt Ltd',
      customerGstin: '29ABCDE1234F1Z5',
      supplierGstin: '27XYZCO5678P1Z8',
      documentType: 'Tax Invoice',
      documentNumber: 'INV-001',
      documentDate: new Date(),
      fromPincode: '400001',
      fromState: 'Maharashtra',
      fromStateCode: '27',
      toPincode: '560001',
      toState: 'Karnataka',
      toStateCode: '29',
      productType: 'Goods',
      hsnCode: '8471',
      productName: 'Computer Hardware',
      productDesc: 'Laptop computers and accessories',
      quantity: 10,
      qtyUnit: 'NOS',
      taxableValue: 500000,
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      igstRate: 18,
      igstAmount: 90000,
      cessRate: 0,
      cessAmount: 0,
      totalInvoiceValue: 590000,
      transactionType: 'Regular',
      subSupplyType: 'Supply',
      transporterId: transporters[0].transporterId,
      transporterName: transporters[0].name,
      transportMode: 'Road',
      vehicleNumber: 'MH12AB1234',
      vehicleType: 'Regular',
      approxDistance: 850,
      status: 'Active',
      generatedDate: new Date(),
      validUpto: addDays(new Date(), 3),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return { ewayBills, transporters, vehicles };
}
