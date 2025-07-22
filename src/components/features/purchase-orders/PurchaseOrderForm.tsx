import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import type { PurchaseOrder, PurchaseOrderItem, Vendor } from '../../../types/billing';

interface PurchaseOrderFormProps {
  purchaseOrder: PurchaseOrder | null;
  onSave: (po: PurchaseOrder) => void;
  onCancel: () => void;
}

// Sample vendors for demo
const sampleVendors: Vendor[] = [
  {
    id: 'vendor-1',
    name: 'Tech Solutions Pvt Ltd',
    email: 'sales@techsolutions.com',
    phone: '+91 98765 43210',
    address: {
      street: '456 Industrial Area',
      city: 'Noida',
      state: 'Uttar Pradesh',
      zipCode: '201301',
      country: 'India'
    },
    gstNumber: '09AAACT2727Q1ZS',
    stateCode: '09',
    category: 'goods',
    paymentTerms: 'net30',
    isActive: true,
    rating: 5,
    totalPurchases: 250000,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'vendor-2',
    name: 'Office Supplies Co.',
    email: 'contact@officesupplies.com',
    phone: '+91 87654 32109',
    address: {
      street: '789 Commercial Complex',
      city: 'Gurugram',
      state: 'Haryana',
      zipCode: '122001',
      country: 'India'
    },
    gstNumber: '06AABCO6789M1ZX',
    stateCode: '06',
    category: 'goods',
    paymentTerms: 'net15',
    isActive: true,
    rating: 4,
    totalPurchases: 150000,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  }
];

export function PurchaseOrderForm({ purchaseOrder, onSave, onCancel }: PurchaseOrderFormProps) {
  const [formData, setFormData] = useState<Partial<PurchaseOrder>>({
    poNumber: '',
    vendorId: '',
    status: 'draft',
    orderDate: new Date(),
    expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    gstType: 'intrastate',
    priority: 'medium',
    paymentTerms: 'net30',
    notes: '',
    terms: 'Standard terms and conditions apply',
    items: [
      {
        id: '1',
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0,
        gstRate: 0.18,
        gstAmount: 0,
        taxableValue: 0,
        unit: 'Pieces'
      }
    ]
  });

  useEffect(() => {
    if (purchaseOrder) {
      setFormData(purchaseOrder);
    } else {
      // Generate new PO number
      const poNumber = `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
      setFormData(prev => ({ ...prev, poNumber }));
    }
  }, [purchaseOrder]);

  const selectedVendor = sampleVendors.find(v => v.id === formData.vendorId);

  const calculateItemTotal = (quantity: number, unitPrice: number, gstRate: number) => {
    const subtotal = quantity * unitPrice;
    const gstAmount = subtotal * gstRate;
    return {
      total: subtotal + gstAmount,
      gstAmount,
      taxableValue: subtotal
    };
  };

  const calculateOrderTotals = (items: PurchaseOrderItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.taxableValue, 0);
    const totalGst = items.reduce((sum, item) => sum + item.gstAmount, 0);
    const total = subtotal + totalGst;

    return {
      subtotal,
      taxAmount: totalGst,
      cgstAmount: formData.gstType === 'intrastate' ? totalGst / 2 : 0,
      sgstAmount: formData.gstType === 'intrastate' ? totalGst / 2 : 0,
      igstAmount: formData.gstType === 'interstate' ? totalGst : 0,
      totalGst,
      total
    };
  };

  const updateItem = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    const updatedItems = [...(formData.items || [])];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    if (field === 'quantity' || field === 'unitPrice' || field === 'gstRate') {
      const item = updatedItems[index];
      const calculated = calculateItemTotal(
        field === 'quantity' ? value : item.quantity,
        field === 'unitPrice' ? value : item.unitPrice,
        field === 'gstRate' ? value : item.gstRate
      );
      
      updatedItems[index] = {
        ...updatedItems[index],
        ...calculated
      };
    }

    const totals = calculateOrderTotals(updatedItems);
    setFormData(prev => ({ ...prev, items: updatedItems, ...totals }));
  };

  const addItem = () => {
    const newItem: PurchaseOrderItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      gstRate: 0.18,
      gstAmount: 0,
      taxableValue: 0,
      unit: 'Pieces'
    };
    
    const updatedItems = [...(formData.items || []), newItem];
    const totals = calculateOrderTotals(updatedItems);
    setFormData(prev => ({ ...prev, items: updatedItems, ...totals }));
  };

  const removeItem = (index: number) => {
    const updatedItems = (formData.items || []).filter((_, i) => i !== index);
    const totals = calculateOrderTotals(updatedItems);
    setFormData(prev => ({ ...prev, items: updatedItems, ...totals }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const poData: PurchaseOrder = {
      id: purchaseOrder?.id || Date.now().toString(),
      poNumber: formData.poNumber!,
      vendorId: formData.vendorId!,
      vendor: selectedVendor,
      items: formData.items as PurchaseOrderItem[],
      subtotal: formData.subtotal || 0,
      taxRate: 0.18,
      taxAmount: formData.taxAmount || 0,
      cgstAmount: formData.cgstAmount || 0,
      sgstAmount: formData.sgstAmount || 0,
      igstAmount: formData.igstAmount || 0,
      totalGst: formData.totalGst || 0,
      total: formData.total || 0,
      status: formData.status as any || 'draft',
      orderDate: formData.orderDate!,
      expectedDeliveryDate: formData.expectedDeliveryDate!,
      notes: formData.notes,
      terms: formData.terms,
      gstType: formData.gstType as any || 'intrastate',
      priority: formData.priority as any || 'medium',
      paymentTerms: formData.paymentTerms as any || 'net30',
      contactPerson: selectedVendor?.contactPerson,
      contactPhone: selectedVendor?.phone,
      contactEmail: selectedVendor?.email,
      createdAt: purchaseOrder?.createdAt || new Date(),
      updatedAt: new Date()
    };

    onSave(poData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {purchaseOrder ? 'Edit Purchase Order' : 'New Purchase Order'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                PO Number *
              </label>
              <Input
                value={formData.poNumber || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, poNumber: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vendor *
              </label>
              <select
                value={formData.vendorId || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, vendorId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select Vendor</option>
                {sampleVendors.map(vendor => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                value={formData.priority || 'medium'}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Order Date *
              </label>
              <Input
                type="date"
                value={formData.orderDate ? format(formData.orderDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => setFormData(prev => ({ ...prev, orderDate: new Date(e.target.value) }))}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expected Delivery Date *
              </label>
              <Input
                type="date"
                value={formData.expectedDeliveryDate ? format(formData.expectedDeliveryDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => setFormData(prev => ({ ...prev, expectedDeliveryDate: new Date(e.target.value) }))}
                required
              />
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Items</h3>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 dark:border-gray-600 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Description</th>
                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Qty</th>
                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Unit</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 dark:text-gray-300">Unit Price</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 dark:text-gray-300">GST %</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 dark:text-gray-300">Total</th>
                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items?.map((item, index) => (
                    <tr key={item.id} className="border-t border-gray-200 dark:border-gray-600">
                      <td className="px-4 py-2">
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          placeholder="Item description"
                          required
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="text-center"
                          required
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          value={item.unit}
                          onChange={(e) => updateItem(index, 'unit', e.target.value)}
                          placeholder="Unit"
                          className="text-center"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="text-right"
                          required
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          value={item.gstRate * 100}
                          onChange={(e) => updateItem(index, 'gstRate', (parseFloat(e.target.value) || 0) / 100)}
                          min="0"
                          max="100"
                          step="0.01"
                          className="text-right"
                        />
                      </td>
                      <td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.total)}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800"
                          disabled={(formData.items?.length || 0) <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Additional Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    GST Type
                  </label>
                  <select
                    value={formData.gstType || 'intrastate'}
                    onChange={(e) => setFormData(prev => ({ ...prev, gstType: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="intrastate">Intrastate (CGST + SGST)</option>
                    <option value="interstate">Interstate (IGST)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Terms
                  </label>
                  <select
                    value={formData.paymentTerms || 'net30'}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="immediate">Immediate</option>
                    <option value="net15">Net 15 days</option>
                    <option value="net30">Net 30 days</option>
                    <option value="net45">Net 45 days</option>
                    <option value="net60">Net 60 days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Summary</h3>
              
              <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(formData.subtotal || 0)}</span>
                  </div>
                  
                  {formData.gstType === 'intrastate' ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">CGST:</span>
                        <span>{formatCurrency(formData.cgstAmount || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">SGST:</span>
                        <span>{formatCurrency(formData.sgstAmount || 0)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">IGST:</span>
                      <span>{formatCurrency(formData.igstAmount || 0)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatCurrency(formData.total || 0)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              {purchaseOrder ? 'Update' : 'Create'} Purchase Order
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
