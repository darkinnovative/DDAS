import { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { FileBarChart, Download, Filter, Search, Calendar } from 'lucide-react';

export function SalesReports() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const salesData = [
    {
      id: 'INV-001',
      customerName: 'ABC Corp',
      date: '2025-01-15',
      amount: 125000,
      tax: 22500,
      total: 147500,
      status: 'Paid'
    },
    {
      id: 'INV-002',
      customerName: 'XYZ Ltd',
      date: '2025-01-14',
      amount: 87500,
      tax: 15750,
      total: 103250,
      status: 'Pending'
    },
    {
      id: 'INV-003',
      customerName: 'PQR Industries',
      date: '2025-01-13',
      amount: 210000,
      tax: 37800,
      total: 247800,
      status: 'Paid'
    }
  ];

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    // Export functionality to be implemented
    console.log(`Exporting sales report as ${format}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and analyze your sales performance
          </p>
        </div>
        <FileBarChart size={32} className="text-blue-500" />
      </div>

      {/* Filters */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filter Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              label="From Date"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              icon={<Calendar size={16} />}
            />
          </div>
          <div>
            <Input
              label="To Date"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              icon={<Calendar size={16} />}
            />
          </div>
          <div>
            <Input
              label="Search Customer"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={16} />}
              placeholder="Enter customer name"
            />
          </div>
          <div className="flex items-end">
            <Button variant="primary" className="w-full">
              <Filter size={16} />
              Apply Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            ₹4,98,550
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium mt-2">Total Sales</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            ₹76,050
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium mt-2">Total Tax</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            3
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium mt-2">Total Invoices</div>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Details</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                <Download size={16} />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
                <Download size={16} />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                <Download size={16} />
                CSV
              </Button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Invoice ID</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Customer</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Date</th>
                <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Amount</th>
                <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Tax</th>
                <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Total</th>
                <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {salesData.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">{sale.id}</td>
                  <td className="p-4 text-gray-700 dark:text-gray-300">{sale.customerName}</td>
                  <td className="p-4 text-gray-700 dark:text-gray-300">{sale.date}</td>
                  <td className="p-4 text-right text-gray-900 dark:text-white">₹{sale.amount.toLocaleString()}</td>
                  <td className="p-4 text-right text-gray-900 dark:text-white">₹{sale.tax.toLocaleString()}</td>
                  <td className="p-4 text-right font-semibold text-gray-900 dark:text-white">₹{sale.total.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      sale.status === 'Paid' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
