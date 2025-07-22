import { format } from 'date-fns';
import { 
  X, 
  Edit3, 
  Download, 
  Send, 
  Clock,
  Package,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import type { PurchaseOrder } from '../../../types/billing';

interface PurchaseOrderViewProps {
  purchaseOrder: PurchaseOrder;
  onClose: () => void;
  onEdit: () => void;
}

export function PurchaseOrderView({ purchaseOrder, onClose, onEdit }: PurchaseOrderViewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="w-5 h-5 text-gray-500" />;
      case 'sent':
        return <Send className="w-5 h-5 text-blue-500" />;
      case 'approved':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'received':
        return <Package className="w-5 h-5 text-purple-500" />;
      case 'cancelled':
        return <X className="w-5 h-5 text-red-500" />;
      case 'partially_received':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'received':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'partially_received':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('purchase-order-content')?.innerHTML;
    const printWindow = window.open('', '_blank');
    
    if (printWindow && printContent) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Purchase Order - ${purchaseOrder.poNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; color: #000; }
              .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
              .company-info { text-align: center; margin-bottom: 20px; }
              .po-details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
              .vendor-details { border: 1px solid #ccc; padding: 15px; }
              .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .items-table th, .items-table td { border: 1px solid #000; padding: 8px; text-align: left; }
              .items-table th { background: #f0f0f0; font-weight: bold; }
              .totals { margin-top: 20px; text-align: right; }
              .signature { margin-top: 50px; display: grid; grid-template-columns: 1fr 1fr; gap: 50px; }
              .signature-block { text-align: center; border-top: 1px solid #000; padding-top: 10px; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            ${printContent}
            <div class="signature">
              <div class="signature-block">
                <p><strong>Vendor Signature</strong></p>
              </div>
              <div class="signature-block">
                <p><strong>Authorized Signature</strong></p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Purchase Order Details
            </h2>
            <div className="flex items-center space-x-2">
              {getStatusIcon(purchaseOrder.status)}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(purchaseOrder.status)}`}>
                {purchaseOrder.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-gray-600 hover:text-gray-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-800"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div id="purchase-order-content" className="p-6">
          {/* Company Header */}
          <div className="text-center mb-8 header">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">DDAS</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Digital Daily Account System</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              123 Business Complex, Sector 18, Gurugram, Haryana 122015
            </p>
            <div className="mt-4">
              <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">PURCHASE ORDER</h2>
            </div>
          </div>

          {/* PO Details and Vendor Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* PO Information */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Purchase Order Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">PO Number:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{purchaseOrder.poNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Order Date:</span>
                  <span className="text-gray-900 dark:text-white">{format(purchaseOrder.orderDate, 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Expected Delivery:</span>
                  <span className="text-gray-900 dark:text-white">{format(purchaseOrder.expectedDeliveryDate, 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(purchaseOrder.priority)}`}>
                    {purchaseOrder.priority.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment Terms:</span>
                  <span className="text-gray-900 dark:text-white">
                    {purchaseOrder.paymentTerms.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/net(\d+)/, 'Net $1 days')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">GST Type:</span>
                  <span className="text-gray-900 dark:text-white capitalize">{purchaseOrder.gstType}</span>
                </div>
                {purchaseOrder.approvedBy && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Approved By:</span>
                      <span className="text-gray-900 dark:text-white">{purchaseOrder.approvedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Approved Date:</span>
                      <span className="text-gray-900 dark:text-white">
                        {purchaseOrder.approvedDate ? format(purchaseOrder.approvedDate, 'MMM dd, yyyy') : 'N/A'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Vendor Information */}
            <Card className="p-4 vendor-details">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Vendor Details
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {purchaseOrder.vendor?.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    GST: {purchaseOrder.vendor?.gstNumber}
                  </p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>{purchaseOrder.vendor?.address?.street}</p>
                    <p>{purchaseOrder.vendor?.address?.city}, {purchaseOrder.vendor?.address?.state}</p>
                    <p>{purchaseOrder.vendor?.address?.zipCode}, {purchaseOrder.vendor?.address?.country}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{purchaseOrder.vendor?.phone}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{purchaseOrder.vendor?.email}</span>
                </div>

                {purchaseOrder.contactPerson && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <h5 className="font-medium text-gray-900 dark:text-white">Contact Person</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{purchaseOrder.contactPerson}</p>
                    {purchaseOrder.contactPhone && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{purchaseOrder.contactPhone}</p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="items-table w-full border border-gray-300 dark:border-gray-600 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600">
                      S.No.
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600">
                      Description
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600">
                      HSN/SAC
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600">
                      Unit
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600">
                      GST %
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600">
                      Total
                    </th>
                    {purchaseOrder.items.some(item => item.deliveryDate) && (
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600">
                        Expected Delivery
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrder.items.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-200 dark:border-gray-600">
                      <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        <div>
                          <p className="font-medium">{item.description}</p>
                          {item.specifications && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.specifications}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                        {item.hsnCode || '-'}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                        {item.unit}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-gray-100">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-gray-100">
                        {(item.gstRate * 100).toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {formatCurrency(item.total)}
                      </td>
                      {purchaseOrder.items.some(item => item.deliveryDate) && (
                        <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                          {item.deliveryDate ? format(item.deliveryDate, 'MMM dd, yyyy') : '-'}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary and Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Notes and Terms */}
            <div className="space-y-4">
              {purchaseOrder.notes && (
                <Card className="p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Notes</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{purchaseOrder.notes}</p>
                </Card>
              )}
              
              {purchaseOrder.terms && (
                <Card className="p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Terms & Conditions</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{purchaseOrder.terms}</p>
                </Card>
              )}
            </div>

            {/* Totals */}
            <Card className="p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h4>
              <div className="space-y-3 totals">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(purchaseOrder.subtotal)}</span>
                </div>
                
                {purchaseOrder.gstType === 'intrastate' ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">CGST @ {(purchaseOrder.taxRate * 50).toFixed(1)}%:</span>
                      <span className="text-gray-900 dark:text-white">{formatCurrency(purchaseOrder.cgstAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">SGST @ {(purchaseOrder.taxRate * 50).toFixed(1)}%:</span>
                      <span className="text-gray-900 dark:text-white">{formatCurrency(purchaseOrder.sgstAmount)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">IGST @ {(purchaseOrder.taxRate * 100).toFixed(1)}%:</span>
                    <span className="text-gray-900 dark:text-white">{formatCurrency(purchaseOrder.igstAmount)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-gray-900 dark:text-white">Total Amount:</span>
                    <span className="text-blue-600 dark:text-blue-400">{formatCurrency(purchaseOrder.total)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
