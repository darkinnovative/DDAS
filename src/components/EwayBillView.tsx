import { X, Edit, FileText, MapPin, Truck, Package, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import type { EwayBill } from '../types/eway';

interface EwayBillViewProps {
  bill?: EwayBill;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (bill: EwayBill) => void;
}

export function EwayBillView({ bill, isOpen, onClose, onEdit }: EwayBillViewProps) {
  if (!isOpen || !bill) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getStatusColor = (status: EwayBill['status']) => {
    switch (status) {
      case 'Generated':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'Active':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'Cancelled':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'Expired':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileText size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">E-way Bill Details</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">EWB No: {bill.ewayBillNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(bill.status)}`}>
              {bill.status}
            </span>
            {bill.status !== 'Cancelled' && (
              <button
                onClick={() => onEdit(bill)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Edit E-way Bill"
              >
                <Edit size={20} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={18} className="text-gray-600 dark:text-gray-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Document Information</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Document Type:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{bill.documentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Document Number:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{bill.documentNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Document Date:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {format(bill.documentDate, 'dd/MM/yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Invoice Number:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{bill.invoiceNumber}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={18} className="text-gray-600 dark:text-gray-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">E-way Bill Status</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Generated Date:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {format(bill.generatedDate, 'dd/MM/yyyy HH:mm')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Valid Till:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {format(bill.validUpto, 'dd/MM/yyyy HH:mm')}
                  </span>
                </div>
                {bill.cancelledDate && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Cancelled Date:</span>
                      <span className="font-medium text-red-600 dark:text-red-400">
                        {format(bill.cancelledDate, 'dd/MM/yyyy HH:mm')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Cancel Reason:</span>
                      <span className="font-medium text-red-600 dark:text-red-400">{bill.cancelReason}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User size={18} className="text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Customer Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Customer Name:</span>
                <div className="font-medium text-gray-900 dark:text-white">{bill.customerName}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Customer GSTIN:</span>
                <div className="font-medium text-gray-900 dark:text-white">{bill.customerGstin}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Supplier GSTIN:</span>
                <div className="font-medium text-gray-900 dark:text-white">{bill.supplierGstin}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Transaction Type:</span>
                <div className="font-medium text-gray-900 dark:text-white">{bill.transactionType}</div>
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={18} className="text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Address Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">From (Supplier)</h4>
                <div className="text-sm space-y-1">
                  <div><span className="text-gray-600 dark:text-gray-400">State:</span> {bill.fromState}</div>
                  <div><span className="text-gray-600 dark:text-gray-400">State Code:</span> {bill.fromStateCode}</div>
                  <div><span className="text-gray-600 dark:text-gray-400">Pincode:</span> {bill.fromPincode}</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">To (Recipient)</h4>
                <div className="text-sm space-y-1">
                  <div><span className="text-gray-600 dark:text-gray-400">State:</span> {bill.toState}</div>
                  <div><span className="text-gray-600 dark:text-gray-400">State Code:</span> {bill.toStateCode}</div>
                  <div><span className="text-gray-600 dark:text-gray-400">Pincode:</span> {bill.toPincode}</div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm">
              <span className="text-gray-600 dark:text-gray-400">Approximate Distance:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">{bill.approxDistance} km</span>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Package size={18} className="text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Product Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Product Type:</span>
                <div className="font-medium text-gray-900 dark:text-white">{bill.productType}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">HSN Code:</span>
                <div className="font-medium text-gray-900 dark:text-white">{bill.hsnCode}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Product Name:</span>
                <div className="font-medium text-gray-900 dark:text-white">{bill.productName}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Quantity:</span>
                <div className="font-medium text-gray-900 dark:text-white">{bill.quantity} {bill.qtyUnit}</div>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-600 dark:text-gray-400">Description:</span>
                <div className="font-medium text-gray-900 dark:text-white">{bill.productDesc}</div>
              </div>
            </div>
          </div>

          {/* Transport Details */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Truck size={18} className="text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Transport Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Transport Mode:</span>
                <div className="font-medium text-gray-900 dark:text-white">{bill.transportMode}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Vehicle Type:</span>
                <div className="font-medium text-gray-900 dark:text-white">{bill.vehicleType}</div>
              </div>
              {bill.transporterName && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Transporter:</span>
                  <div className="font-medium text-gray-900 dark:text-white">{bill.transporterName}</div>
                </div>
              )}
              {bill.vehicleNumber && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Vehicle Number:</span>
                  <div className="font-medium text-gray-900 dark:text-white">{bill.vehicleNumber}</div>
                </div>
              )}
            </div>
          </div>

          {/* Value Breakdown */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Value Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Taxable Value:</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(bill.taxableValue)}</span>
              </div>
              
              {bill.cgstAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">CGST ({bill.cgstRate}%):</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(bill.cgstAmount)}</span>
                </div>
              )}
              
              {bill.sgstAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">SGST ({bill.sgstRate}%):</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(bill.sgstAmount)}</span>
                </div>
              )}
              
              {bill.igstAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">IGST ({bill.igstRate}%):</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(bill.igstAmount)}</span>
                </div>
              )}
              
              {bill.cessAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Cess ({bill.cessRate}%):</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(bill.cessAmount)}</span>
                </div>
              )}
              
              <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-gray-900 dark:text-white">Total Invoice Value:</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(bill.totalInvoiceValue)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {bill.status !== 'Cancelled' && (
              <button
                onClick={() => onEdit(bill)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Edit size={16} />
                Edit E-way Bill
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
