import { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Edit, Trash2, CreditCard, Filter, Calendar, TrendingUp, CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';

export function Payments() {
  const { payments, invoices, deletePayment } = useBilling();
  const { isDarkMode } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const filteredPayments = payments.filter(payment => {
    const invoice = invoices.find(i => i.id === payment.invoiceId);
    const invoiceNumber = invoice?.invoiceNumber || '';
    
    const matchesSearch = 
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDeletePayment = (id: string) => {
    if (confirm('Are you sure you want to delete this payment?')) {
      deletePayment(id);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-600" />;
      case 'failed':
        return <XCircle size={16} className="text-red-600" />;
      case 'refunded':
        return <RotateCcw size={16} className="text-blue-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalPayments = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedPayments = filteredPayments.filter(p => p.status === 'completed');
  const pendingPayments = filteredPayments.filter(p => p.status === 'pending');

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-emerald-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Payments</h1>
          <p className="text-gray-600">Track and manage all payment transactions</p>
        </div>
        <button className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 
                         text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 
                         flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          <Plus size={20} />
          Record Payment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Payments */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Amount</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(totalPayments)}</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">
                <span className="inline-flex items-center gap-1">
                  <TrendingUp size={14} />
                  All payments
                </span>
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-xl shadow-lg">
              <CreditCard size={28} className="text-white" />
            </div>
          </div>
        </div>

        {/* Completed Payments */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Completed</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{completedPayments.length}</p>
              <p className="text-xs text-green-600 font-medium mt-1">
                {formatCurrency(completedPayments.reduce((sum, p) => sum + p.amount, 0))}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-xl shadow-lg">
              <CheckCircle size={28} className="text-white" />
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingPayments.length}</p>
              <p className="text-xs text-yellow-600 font-medium mt-1">
                {formatCurrency(pendingPayments.reduce((sum, p) => sum + p.amount, 0))}
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-4 rounded-xl shadow-lg">
              <Clock size={28} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Payments</label>
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by payment ID, invoice, or method..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                         transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="lg:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
            <div className="relative">
              <Filter size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                         transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {filteredPayments.length > 0 ? (
          <>
            {/* Mobile Card View */}
            <div className="block lg:hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Payment History ({filteredPayments.length})</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => {
                  const invoice = invoices.find(i => i.id === payment.invoiceId);
                  return (
                    <div key={payment.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg">#{payment.id.slice(0, 8)}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Invoice: {invoice?.invoiceNumber || 'Unknown'}
                          </p>
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border mt-2 ${getStatusStyles(payment.status)}`}>
                            {getStatusIcon(payment.status)}
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                            <Edit size={18} />
                          </button>
                          <button 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            onClick={() => handleDeletePayment(payment.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Amount:</span>
                          <span className="ml-2 font-bold text-emerald-600 text-lg">{formatCurrency(payment.amount)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Method:</span>
                          <span className="ml-2 font-medium text-gray-900 capitalize">
                            {payment.paymentMethod.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600">Date:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            <Calendar size={14} className="inline mr-1" />
                            {format(payment.paymentDate, 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => {
                    const invoice = invoices.find(i => i.id === payment.invoiceId);
                    return (
                      <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-mono text-sm font-semibold text-gray-900">
                            #{payment.id.slice(0, 8)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {invoice?.invoiceNumber || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-bold text-emerald-600">
                            {formatCurrency(payment.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {payment.paymentMethod.replace('_', ' ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            {format(payment.paymentDate, 'MMM dd, yyyy')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyles(payment.status)}`}>
                            {getStatusIcon(payment.status)}
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit">
                              <Edit size={16} />
                            </button>
                            <button 
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                              title="Delete"
                              onClick={() => handleDeletePayment(payment.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <CreditCard size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search criteria or filters'
                : 'Record your first payment to get started tracking transactions'
              }
            </p>
            <button className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 
                           text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 
                           inline-flex items-center gap-2 shadow-lg hover:shadow-xl">
              <Plus size={20} />
              Record First Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
