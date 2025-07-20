import { useState, useEffect } from 'react';
import { useEwayBill } from '../context/EwayBillContext';
import { useBilling } from '../context/BillingContext';
import { X, Save, Package, MapPin, Truck } from 'lucide-react';
import { format } from 'date-fns';
import { DOCUMENT_TYPES, SUPPLY_TYPES, TRANSPORT_MODES, VEHICLE_TYPES, HSN_CODES } from '../types/eway';
import type { EwayBill } from '../types/eway';
import { STATE_CODES } from '../utils/gstCalculations';

interface EwayBillFormProps {
  bill?: EwayBill;
  isOpen: boolean;
  onClose: () => void;
}

export function EwayBillForm({ bill, isOpen, onClose }: EwayBillFormProps) {
  const { addEwayBill, updateEwayBill, transporters, vehicles } = useEwayBill();
  const { invoices, customers } = useBilling();
  
  const [formData, setFormData] = useState({
    invoiceId: '',
    invoiceNumber: '',
    customerId: '',
    customerName: '',
    customerGstin: '',
    supplierGstin: '07XYZCO5678P1Z8', // Default company GSTIN
    documentType: 'Tax Invoice' as 'Tax Invoice' | 'Credit Note' | 'Debit Note' | 'Bill of Supply',
    documentNumber: '',
    documentDate: format(new Date(), 'yyyy-MM-dd'),
    fromPincode: '400001',
    fromState: 'Maharashtra',
    fromStateCode: '27',
    toPincode: '',
    toState: '',
    toStateCode: '',
    productType: 'Goods' as 'Goods' | 'Services',
    hsnCode: '',
    productName: '',
    productDesc: '',
    quantity: 1,
    qtyUnit: 'NOS',
    taxableValue: 0,
    cgstRate: 0,
    cgstAmount: 0,
    sgstRate: 0,
    sgstAmount: 0,
    igstRate: 18,
    igstAmount: 0,
    cessRate: 0,
    cessAmount: 0,
    totalInvoiceValue: 0,
    transactionType: 'Regular' as 'Regular' | 'Bill To - Ship To' | 'Bill From - Dispatch From' | 'Combination of 2 & 3',
    subSupplyType: 'Supply' as 'Supply' | 'Import' | 'Export' | 'Job Work' | 'For Own Use' | 'Job work Returns' | 'Sales Return' | 'Others',
    subSupplyDescription: '',
    transporterId: '',
    transporterName: '',
    transportMode: 'Road' as 'Road' | 'Rail' | 'Air' | 'Ship',
    vehicleNumber: '',
    vehicleType: 'Regular' as 'Regular' | 'Over Dimensional Cargo',
    approxDistance: 0
  });

  useEffect(() => {
    if (bill) {
      setFormData({
        invoiceId: bill.invoiceId,
        invoiceNumber: bill.invoiceNumber,
        customerId: bill.customerId,
        customerName: bill.customerName,
        customerGstin: bill.customerGstin,
        supplierGstin: bill.supplierGstin,
        documentType: bill.documentType,
        documentNumber: bill.documentNumber,
        documentDate: format(bill.documentDate, 'yyyy-MM-dd'),
        fromPincode: bill.fromPincode,
        fromState: bill.fromState,
        fromStateCode: bill.fromStateCode,
        toPincode: bill.toPincode,
        toState: bill.toState,
        toStateCode: bill.toStateCode,
        productType: bill.productType,
        hsnCode: bill.hsnCode,
        productName: bill.productName,
        productDesc: bill.productDesc,
        quantity: bill.quantity,
        qtyUnit: bill.qtyUnit,
        taxableValue: bill.taxableValue,
        cgstRate: bill.cgstRate,
        cgstAmount: bill.cgstAmount,
        sgstRate: bill.sgstRate,
        sgstAmount: bill.sgstAmount,
        igstRate: bill.igstRate,
        igstAmount: bill.igstAmount,
        cessRate: bill.cessRate,
        cessAmount: bill.cessAmount,
        totalInvoiceValue: bill.totalInvoiceValue,
        transactionType: bill.transactionType,
        subSupplyType: bill.subSupplyType,
        subSupplyDescription: bill.subSupplyDescription || '',
        transporterId: bill.transporterId || '',
        transporterName: bill.transporterName || '',
        transportMode: bill.transportMode,
        vehicleNumber: bill.vehicleNumber || '',
        vehicleType: bill.vehicleType,
        approxDistance: bill.approxDistance
      });
    } else {
      // Reset form for new bill
      setFormData({
        invoiceId: '',
        invoiceNumber: '',
        customerId: '',
        customerName: '',
        customerGstin: '',
        supplierGstin: '07XYZCO5678P1Z8',
        documentType: 'Tax Invoice',
        documentNumber: '',
        documentDate: format(new Date(), 'yyyy-MM-dd'),
        fromPincode: '400001',
        fromState: 'Maharashtra',
        fromStateCode: '27',
        toPincode: '',
        toState: '',
        toStateCode: '',
        productType: 'Goods',
        hsnCode: '',
        productName: '',
        productDesc: '',
        quantity: 1,
        qtyUnit: 'NOS',
        taxableValue: 0,
        cgstRate: 0,
        cgstAmount: 0,
        sgstRate: 0,
        sgstAmount: 0,
        igstRate: 18,
        igstAmount: 0,
        cessRate: 0,
        cessAmount: 0,
        totalInvoiceValue: 0,
        transactionType: 'Regular',
        subSupplyType: 'Supply',
        subSupplyDescription: '',
        transporterId: '',
        transporterName: '',
        transportMode: 'Road',
        vehicleNumber: '',
        vehicleType: 'Regular',
        approxDistance: 0
      });
    }
  }, [bill]);

  const handleInvoiceSelect = (invoiceId: string) => {
    const selectedInvoice = invoices.find(inv => inv.id === invoiceId);
    const selectedCustomer = customers.find(cust => cust.id === selectedInvoice?.customerId);
    
    if (selectedInvoice && selectedCustomer) {
      const isInterstate = formData.fromStateCode !== selectedCustomer.stateCode;
      
      setFormData(prev => ({
        ...prev,
        invoiceId: selectedInvoice.id,
        invoiceNumber: selectedInvoice.invoiceNumber,
        customerId: selectedInvoice.customerId,
        customerName: selectedCustomer.name,
        customerGstin: selectedCustomer.gstNumber || '',
        documentNumber: selectedInvoice.invoiceNumber,
        documentDate: format(selectedInvoice.issueDate, 'yyyy-MM-dd'),
        toState: selectedCustomer.address.state,
        toStateCode: selectedCustomer.stateCode,
        toPincode: selectedCustomer.address.zipCode,
        taxableValue: selectedInvoice.subtotal,
        cgstRate: isInterstate ? 0 : 9,
        cgstAmount: isInterstate ? 0 : selectedInvoice.cgstAmount,
        sgstRate: isInterstate ? 0 : 9,
        sgstAmount: isInterstate ? 0 : selectedInvoice.sgstAmount,
        igstRate: isInterstate ? 18 : 0,
        igstAmount: isInterstate ? selectedInvoice.igstAmount : 0,
        totalInvoiceValue: selectedInvoice.total,
        productName: selectedInvoice.items[0]?.description || '',
        productDesc: selectedInvoice.items.map(item => item.description).join(', '),
        hsnCode: selectedInvoice.items[0]?.hsnCode || '',
        quantity: selectedInvoice.items.reduce((sum, item) => sum + item.quantity, 0)
      }));
    }
  };

  const handleTransporterSelect = (transporterId: string) => {
    const selectedTransporter = transporters.find(t => t.transporterId === transporterId);
    if (selectedTransporter) {
      setFormData(prev => ({
        ...prev,
        transporterId,
        transporterName: selectedTransporter.name
      }));
    }
  };

  const handleStateSelect = (field: 'fromState' | 'toState', stateName: string) => {
    const stateCode = Object.entries(STATE_CODES).find(([state]) => state === stateName)?.[1] || '';
    
    if (field === 'fromState') {
      setFormData(prev => ({
        ...prev,
        fromState: stateName,
        fromStateCode: stateCode
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        toState: stateName,
        toStateCode: stateCode
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const billData = {
      ...formData,
      documentDate: new Date(formData.documentDate),
    };

    if (bill) {
      // Update existing bill
      updateEwayBill({ ...bill, ...billData } as EwayBill);
    } else {
      // Create new bill
      addEwayBill(billData);
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {bill ? 'Edit E-way Bill' : 'Generate E-way Bill'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Document Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package size={20} className="text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Document Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Invoice
                </label>
                <select
                  value={formData.invoiceId}
                  onChange={(e) => handleInvoiceSelect(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Invoice</option>
                  {invoices.filter(inv => inv.status !== 'cancelled').map(invoice => (
                    <option key={invoice.id} value={invoice.id}>
                      {invoice.invoiceNumber} - ₹{invoice.total.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Document Type
                </label>
                <select
                  value={formData.documentType}
                  onChange={(e) => setFormData({ ...formData, documentType: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {DOCUMENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Document Date
                </label>
                <input
                  type="date"
                  value={formData.documentDate}
                  onChange={(e) => setFormData({ ...formData, documentDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Customer GSTIN
                </label>
                <input
                  type="text"
                  value={formData.customerGstin}
                  onChange={(e) => setFormData({ ...formData, customerGstin: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sub Supply Type
                </label>
                <select
                  value={formData.subSupplyType}
                  onChange={(e) => setFormData({ ...formData, subSupplyType: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {SUPPLY_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={20} className="text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Address Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* From Address */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">From (Supplier)</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State
                  </label>
                  <select
                    value={formData.fromState}
                    onChange={(e) => handleStateSelect('fromState', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select State</option>
                    {Object.keys(STATE_CODES).map(state => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={formData.fromPincode}
                    onChange={(e) => setFormData({ ...formData, fromPincode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* To Address */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">To (Recipient)</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State
                  </label>
                  <select
                    value={formData.toState}
                    onChange={(e) => handleStateSelect('toState', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select State</option>
                    {Object.keys(STATE_CODES).map(state => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={formData.toPincode}
                    onChange={(e) => setFormData({ ...formData, toPincode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package size={20} className="text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  HSN Code
                </label>
                <select
                  value={formData.hsnCode}
                  onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select HSN Code</option>
                  {HSN_CODES.map(hsn => (
                    <option key={hsn.code} value={hsn.code}>
                      {hsn.code} - {hsn.description}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <select
                    value={formData.qtyUnit}
                    onChange={(e) => setFormData({ ...formData, qtyUnit: e.target.value })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="NOS">NOS</option>
                    <option value="KGS">KGS</option>
                    <option value="LTR">LTR</option>
                    <option value="MTR">MTR</option>
                    <option value="BOX">BOX</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Description
                </label>
                <textarea
                  value={formData.productDesc}
                  onChange={(e) => setFormData({ ...formData, productDesc: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Transport Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Truck size={20} className="text-orange-600 dark:text-orange-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transport Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Transport Mode
                </label>
                <select
                  value={formData.transportMode}
                  onChange={(e) => setFormData({ ...formData, transportMode: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {TRANSPORT_MODES.map(mode => (
                    <option key={mode.value} value={mode.value}>
                      {mode.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Transporter
                </label>
                <select
                  value={formData.transporterId}
                  onChange={(e) => handleTransporterSelect(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Transporter</option>
                  {transporters.map(transporter => (
                    <option key={transporter.id} value={transporter.transporterId}>
                      {transporter.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vehicle Number
                </label>
                <select
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.vehicleNumber}>
                      {vehicle.vehicleNumber} ({vehicle.vehicleType})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vehicle Type
                </label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {VEHICLE_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Approximate Distance (km)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.approxDistance}
                  onChange={(e) => setFormData({ ...formData, approxDistance: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Value Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Value Details</h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Taxable Value:</span>
                  <div className="font-semibold text-gray-900 dark:text-white">₹{formData.taxableValue.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">IGST ({formData.igstRate}%):</span>
                  <div className="font-semibold text-gray-900 dark:text-white">₹{formData.igstAmount.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">CGST ({formData.cgstRate}%):</span>
                  <div className="font-semibold text-gray-900 dark:text-white">₹{formData.cgstAmount.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">SGST ({formData.sgstRate}%):</span>
                  <div className="font-semibold text-gray-900 dark:text-white">₹{formData.sgstAmount.toFixed(2)}</div>
                </div>
              </div>
              <div className="border-t border-gray-300 dark:border-gray-600 mt-4 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">Total Invoice Value:</span>
                  <span className="text-gray-900 dark:text-white">₹{formData.totalInvoiceValue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save size={16} />
              {bill ? 'Update E-way Bill' : 'Generate E-way Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
