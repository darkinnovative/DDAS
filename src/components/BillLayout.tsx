import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBilling } from '../context/BillingContext';
import { format } from 'date-fns';
import { 
  FileText, 
  Download, 
  Printer, 
  Mail, 
  Copy, 
  Eye, 
  Calculator,
  Building2,
  User,
  Calendar,
  DollarSign,
  Hash,
  Phone,
  MapPin,
  Globe
} from 'lucide-react';
import type { Invoice, InvoiceItem } from '../types/billing';

interface BillLayoutProps {
  invoice: Invoice;
  onClose?: () => void;
}

export function BillLayout({ invoice, onClose }: BillLayoutProps) {
  const { isDarkMode } = useAuth();
  const { customers } = useBilling();
  const [layoutType, setLayoutType] = useState<'standard' | 'modern' | 'compact'>('standard');
  
  const customer = customers.find(c => c.id === invoice.customerId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // PDF generation logic would go here
    console.log('Downloading PDF for invoice:', invoice.invoiceNumber);
  };

  const handleEmailInvoice = () => {
    // Email logic would go here
    console.log('Emailing invoice:', invoice.invoiceNumber);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const renderStandardLayout = () => (
    <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Building2 size={32} />
              <div>
                <h1 className="text-2xl font-bold">DDAS</h1>
                <p className="text-blue-100">Digital Daily Account System</p>
              </div>
            </div>
            <div className="space-y-1 text-blue-100">
              <p>123 Business Street</p>
              <p>New York, NY 10001</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Email: contact@ddas.com</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold mb-2">INVOICE</h2>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-90">Invoice Number</p>
              <p className="text-xl font-mono font-bold">{invoice.invoiceNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Bill To */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User size={20} />
              Bill To
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                {customer?.name || 'Unknown Customer'}
              </p>
              <div className="space-y-1 text-gray-600 dark:text-gray-300">
                <p className="flex items-center gap-2">
                  <Mail size={14} />
                  {customer?.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={14} />
                  {customer?.phone}
                </p>
                <div className="flex items-start gap-2 mt-2">
                  <MapPin size={14} className="mt-0.5" />
                  <div>
                    <p>{customer?.address.street}</p>
                    <p>{customer?.address.city}, {customer?.address.state} {customer?.address.zipCode}</p>
                    <p>{customer?.address.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText size={20} />
              Invoice Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <Hash size={16} />
                  Invoice Number:
                </span>
                <span className="font-mono font-semibold text-gray-900 dark:text-white">
                  {invoice.invoiceNumber}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <Calendar size={16} />
                  Issue Date:
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {format(invoice.issueDate, 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <Calendar size={16} />
                  Due Date:
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {format(invoice.dueDate, 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  invoice.status === 'paid' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                  invoice.status === 'sent' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                  invoice.status === 'overdue' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}>
                  {invoice.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calculator size={20} />
            Items & Services
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-600">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Description</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Qty</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Price</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-4 px-4 text-gray-900 dark:text-white">{item.description}</td>
                    <td className="py-4 px-4 text-right text-gray-700 dark:text-gray-300">{item.quantity}</td>
                    <td className="py-4 px-4 text-right text-gray-700 dark:text-gray-300">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full max-w-md">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Tax ({(invoice.taxRate * 100).toFixed(1)}%):</span>
                  <span>{formatCurrency(invoice.taxAmount)}</span>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-500 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                    <span>Total:</span>
                    <span className="flex items-center gap-1">
                      <DollarSign size={20} />
                      {formatCurrency(invoice.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Notes:</h4>
            <p className="text-gray-700 dark:text-gray-300">{invoice.notes}</p>
          </div>
        )}

        {/* Payment Information */}
        <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Payment Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <p><strong>Bank:</strong> DDAS Business Bank</p>
              <p><strong>Account:</strong> 1234567890</p>
              <p><strong>Routing:</strong> 123456789</p>
            </div>
            <div>
              <p><strong>Payment Terms:</strong> Net 30</p>
              <p><strong>Late Fee:</strong> 1.5% per month</p>
              <p><strong>Questions:</strong> billing@ddas.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 dark:bg-gray-700 p-6 text-center">
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Thank you for your business! Please remit payment by the due date to avoid late fees.
        </p>
        <div className="flex justify-center items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Globe size={14} />
            www.ddas.com
          </span>
          <span>|</span>
          <span className="flex items-center gap-1">
            <Mail size={14} />
            contact@ddas.com
          </span>
          <span>|</span>
          <span className="flex items-center gap-1">
            <Phone size={14} />
            +1 (555) 123-4567
          </span>
        </div>
      </div>
    </div>
  );

  const renderModernLayout = () => (
    <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden">
      <div className="p-8">
        {/* Modern Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Building2 size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">DDAS</h1>
              <p className="text-gray-500 dark:text-gray-400">Digital Daily Account System</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Invoice</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
              {invoice.invoiceNumber}
            </p>
          </div>
        </div>

        {/* Rest of modern layout... */}
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Modern layout implementation...</p>
        </div>
      </div>
    </div>
  );

  const renderCompactLayout = () => (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-2xl">
      <div className="p-6">
        {/* Compact Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-600">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">DDAS Invoice</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(invoice.total)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {format(invoice.dueDate, 'MMM dd, yyyy')}
            </p>
          </div>
        </div>

        {/* Rest of compact layout... */}
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Compact layout implementation...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      {/* Action Bar */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <select
                value={layoutType}
                onChange={(e) => setLayoutType(e.target.value as 'standard' | 'modern' | 'compact')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="standard">Standard Layout</option>
                <option value="modern">Modern Layout</option>
                <option value="compact">Compact Layout</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Printer size={16} />
                Print
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Download size={16} />
                Download PDF
              </button>
              <button
                onClick={handleEmailInvoice}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Mail size={16} />
                Email
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Copy size={16} />
                Copy Link
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <Eye size={16} />
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Layout */}
      <div className="max-w-6xl mx-auto">
        {layoutType === 'standard' && renderStandardLayout()}
        {layoutType === 'modern' && renderModernLayout()}
        {layoutType === 'compact' && renderCompactLayout()}
      </div>
    </div>
  );
}
