import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, X, Building2, User, Package, Calculator } from 'lucide-react';
import { useEInvoice } from '../../../context/EInvoiceContext';
import { useBilling } from '../../../context/BillingContext';
import type { EInvoice, EInvoiceLineItem, EInvoiceDocumentType, EInvoiceType, BuyerType } from '../../../types/einvoice';
import { E_INVOICE_STATE_CODES } from '../../../types/einvoice';

interface EInvoiceFormProps {
  eInvoice?: EInvoice | null;
  onSave: () => void;
  onCancel: () => void;
}

export function EInvoiceForm({ eInvoice, onSave, onCancel }: EInvoiceFormProps) {
  const { createEInvoice, updateEInvoice, convertInvoiceToEInvoice, validateEInvoice } = useEInvoice();
  const { invoices } = useBilling();
  
  const [formData, setFormData] = useState<Partial<EInvoice>>({
    invoiceNumber: '',
    invoiceDate: new Date(),
    invoiceType: 'Regular' as EInvoiceType,
    documentType: 'Tax Invoice' as EInvoiceDocumentType,
    
    supplierGstin: '29AABCU9603R1ZX',
    supplierLegalName: 'Your Company Name',
    supplierTradeName: '',
    supplierAddress1: 'Company Address Line 1',
    supplierAddress2: '',
    supplierLocation: 'Bangalore',
    supplierPincode: '560001',
    supplierStateCode: '29',
    supplierPhone: '',
    supplierEmail: '',
    
    buyerGstin: '',
    buyerLegalName: '',
    buyerTradeName: '',
    buyerAddress1: '',
    buyerAddress2: '',
    buyerLocation: '',
    buyerPincode: '',
    buyerStateCode: '',
    buyerPhone: '',
    buyerEmail: '',
    buyerType: 'Regular' as BuyerType,
    
    lineItems: [],
    
    totalAssessableValue: 0,
    totalCgstValue: 0,
    totalSgstValue: 0,
    totalIgstValue: 0,
    totalCessValue: 0,
    totalOtherCharges: 0,
    totalInvoiceValue: 0,
    roundOffAmount: 0,
    totalInvoiceValueInWords: '',
    
    paymentTerms: '',
    paymentDueDate: undefined,
    
    transportMode: undefined,
    vehicleType: undefined,
    transporterName: '',
    vehicleNumber: '',
    distance: undefined,
    
    reverseCharge: false,
    placeOfSupply: '29',
    
    status: 'Draft'
  });

  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pre-populate form if editing
  useEffect(() => {
    if (eInvoice) {
      setFormData(eInvoice);
    }
  }, [eInvoice]);

  // Load from existing invoice
  const handleLoadFromInvoice = () => {
    const invoice = invoices.find(inv => inv.id === selectedInvoiceId);
    if (invoice) {
      const eInvoiceData = convertInvoiceToEInvoice(invoice);
      setFormData(prev => ({ ...prev, ...eInvoiceData }));
    }
  };

  // Handle form field changes
  const handleFieldChange = (field: keyof EInvoice, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate totals
  const calculateTotals = () => {
    if (!formData.lineItems || formData.lineItems.length === 0) return;

    const totals = formData.lineItems.reduce((acc, item) => ({
      assessableValue: acc.assessableValue + item.assessableValue,
      cgstValue: acc.cgstValue + item.cgstAmount,
      sgstValue: acc.sgstValue + item.sgstAmount,
      igstValue: acc.igstValue + item.igstAmount,
      cessValue: acc.cessValue + item.cessAmount,
      totalValue: acc.totalValue + item.totalItemValue
    }), {
      assessableValue: 0,
      cgstValue: 0,
      sgstValue: 0,
      igstValue: 0,
      cessValue: 0,
      totalValue: 0
    });

    setFormData(prev => ({
      ...prev,
      totalAssessableValue: totals.assessableValue,
      totalCgstValue: totals.cgstValue,
      totalSgstValue: totals.sgstValue,
      totalIgstValue: totals.igstValue,
      totalCessValue: totals.cessValue,
      totalInvoiceValue: totals.totalValue,
      totalInvoiceValueInWords: numberToWords(totals.totalValue)
    }));
  };

  // Add line item
  const addLineItem = () => {
    const newItem: EInvoiceLineItem = {
      serialNumber: (formData.lineItems?.length || 0) + 1,
      productDescription: '',
      isService: false,
      hsnCode: '',
      quantity: 1,
      freeQuantity: 0,
      unit: 'NOS',
      unitPrice: 0,
      totalAmount: 0,
      discount: 0,
      preTaxValue: 0,
      assessableValue: 0,
      gstRate: 18,
      igstAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      cessRate: 0,
      cessAmount: 0,
      stateCessRate: 0,
      stateCessAmount: 0,
      otherCharges: 0,
      totalItemValue: 0,
      itemTotal: 0
    };

    setFormData(prev => ({
      ...prev,
      lineItems: [...(prev.lineItems || []), newItem]
    }));
  };

  // Update line item
  const updateLineItem = (index: number, field: keyof EInvoiceLineItem, value: any) => {
    if (!formData.lineItems) return;

    const updatedItems = [...formData.lineItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // Recalculate item totals
    const item = updatedItems[index];
    const isInterstate = formData.supplierStateCode !== formData.buyerStateCode;
    
    item.totalAmount = item.quantity * item.unitPrice;
    item.preTaxValue = item.totalAmount - item.discount;
    item.assessableValue = item.preTaxValue;
    
    const gstAmount = item.assessableValue * item.gstRate / 100;
    
    if (isInterstate) {
      item.igstAmount = gstAmount;
      item.cgstAmount = 0;
      item.sgstAmount = 0;
    } else {
      item.igstAmount = 0;
      item.cgstAmount = gstAmount / 2;
      item.sgstAmount = gstAmount / 2;
    }
    
    item.cessAmount = item.assessableValue * item.cessRate / 100;
    item.totalItemValue = item.assessableValue + gstAmount + item.cessAmount + item.otherCharges;
    item.itemTotal = item.totalItemValue;

    setFormData(prev => ({ ...prev, lineItems: updatedItems }));
  };

  // Remove line item
  const removeLineItem = (index: number) => {
    if (!formData.lineItems) return;
    
    const updatedItems = formData.lineItems.filter((_, i) => i !== index);
    // Renumber items
    updatedItems.forEach((item, i) => item.serialNumber = i + 1);
    
    setFormData(prev => ({ ...prev, lineItems: updatedItems }));
  };

  // Recalculate totals when line items change
  useEffect(() => {
    calculateTotals();
  }, [formData.lineItems]);

  // Simple number to words conversion
  const numberToWords = (amount: number): string => {
    if (amount === 0) return 'Zero Rupees Only';
    return `${amount.toLocaleString('en-IN')} Rupees Only`;
  };

  // Validate and save
  const handleSave = async () => {
    const validationErrors = validateEInvoice(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      if (eInvoice) {
        updateEInvoice(eInvoice.id, formData);
      } else {
        await createEInvoice(formData);
      }
      onSave();
    } catch (error) {
      console.error('Failed to save E-Invoice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stateOptions = Object.entries(E_INVOICE_STATE_CODES).map(([name, code]) => ({
    label: name,
    value: code
  }));

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {eInvoice ? 'Edit E-Invoice' : 'Generate E-Invoice'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create electronic invoice for GST compliance
            </p>
          </div>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 dark:text-red-200 font-medium mb-2">Please fix the following errors:</h3>
            <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-6">
          {/* Load from Existing Invoice */}
          {!eInvoice && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Load from Existing Invoice</h2>
              <div className="flex gap-4">
                <select
                  value={selectedInvoiceId}
                  onChange={(e) => setSelectedInvoiceId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select an invoice</option>
                  {invoices.map(invoice => (
                    <option key={invoice.id} value={invoice.id}>
                      {invoice.invoiceNumber} - {invoice.customer?.name} - ₹{invoice.total.toFixed(2)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleLoadFromInvoice}
                  disabled={!selectedInvoiceId}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Load Invoice
                </button>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Invoice Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="INV-2025-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Invoice Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.invoiceDate ? new Date(formData.invoiceDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleFieldChange('invoiceDate', new Date(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Document Type
                </label>
                <select
                  value={formData.documentType}
                  onChange={(e) => handleFieldChange('documentType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Tax Invoice">Tax Invoice</option>
                  <option value="Bill of Supply">Bill of Supply</option>
                  <option value="Credit Note">Credit Note</option>
                  <option value="Debit Note">Debit Note</option>
                </select>
              </div>
            </div>
          </div>

          {/* Supplier Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 size={20} className="text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Supplier Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  GSTIN <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.supplierGstin}
                  onChange={(e) => handleFieldChange('supplierGstin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="29AABCU9603R1ZX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Legal Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.supplierLegalName}
                  onChange={(e) => handleFieldChange('supplierLegalName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Company Legal Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.supplierAddress1}
                  onChange={(e) => handleFieldChange('supplierAddress1', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Building, Street"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.supplierLocation}
                  onChange={(e) => handleFieldChange('supplierLocation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.supplierPincode}
                  onChange={(e) => handleFieldChange('supplierPincode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="560001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.supplierStateCode}
                  onChange={(e) => handleFieldChange('supplierStateCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {stateOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Buyer Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User size={20} className="text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Buyer Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  GSTIN
                </label>
                <input
                  type="text"
                  value={formData.buyerGstin}
                  onChange={(e) => handleFieldChange('buyerGstin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="07AADCR1234M1Z5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Legal Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.buyerLegalName}
                  onChange={(e) => handleFieldChange('buyerLegalName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Buyer Legal Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.buyerAddress1}
                  onChange={(e) => handleFieldChange('buyerAddress1', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Building, Street"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.buyerLocation}
                  onChange={(e) => handleFieldChange('buyerLocation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.buyerPincode}
                  onChange={(e) => handleFieldChange('buyerPincode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="110001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.buyerStateCode}
                  onChange={(e) => handleFieldChange('buyerStateCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select State</option>
                  {stateOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package size={20} className="text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Line Items</h2>
              </div>
              <button
                onClick={addLineItem}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>

            {formData.lineItems && formData.lineItems.length > 0 ? (
              <div className="space-y-4">
                {formData.lineItems.map((item, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900 dark:text-white">Item #{item.serialNumber}</h3>
                      <button
                        onClick={() => removeLineItem(index)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={item.productDescription}
                          onChange={(e) => updateLineItem(index, 'productDescription', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Product or service description"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          HSN Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={item.hsnCode}
                          onChange={(e) => updateLineItem(index, 'hsnCode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="1234"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Unit Price
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          GST Rate (%)
                        </label>
                        <select
                          value={item.gstRate}
                          onChange={(e) => updateLineItem(index, 'gstRate', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value={0}>0%</option>
                          <option value={5}>5%</option>
                          <option value={12}>12%</option>
                          <option value={18}>18%</option>
                          <option value={28}>28%</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Total Amount
                        </label>
                        <input
                          type="number"
                          value={item.totalItemValue.toFixed(2)}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No line items added</p>
                <button
                  onClick={addLineItem}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                >
                  <Plus size={16} />
                  Add First Item
                </button>
              </div>
            )}
          </div>

          {/* Totals */}
          {formData.lineItems && formData.lineItems.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calculator size={20} className="text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Invoice Totals</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Taxable Value
                  </label>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    ₹{formData.totalAssessableValue?.toFixed(2) || '0.00'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    CGST
                  </label>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    ₹{formData.totalCgstValue?.toFixed(2) || '0.00'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    SGST / IGST
                  </label>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    ₹{((formData.totalSgstValue || 0) + (formData.totalIgstValue || 0)).toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Invoice Value
                  </label>
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    ₹{formData.totalInvoiceValue?.toFixed(2) || '0.00'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save size={20} />
              {isLoading ? 'Saving...' : eInvoice ? 'Update E-Invoice' : 'Save E-Invoice'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
