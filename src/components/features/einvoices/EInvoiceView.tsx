import { X, Edit, FileText, QrCode, Building2, User, Calculator, Calendar, Printer } from 'lucide-react';
import { format } from 'date-fns';
import type { EInvoice } from '../../../types/einvoice';

interface EInvoiceViewProps {
  eInvoice?: EInvoice;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (eInvoice: EInvoice) => void;
}

export function EInvoiceView({ eInvoice, isOpen, onClose, onEdit }: EInvoiceViewProps) {
  if (!isOpen || !eInvoice) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getStatusColor = (status: EInvoice['status']) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      case 'Generated':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'Submitted':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200';
      case 'Acknowledged':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'Failed':
      case 'Error':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'Cancelled':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
      default:
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileText size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">E-Invoice Details</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Invoice: {eInvoice.invoiceNumber}
                {eInvoice.irn && (
                  <span className="ml-2">| IRN: {eInvoice.irn.slice(0, 16)}...</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(eInvoice.status)}`}>
              {eInvoice.status}
            </span>
            <button
              onClick={handlePrint}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Print E-Invoice"
            >
              <Printer size={20} />
            </button>
            {eInvoice.status === 'Draft' && (
              <button
                onClick={() => onEdit(eInvoice)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Edit E-Invoice"
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
          {/* Document Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={20} className="text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Document Information</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Invoice Number:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{eInvoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Invoice Date:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {format(eInvoice.invoiceDate, 'dd/MM/yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Document Type:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{eInvoice.documentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Invoice Type:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{eInvoice.invoiceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Place of Supply:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{eInvoice.placeOfSupply}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Reverse Charge:</span>
                  <span className={`font-medium ${eInvoice.reverseCharge ? 'text-red-600' : 'text-green-600'}`}>
                    {eInvoice.reverseCharge ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={20} className="text-green-600 dark:text-green-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">E-Invoice Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Created:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {format(eInvoice.createdAt, 'dd/MM/yyyy HH:mm')}
                  </span>
                </div>
                {eInvoice.irn && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">IRN:</span>
                    <span className="font-mono text-xs text-gray-900 dark:text-white break-all">
                      {eInvoice.irn}
                    </span>
                  </div>
                )}
                {eInvoice.ackNo && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Ack Number:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{eInvoice.ackNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Ack Date:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {format(eInvoice.ackDate, 'dd/MM/yyyy HH:mm')}
                      </span>
                    </div>
                  </>
                )}
                {eInvoice.cancellationDate && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Cancelled:</span>
                      <span className="font-medium text-red-600 dark:text-red-400">
                        {format(eInvoice.cancellationDate, 'dd/MM/yyyy HH:mm')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Cancel Reason:</span>
                      <span className="font-medium text-red-600 dark:text-red-400">{eInvoice.cancellationReason}</span>
                    </div>
                  </>
                )}
                {eInvoice.errorDetails && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Error Details:</span>
                    <div className="mt-1 p-2 bg-red-50 dark:bg-red-900 rounded text-red-700 dark:text-red-300 text-sm">
                      {eInvoice.errorDetails}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Supplier & Buyer Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 size={20} className="text-green-600 dark:text-green-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Supplier Details</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">{eInvoice.supplierLegalName}</span>
                  {eInvoice.supplierTradeName && (
                    <div className="text-gray-600 dark:text-gray-400">Trade: {eInvoice.supplierTradeName}</div>
                  )}
                </div>
                <div className="text-gray-600 dark:text-gray-400">GSTIN: {eInvoice.supplierGstin}</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {eInvoice.supplierAddress1}
                  {eInvoice.supplierAddress2 && <div>{eInvoice.supplierAddress2}</div>}
                  <div>{eInvoice.supplierLocation} - {eInvoice.supplierPincode}</div>
                  <div>State Code: {eInvoice.supplierStateCode}</div>
                </div>
                {eInvoice.supplierPhone && (
                  <div className="text-gray-600 dark:text-gray-400">Phone: {eInvoice.supplierPhone}</div>
                )}
                {eInvoice.supplierEmail && (
                  <div className="text-gray-600 dark:text-gray-400">Email: {eInvoice.supplierEmail}</div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <User size={20} className="text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Buyer Details</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">{eInvoice.buyerLegalName}</span>
                  {eInvoice.buyerTradeName && (
                    <div className="text-gray-600 dark:text-gray-400">Trade: {eInvoice.buyerTradeName}</div>
                  )}
                </div>
                {eInvoice.buyerGstin && (
                  <div className="text-gray-600 dark:text-gray-400">GSTIN: {eInvoice.buyerGstin}</div>
                )}
                <div className="text-gray-600 dark:text-gray-400">Type: {eInvoice.buyerType}</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {eInvoice.buyerAddress1}
                  {eInvoice.buyerAddress2 && <div>{eInvoice.buyerAddress2}</div>}
                  <div>{eInvoice.buyerLocation} - {eInvoice.buyerPincode}</div>
                  <div>State Code: {eInvoice.buyerStateCode}</div>
                </div>
                {eInvoice.buyerPhone && (
                  <div className="text-gray-600 dark:text-gray-400">Phone: {eInvoice.buyerPhone}</div>
                )}
                {eInvoice.buyerEmail && (
                  <div className="text-gray-600 dark:text-gray-400">Email: {eInvoice.buyerEmail}</div>
                )}
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Line Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-600">
                    <th className="text-left py-2">#</th>
                    <th className="text-left py-2">Description</th>
                    <th className="text-left py-2">HSN</th>
                    <th className="text-right py-2">Qty</th>
                    <th className="text-right py-2">Rate</th>
                    <th className="text-right py-2">Amount</th>
                    <th className="text-right py-2">GST%</th>
                    <th className="text-right py-2">GST Amt</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {eInvoice.lineItems.map((item) => (
                    <tr key={item.serialNumber} className="border-b border-gray-200 dark:border-gray-600">
                      <td className="py-3">{item.serialNumber}</td>
                      <td className="py-3">{item.productDescription}</td>
                      <td className="py-3">{item.hsnCode}</td>
                      <td className="py-3 text-right">{item.quantity} {item.unit}</td>
                      <td className="py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-3 text-right">{formatCurrency(item.assessableValue)}</td>
                      <td className="py-3 text-right">{item.gstRate}%</td>
                      <td className="py-3 text-right">
                        {formatCurrency(item.cgstAmount + item.sgstAmount + item.igstAmount)}
                      </td>
                      <td className="py-3 text-right font-medium">{formatCurrency(item.totalItemValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Totals */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator size={20} className="text-orange-600 dark:text-orange-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Invoice Totals</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Taxable Value:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(eInvoice.totalAssessableValue)}
                  </span>
                </div>
                
                {eInvoice.totalCgstValue > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">CGST:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(eInvoice.totalCgstValue)}
                    </span>
                  </div>
                )}
                
                {eInvoice.totalSgstValue > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">SGST:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(eInvoice.totalSgstValue)}
                    </span>
                  </div>
                )}
                
                {eInvoice.totalIgstValue > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">IGST:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(eInvoice.totalIgstValue)}
                    </span>
                  </div>
                )}
                
                {eInvoice.totalCessValue > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Cess:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(eInvoice.totalCessValue)}
                    </span>
                  </div>
                )}
                
                {eInvoice.totalOtherCharges > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Other Charges:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(eInvoice.totalOtherCharges)}
                    </span>
                  </div>
                )}
                
                {eInvoice.roundOffAmount !== 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Round Off:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(eInvoice.roundOffAmount)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="border-l border-gray-300 dark:border-gray-600 pl-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Invoice Value:</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(eInvoice.totalInvoiceValue)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Amount in Words:</strong><br />
                  {eInvoice.totalInvoiceValueInWords}
                </div>
              </div>
            </div>
          </div>

          {/* Payment and Transport Details */}
          {(eInvoice.paymentTerms || eInvoice.transporterName || eInvoice.vehicleNumber) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {eInvoice.paymentTerms && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Payment Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Payment Terms:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{eInvoice.paymentTerms}</span>
                    </div>
                    {eInvoice.paymentDueDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Due Date:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {format(eInvoice.paymentDueDate, 'dd/MM/yyyy')}
                        </span>
                      </div>
                    )}
                    {eInvoice.advancePaid && eInvoice.advancePaid > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Advance Paid:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(eInvoice.advancePaid)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(eInvoice.transporterName || eInvoice.vehicleNumber) && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Transport Details</h3>
                  <div className="space-y-2 text-sm">
                    {eInvoice.transportMode && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Transport Mode:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{eInvoice.transportMode}</span>
                      </div>
                    )}
                    {eInvoice.transporterName && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Transporter:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{eInvoice.transporterName}</span>
                      </div>
                    )}
                    {eInvoice.vehicleNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Vehicle Number:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{eInvoice.vehicleNumber}</span>
                      </div>
                    )}
                    {eInvoice.distance && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Distance:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{eInvoice.distance} km</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* QR Code */}
          {eInvoice.qrCodeData && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <QrCode size={20} className="text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">QR Code Data</h3>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded border font-mono text-xs break-all">
                {eInvoice.qrCodeData}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                This QR code contains the IRN and other invoice details as per GST requirements.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {eInvoice.status === 'Draft' && (
              <button
                onClick={() => onEdit(eInvoice)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Edit size={16} />
                Edit E-Invoice
              </button>
            )}
            <button
              onClick={handlePrint}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Printer size={16} />
              Print
            </button>
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
