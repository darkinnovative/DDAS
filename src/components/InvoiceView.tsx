import { useBilling } from '../context/BillingContext';
import { X, Download, Mail, Printer, Edit } from 'lucide-react';
import { format } from 'date-fns';
import type { Invoice } from '../types/billing';

interface InvoiceViewProps {
  invoice?: Invoice;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (invoice: Invoice) => void;
}

export function InvoiceView({ invoice, isOpen, onClose, onEdit }: InvoiceViewProps) {
  const { customers } = useBilling();

  if (!isOpen || !invoice) return null;

  const customer = customers.find(c => c.id === invoice.customerId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'sent':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'overdue':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'draft':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Invoice {invoice.invoiceNumber}
            </h2>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(invoice.status)}`}>
              {invoice.status.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(invoice)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Edit Invoice"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={() => console.log('Download PDF')}
              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
              title="Download PDF"
            >
              <Download size={20} />
            </button>
            <button
              onClick={() => console.log('Print Invoice')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Print"
            >
              <Printer size={20} />
            </button>
            <button
              onClick={() => console.log('Email Invoice')}
              className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors"
              title="Email"
            >
              <Mail size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Invoice Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Issue Date:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {format(invoice.issueDate, 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Due Date:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {format(invoice.dueDate, 'MMM dd, yyyy')}
                  </span>
                </div>
                {invoice.paidDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Paid Date:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {format(invoice.paidDate, 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bill To</h3>
              {customer ? (
                <div className="space-y-1">
                  <div className="font-medium text-gray-900 dark:text-white">{customer.name}</div>
                  <div className="text-gray-600 dark:text-gray-400">{customer.email}</div>
                  <div className="text-gray-600 dark:text-gray-400">{customer.phone}</div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {customer.address.street}<br />
                    {customer.address.city}, {customer.address.state} {customer.address.zipCode}<br />
                    {customer.address.country}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 dark:text-gray-400">Customer not found</div>
              )}
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Items</h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Description</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Qty</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">Price</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {invoice.items.map(item => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">{item.description}</td>
                      <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{formatCurrency(item.price)}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="flex justify-end mb-8">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal:</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax ({invoice.taxRate}%):</span>
                <span>{formatCurrency(invoice.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white border-t border-gray-300 dark:border-gray-600 pt-2">
                <span>Total:</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Notes</h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">{invoice.notes}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onEdit(invoice)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Edit size={16} />
              Edit Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
