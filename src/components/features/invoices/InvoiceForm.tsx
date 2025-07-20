import { useState, useEffect } from 'react';
import { useBilling } from '../../../context/BillingContext';
import { X, Plus, Trash2, Save } from 'lucide-react';
import { format } from 'date-fns';
import { 
  GST_RATES, 
  STATE_CODES, 
  COMMON_HSN_CODES,
  calculateItemGST, 
  calculateInvoiceGST
} from '../../../utils/gstCalculations';
import type { Invoice, InvoiceItem } from '../../../types/billing';

interface InvoiceFormProps {
  invoice?: Invoice;
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoice: Partial<Invoice>) => void;
}

export function InvoiceForm({ invoice, isOpen, onClose, onSave }: InvoiceFormProps) {
  const { customers } = useBilling();
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    customerId: '',
    issueDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    status: 'draft' as 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled',
    notes: '',
    taxRate: 18,
    placeOfSupply: '',
    companyStateCode: '07' // Default to Delhi
  });

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, price: 0, total: 0, gstRate: 18, gstAmount: 0, taxableValue: 0, hsnCode: '' }
  ]);

  useEffect(() => {
    if (invoice) {
      setFormData({
        invoiceNumber: invoice.invoiceNumber,
        customerId: invoice.customerId,
        issueDate: format(invoice.issueDate, 'yyyy-MM-dd'),
        dueDate: format(invoice.dueDate, 'yyyy-MM-dd'),
        status: invoice.status,
        notes: invoice.notes || '',
        taxRate: invoice.taxRate || 18,
        placeOfSupply: invoice.placeOfSupply || '',
        companyStateCode: '07' // Default to Delhi
      });
      setInvoiceItems(invoice.items);
    } else {
      // Reset form for new invoice
      setFormData({
        invoiceNumber: `INV-${Date.now()}`,
        customerId: '',
        issueDate: format(new Date(), 'yyyy-MM-dd'),
        dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        status: 'draft',
        notes: '',
        taxRate: 18,
        placeOfSupply: '',
        companyStateCode: '07' // Default to Delhi
      });
      setInvoiceItems([
        { id: '1', description: '', quantity: 1, price: 0, total: 0, gstRate: 18, gstAmount: 0, taxableValue: 0, hsnCode: '' }
      ]);
    }
  }, [invoice]);

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Recalculate GST for this item
    if (field === 'quantity' || field === 'price' || field === 'gstRate') {
      const selectedCustomer = customers.find(c => c.id === formData.customerId);
      const customerStateCode = selectedCustomer?.stateCode || '07';
      const isInterstate = formData.companyStateCode !== customerStateCode;
      
      const gstCalc = calculateItemGST(
        updatedItems[index].quantity,
        updatedItems[index].price,
        updatedItems[index].gstRate,
        isInterstate
      );
      
      updatedItems[index].taxableValue = gstCalc.taxableValue;
      updatedItems[index].gstAmount = gstCalc.totalGst;
      updatedItems[index].total = gstCalc.totalAmount;
    }
    
    setInvoiceItems(updatedItems);
  };

  const addItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      { 
        id: Date.now().toString(), 
        description: '', 
        quantity: 1, 
        price: 0, 
        total: 0, 
        gstRate: 18, 
        gstAmount: 0, 
        taxableValue: 0, 
        hsnCode: '' 
      }
    ]);
  };

  const removeItem = (index: number) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
    }
  };

  // Calculate GST totals
  const selectedCustomer = customers.find(c => c.id === formData.customerId);
  const customerStateCode = selectedCustomer?.stateCode || '07';
  
  const gstCalculation = calculateInvoiceGST(
    invoiceItems,
    formData.companyStateCode,
    customerStateCode
  );

  const subtotal = gstCalculation.subtotal;
  const cgstAmount = gstCalculation.totalCGST;
  const sgstAmount = gstCalculation.totalSGST;
  const igstAmount = gstCalculation.totalIGST;
  const totalGst = gstCalculation.totalGST;
  const total = gstCalculation.grandTotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const invoiceData = {
      ...formData,
      issueDate: new Date(formData.issueDate),
      dueDate: new Date(formData.dueDate),
      items: invoiceItems,
      subtotal,
      taxRate: formData.taxRate,
      taxAmount: totalGst, // For backward compatibility
      cgstAmount,
      sgstAmount,
      igstAmount,
      totalGst,
      gstType: (gstCalculation.isInterstate ? 'interstate' : 'intrastate') as 'interstate' | 'intrastate',
      total
    };

    onSave(invoiceData);
    onClose();
  };

  const selectFromInventory = (index: number, itemId: string) => {
    // For now, we'll just provide a basic item name
    // This can be extended when inventory management is fully implemented
    updateItem(index, 'description', `Sample Item ${itemId}`);
    updateItem(index, 'price', 50);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {invoice ? 'Edit Invoice' : 'Create New Invoice'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Invoice Number
              </label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Customer
              </label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Issue Date
              </label>
              <input
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Place of Supply (State)
              </label>
              <select
                value={formData.placeOfSupply}
                onChange={(e) => setFormData({ ...formData, placeOfSupply: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select State</option>
                {Object.keys(STATE_CODES).map(state => (
                  <option key={state} value={state}>
                    {state} ({STATE_CODES[state as keyof typeof STATE_CODES]})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                This determines if GST is calculated as CGST+SGST (intrastate) or IGST (interstate)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default GST Rate (%)
              </label>
              <select
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {GST_RATES.map(rate => (
                  <option key={rate.value} value={rate.value}>
                    {rate.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Invoice Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Invoice Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {invoiceItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-end bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="col-span-12 md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter item description"
                        required
                      />
                      <select
                        onChange={(e) => e.target.value && selectFromInventory(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                      >
                        <option value="">Quick select...</option>
                        <option value="1">Consulting Services - $100</option>
                        <option value="2">Software License - $50</option>
                        <option value="3">Support Package - $75</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      HSN Code
                    </label>
                    <input
                      type="text"
                      value={item.hsnCode || ''}
                      onChange={(e) => updateItem(index, 'hsnCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="HSN Code"
                    />
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          updateItem(index, 'hsnCode', e.target.value);
                          const hsn = COMMON_HSN_CODES.find(h => h.code === e.target.value);
                          if (hsn && !item.description) {
                            updateItem(index, 'description', hsn.description);
                          }
                        }
                      }}
                      className="w-full px-2 py-1 mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs"
                    >
                      <option value="">Common HSN...</option>
                      {COMMON_HSN_CODES.map(hsn => (
                        <option key={hsn.code} value={hsn.code}>
                          {hsn.code} - {hsn.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-6 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Qty
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="col-span-6 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="col-span-6 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      GST %
                    </label>
                    <select
                      value={item.gstRate}
                      onChange={(e) => updateItem(index, 'gstRate', parseFloat(e.target.value))}
                      className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      {GST_RATES.map(rate => (
                        <option key={rate.value} value={rate.value}>
                          {rate.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-6 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Total (₹)
                    </label>
                    <div className="px-3 py-2 bg-gray-100 dark:bg-gray-600 rounded text-gray-900 dark:text-white font-semibold text-sm">
                      <div>₹{item.total.toFixed(2)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Tax: ₹{item.gstAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-1">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={invoiceItems.length === 1}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <div className="flex justify-end">
              <div className="w-80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                
                {gstCalculation.isInterstate ? (
                  // Interstate - Show IGST only
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">IGST:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">₹{igstAmount.toFixed(2)}</span>
                  </div>
                ) : (
                  // Intrastate - Show CGST + SGST
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">CGST:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">₹{cgstAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">SGST:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">₹{sgstAmount.toFixed(2)}</span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total GST:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{totalGst.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-lg font-bold border-t border-gray-300 dark:border-gray-600 pt-2">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-gray-900 dark:text-white">₹{total.toFixed(2)}</span>
                </div>
                
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Tax Type: {gstCalculation.isInterstate ? 'Interstate (IGST)' : 'Intrastate (CGST + SGST)'}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Additional notes for this invoice"
              />
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
              {invoice ? 'Update Invoice' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
