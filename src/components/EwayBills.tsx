import { useState } from 'react';
import { useEwayBill } from '../context/EwayBillContext';
import { useBilling } from '../context/BillingContext';
import { 
  Plus, 
  Search, 
  FileText, 
  Truck, 
  Eye, 
  Edit, 
  X as XIcon, 
  Calendar,
  MapPin,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { EwayBillForm } from './EwayBillForm';
import { EwayBillView } from './EwayBillView';
import type { EwayBill } from '../types/eway';

export function EwayBills() {
  const { ewayBills, getEwayBillSummary, cancelEwayBill } = useEwayBill();
  const { invoices } = useBilling();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<EwayBill | undefined>(undefined);
  const [editingBill, setEditingBill] = useState<EwayBill | undefined>(undefined);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingBill, setCancellingBill] = useState<EwayBill | undefined>(undefined);
  const [cancelReason, setCancelReason] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const filteredBills = ewayBills.filter(bill => {
    const matchesSearch = 
      bill.ewayBillNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase() || '');
    
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateBill = () => {
    setEditingBill(undefined);
    setIsFormOpen(true);
  };

  const handleEditBill = (bill: EwayBill) => {
    setEditingBill(bill);
    setIsFormOpen(true);
  };

  const handleViewBill = (bill: EwayBill) => {
    setSelectedBill(bill);
    setIsViewOpen(true);
  };

  const handleCancelBill = (bill: EwayBill) => {
    setCancellingBill(bill);
    setShowCancelModal(true);
  };

  const confirmCancelBill = () => {
    if (cancellingBill && cancelReason.trim()) {
      cancelEwayBill(cancellingBill.id, cancelReason, 'Admin User');
      setShowCancelModal(false);
      setCancellingBill(undefined);
      setCancelReason('');
    }
  };

  const getStatusIcon = (status: EwayBill['status']) => {
    switch (status) {
      case 'Generated':
        return <Clock size={16} className="text-blue-500" />;
      case 'Active':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'Cancelled':
        return <XCircle size={16} className="text-red-500" />;
      case 'Expired':
        return <AlertCircle size={16} className="text-orange-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
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

  // Calculate statistics
  const stats = getEwayBillSummary();

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">E-way Bill Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Generate and manage E-way bills for goods transportation</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCreateBill}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Generate E-way Bill
          </button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileText size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Generated</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalGenerated}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalActive}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <XCircle size={20} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCancelled}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Package size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search E-way bills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Generated">Generated</option>
            <option value="Active">Active</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* E-way Bills Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredBills.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">E-way Bill</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transport</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Valid Till</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredBills.map((bill) => {
                  const isExpiringSoon = new Date(bill.validUpto) < new Date(Date.now() + 24 * 60 * 60 * 1000);
                  
                  return (
                    <tr key={bill.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">{bill.ewayBillNumber}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{format(bill.generatedDate, 'MMM dd, yyyy')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">{bill.invoiceNumber}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{bill.documentType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">{bill.customerName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{bill.customerGstin}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin size={14} className="text-gray-400" />
                          <span className="text-gray-900 dark:text-white">{bill.fromState} → {bill.toState}</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{bill.approxDistance} km</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm">
                          <Truck size={14} className="text-gray-400" />
                          <span className="text-gray-900 dark:text-white">{bill.vehicleNumber}</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{bill.transportMode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900 dark:text-white font-semibold">{formatCurrency(bill.totalInvoiceValue)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Taxable: {formatCurrency(bill.taxableValue)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${isExpiringSoon && bill.status === 'Active' ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-900 dark:text-white'}`}>
                          {format(bill.validUpto, 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {format(bill.validUpto, 'HH:mm')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(bill.status)}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bill.status)}`}>
                            {bill.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => handleViewBill(bill)}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          {bill.status !== 'Cancelled' && (
                            <button 
                              onClick={() => handleEditBill(bill)}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                          )}
                          {(bill.status === 'Generated' || bill.status === 'Active') && (
                            <button 
                              onClick={() => handleCancelBill(bill)}
                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                              title="Cancel E-way Bill"
                            >
                              <XIcon size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="flex flex-col items-center">
              <FileText size={48} className="text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No E-way bills found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Generate your first E-way bill to get started</p>
              <button 
                onClick={handleCreateBill}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                Generate E-way Bill
              </button>
            </div>
          </div>
        )}
      </div>

      {/* E-way Bill Form Modal */}
      <EwayBillForm
        bill={editingBill}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBill(undefined);
        }}
      />

      {/* E-way Bill View Modal */}
      <EwayBillView
        bill={selectedBill}
        isOpen={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setSelectedBill(undefined);
        }}
        onEdit={handleEditBill}
      />

      {/* Cancel E-way Bill Modal */}
      {showCancelModal && cancellingBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <XIcon size={24} className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cancel E-way Bill</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">E-way Bill: {cancellingBill.ewayBillNumber}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cancellation Reason
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter reason for cancellation..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancellingBill(undefined);
                    setCancelReason('');
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCancelBill}
                  disabled={!cancelReason.trim()}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
