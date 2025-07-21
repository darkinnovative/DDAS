import { useState } from 'react';
import { useBilling } from '../../../context/BillingContext';
import { BillLayout } from './BillLayout';
import { X, FileText } from 'lucide-react';
import type { Invoice } from '../../../types/billing';

interface BillViewerProps {
  invoice?: Invoice;
  isOpen: boolean;
  onClose: () => void;
}

export function BillViewer({ invoice, isOpen, onClose }: BillViewerProps) {
  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-auto">
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FileText size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Invoice Preview</h1>
                <p className="text-gray-300">Invoice {invoice.invoiceNumber}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Bill Layout */}
          <BillLayout invoice={invoice} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}

// Invoice Selection Modal
interface InvoiceSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectInvoice: (invoice: Invoice) => void;
}

export function InvoiceSelectModal({ isOpen, onClose, onSelectInvoice }: InvoiceSelectModalProps) {
  const { invoices, customers } = useBilling();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter(invoice => {
    const customer = customers.find(c => c.id === invoice.customerId);
    const customerName = customer?.name || '';
    return (
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Invoice</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          {/* Search */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Invoice List */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="space-y-2">
            {filteredInvoices.map(invoice => {
              const customer = customers.find(c => c.id === invoice.customerId);
              return (
                <button
                  key={invoice.id}
                  onClick={() => {
                    onSelectInvoice(invoice);
                    onClose();
                  }}
                  className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {invoice.invoiceNumber}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {customer?.name || 'Unknown Customer'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ${invoice.total.toFixed(2)}
                      </p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                        invoice.status === 'sent' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                        invoice.status === 'overdue' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}>
                        {invoice.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
            {filteredInvoices.length === 0 && (
              <div className="text-center py-8">
                <FileText size={48} className="text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No invoices found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
