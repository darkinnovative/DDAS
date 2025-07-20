import { useBilling } from '../context/BillingContext';
import { useEInvoice } from '../context/EInvoiceContext';
import { useEwayBill } from '../context/EwayBillContext';
import { 
  DollarSign, 
  FileText, 
  CreditCard, 
  Receipt, 
  Truck, 
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  BarChart3,
  Activity
} from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export function Dashboard() {
  const { getDashboardStats } = useBilling();
  const { eInvoices } = useEInvoice();
  const { ewayBills } = useEwayBill();
  
  const billingStats = getDashboardStats();
  
  // Calculate current month data
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const currentMonthInvoices = billingStats.recentInvoices.filter(invoice => 
    invoice.issueDate >= monthStart && invoice.issueDate <= monthEnd
  );
  
  const currentMonthRevenue = currentMonthInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const avgInvoiceValue = billingStats.totalInvoices > 0 ? billingStats.totalRevenue / billingStats.totalInvoices : 0;
  
  // GST Statistics
  const totalGSTCollected = billingStats.recentInvoices.reduce((sum, invoice) => 
    sum + (invoice.cgstAmount || 0) + (invoice.sgstAmount || 0) + (invoice.igstAmount || 0), 0
  );
  
  // E-Invoice Statistics
  const eInvoiceStats = {
    total: eInvoices.length,
    acknowledged: eInvoices.filter(ei => ei.status === 'Acknowledged').length,
    draft: eInvoices.filter(ei => ei.status === 'Draft').length,
    failed: eInvoices.filter(ei => ei.status === 'Failed' || ei.status === 'Error').length,
  };
  
  // E-way Bill Statistics
  const ewayBillStats = {
    total: ewayBills.length,
    active: ewayBills.filter(eb => eb.status === 'Active').length,
    generated: ewayBills.filter(eb => eb.status === 'Generated').length,
    expired: ewayBills.filter(eb => eb.status === 'Expired').length,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getStatusStyles = (status: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
      case 'acknowledged':
      case 'active':
        return `${baseClasses} bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200`;
      case 'pending':
      case 'generated':
        return `${baseClasses} bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200`;
      case 'overdue':
      case 'expired':
      case 'failed':
      case 'error':
        return `${baseClasses} bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200`;
      case 'draft':
        return `${baseClasses} bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200`;
      case 'cancelled':
        return `${baseClasses} bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200`;
      default:
        return `${baseClasses} bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200`;
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome back! Here's what's happening with your business today.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(), 'EEEE, MMMM dd, yyyy')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {format(new Date(), 'HH:mm')}
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(billingStats.totalRevenue)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  This Month: {formatCurrency(currentMonthRevenue)}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-xl">
                <DollarSign size={32} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <ArrowUpRight size={16} className="text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">12.5% from last month</span>
            </div>
          </div>

          {/* Total Invoices */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Invoices</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{billingStats.totalInvoices}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Paid: {billingStats.paidInvoices} | Pending: {billingStats.totalInvoices - billingStats.paidInvoices}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-xl">
                <FileText size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <ArrowUpRight size={16} className="text-blue-500 mr-1" />
              <span className="text-blue-500 text-sm font-medium">8 new this month</span>
            </div>
          </div>

          {/* GST Collected */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">GST Collected</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalGSTCollected)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Tax Rate: {billingStats.totalRevenue > 0 ? ((totalGSTCollected / billingStats.totalRevenue) * 100).toFixed(1) : '0.0'}%
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-xl">
                <BarChart3 size={32} className="text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <ArrowUpRight size={16} className="text-purple-500 mr-1" />
              <span className="text-purple-500 text-sm font-medium">GST Compliance Active</span>
            </div>
          </div>

          {/* Average Invoice Value */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Avg Invoice Value</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(avgInvoiceValue)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Customers: {billingStats.totalCustomers}
                </p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900 p-4 rounded-xl">
                <TrendingUp size={32} className="text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <ArrowUpRight size={16} className="text-orange-500 mr-1" />
              <span className="text-orange-500 text-sm font-medium">5.2% increase</span>
            </div>
          </div>
        </div>

        {/* GST Compliance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* E-Invoice Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Receipt size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">E-Invoice Status</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Electronic invoice compliance</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{eInvoiceStats.total}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total E-Invoices</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{eInvoiceStats.acknowledged}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Acknowledged</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Acknowledged</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{eInvoiceStats.acknowledged}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-yellow-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Draft</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{eInvoiceStats.draft}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-red-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Failed</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{eInvoiceStats.failed}</span>
              </div>
            </div>
          </div>

          {/* E-way Bill Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Truck size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">E-way Bill Status</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Transport document tracking</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{ewayBillStats.total}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total E-way Bills</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{ewayBillStats.active}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-blue-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{ewayBillStats.active}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-yellow-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Generated</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{ewayBillStats.generated}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-red-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Expired</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{ewayBillStats.expired}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Recent Invoices */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Invoices</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Latest billing activity</p>
            </div>
            <div className="overflow-hidden">
              {billingStats.recentInvoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Invoice #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {billingStats.recentInvoices.slice(0, 5).map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {invoice.invoiceNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {invoice.customer?.name || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(invoice.total)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={getStatusStyles(invoice.status)}>
                              {invoice.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No invoices yet. Create your first invoice!</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Payments</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Latest payment activity</p>
            </div>
            <div className="overflow-hidden">
              {billingStats.recentPayments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Payment ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {billingStats.recentPayments.slice(0, 5).map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            #{payment.id.slice(0, 8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {payment.paymentMethod.replace('_', ' ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={getStatusStyles(payment.status)}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No payments yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to grow your business?</h2>
              <p className="text-blue-100 mb-4">
                Create invoices, manage customers, and track GST compliance all in one place.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Create Invoice
                </button>
                <button className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors">
                  Generate E-Invoice
                </button>
                <button className="bg-purple-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-800 transition-colors">
                  Create E-way Bill
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <TrendingUp size={64} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}