import { useState, useEffect } from 'react';
import { Plus, Search, Filter, FileText, CheckCircle, XCircle, Clock, AlertTriangle, Eye, Edit, Send, X } from 'lucide-react';
import { format } from 'date-fns';
import { useEInvoice } from '../../../context/EInvoiceContext';
import { EInvoiceForm } from './EInvoiceForm';
import { EInvoiceView } from './EInvoiceView';
import type { EInvoice, EInvoiceStatus } from '../../../types/einvoice';

export function EInvoices() {
  const {
    eInvoices,
    submitEInvoice,
    cancelEInvoice,
    searchEInvoices,
    getEInvoicesByStatus
  } = useEInvoice();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EInvoiceStatus | 'All'>('All');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedEInvoice, setSelectedEInvoice] = useState<EInvoice | null>(null);
  const [editingEInvoice, setEditingEInvoice] = useState<EInvoice | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [filteredEInvoices, setFilteredEInvoices] = useState<EInvoice[]>(eInvoices);

  useEffect(() => {
    let filtered = eInvoices;

    if (searchTerm) {
      filtered = searchEInvoices(searchTerm);
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(eInvoice => eInvoice.status === statusFilter);
    }

    setFilteredEInvoices(filtered);
  }, [eInvoices, searchTerm, statusFilter, searchEInvoices]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getStatusIcon = (status: EInvoiceStatus) => {
    switch (status) {
      case 'Draft':
        return <Edit size={16} className="text-gray-500" />;
      case 'Generated':
        return <FileText size={16} className="text-blue-500" />;
      case 'Submitted':
        return <Send size={16} className="text-orange-500" />;
      case 'Acknowledged':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'Failed':
      case 'Error':
        return <XCircle size={16} className="text-red-500" />;
      case 'Cancelled':
        return <X size={16} className="text-gray-500" />;
      default:
        return <Clock size={16} className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status: EInvoiceStatus) => {
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

  const handleSubmitEInvoice = async (eInvoice: EInvoice) => {
    try {
      await submitEInvoice(eInvoice.id);
    } catch (error) {
      console.error('Failed to submit E-Invoice:', error);
    }
  };

  const handleCancelEInvoice = async () => {
    if (!selectedEInvoice || !cancelReason.trim()) return;
    
    try {
      await cancelEInvoice(selectedEInvoice.id, cancelReason);
      setShowCancelModal(false);
      setSelectedEInvoice(null);
      setCancelReason('');
    } catch (error) {
      console.error('Failed to cancel E-Invoice:', error);
    }
  };

  const handleView = (eInvoice: EInvoice) => {
    setSelectedEInvoice(eInvoice);
    setShowViewModal(true);
  };

  const handleEdit = (eInvoice: EInvoice) => {
    setEditingEInvoice(eInvoice);
    setShowCreateForm(true);
  };

  const handleCancel = (eInvoice: EInvoice) => {
    setSelectedEInvoice(eInvoice);
    setShowCancelModal(true);
  };

  const statusStats = {
    total: eInvoices.length,
    draft: getEInvoicesByStatus('Draft').length,
    acknowledged: getEInvoicesByStatus('Acknowledged').length,
    failed: getEInvoicesByStatus('Failed').length + getEInvoicesByStatus('Error').length,
    cancelled: getEInvoicesByStatus('Cancelled').length
  };

  if (showCreateForm) {
    return (
      <EInvoiceForm
        eInvoice={editingEInvoice}
        onSave={() => {
          setShowCreateForm(false);
          setEditingEInvoice(null);
        }}
        onCancel={() => {
          setShowCreateForm(false);
          setEditingEInvoice(null);
        }}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">E-Invoices</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your electronic invoices for GST compliance
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transition-all hover:shadow-xl"
            >
              <Plus size={20} />
              Generate E-Invoice
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FileText size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusStats.total}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total E-Invoices</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusStats.acknowledged}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Acknowledged</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Edit size={24} className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusStats.draft}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Draft</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                  <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusStats.failed}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Failed/Error</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by invoice number, IRN, buyer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as EInvoiceStatus | 'All')}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Generated">Generated</option>
                <option value="Submitted">Submitted</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="Failed">Failed</option>
                <option value="Error">Error</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* E-Invoices Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Invoice Details</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Buyer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">IRN / Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Dates</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEInvoices.map((eInvoice, index) => (
                  <tr
                    key={eInvoice.id}
                    className={`border-t border-gray-200 dark:border-gray-700 ${
                      index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'
                    } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                  >
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {eInvoice.invoiceNumber}
                          </span>
                          <span className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {eInvoice.documentType}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {format(eInvoice.invoiceDate, 'dd/MM/yyyy')}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {eInvoice.buyerLegalName}
                        </div>
                        {eInvoice.buyerGstin && (
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            GSTIN: {eInvoice.buyerGstin}
                          </div>
                        )}
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {eInvoice.buyerLocation}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(eInvoice.totalInvoiceValue)}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Taxable: {formatCurrency(eInvoice.totalAssessableValue)}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(eInvoice.status)}
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(eInvoice.status)}`}>
                            {eInvoice.status}
                          </span>
                        </div>
                        {eInvoice.irn && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                            IRN: {eInvoice.irn.slice(0, 20)}...
                          </div>
                        )}
                        {eInvoice.ackNo && (
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Ack: {eInvoice.ackNo}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                        <div>Created: {format(eInvoice.createdAt, 'dd/MM/yy')}</div>
                        {eInvoice.ackDate && (
                          <div>Ack: {format(eInvoice.ackDate, 'dd/MM/yy')}</div>
                        )}
                        {eInvoice.cancellationDate && (
                          <div className="text-red-600 dark:text-red-400">
                            Cancelled: {format(eInvoice.cancellationDate, 'dd/MM/yy')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(eInvoice)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          title="View E-Invoice"
                        >
                          <Eye size={16} />
                        </button>
                        {eInvoice.status === 'Draft' && (
                          <button
                            onClick={() => handleEdit(eInvoice)}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                            title="Edit E-Invoice"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {(eInvoice.status === 'Generated' || eInvoice.status === 'Draft') && (
                          <button
                            onClick={() => handleSubmitEInvoice(eInvoice)}
                            className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors"
                            title="Submit E-Invoice"
                          >
                            <Send size={16} />
                          </button>
                        )}
                        {eInvoice.status === 'Acknowledged' && (
                          <button
                            onClick={() => handleCancel(eInvoice)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                            title="Cancel E-Invoice"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEInvoices.length === 0 && (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No E-Invoices Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm || statusFilter !== 'All' 
                  ? 'No e-invoices match your search criteria.' 
                  : 'Get started by creating your first e-invoice.'
                }
              </p>
              {!searchTerm && statusFilter === 'All' && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                >
                  <Plus size={16} />
                  Generate E-Invoice
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showViewModal && selectedEInvoice && (
        <EInvoiceView
          eInvoice={selectedEInvoice}
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedEInvoice(null);
          }}
          onEdit={handleEdit}
        />
      )}

      {showCancelModal && selectedEInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Cancel E-Invoice
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to cancel E-Invoice {selectedEInvoice.invoiceNumber}?
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cancellation Reason <span className="text-red-500">*</span>
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select reason</option>
                  <option value="Duplicate">Duplicate</option>
                  <option value="Data Entry Error">Data Entry Error</option>
                  <option value="Order Cancelled">Order Cancelled</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelEInvoice}
                  disabled={!cancelReason.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel E-Invoice
                </button>
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setSelectedEInvoice(null);
                    setCancelReason('');
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
