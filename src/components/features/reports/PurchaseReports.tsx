import { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { ShoppingBag, Download, Filter, Search, Calendar } from 'lucide-react';

export function PurchaseReports() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const purchaseData = [
    {
      id: 'PO-001',
      vendorName: 'Tech Solutions Pvt Ltd',
      date: '2025-01-15',
      amount: 85000,
      tax: 15300,
      total: 100300,
      status: 'Received'
    },
    {
      id: 'PO-002',
      vendorName: 'Office Supplies Co',
      date: '2025-01-14',
      amount: 42500,
      tax: 7650,
      total: 50150,
      status: 'Pending'
    },
    {
      id: 'PO-003',
      vendorName: 'Equipment Dealers',
      date: '2025-01-13',
      amount: 165000,
      tax: 29700,
      total: 194700,
      status: 'Received'
    }
  ];

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting purchase report as ${format}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Purchase Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor and analyze your purchase transactions
          </p>
        </div>
        <ShoppingBag size={32} className="text-green-500" />
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
              label="Search Vendor"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={16} />}
              placeholder="Enter vendor name"
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
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            ₹3,45,150
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium mt-2">Total Purchases</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            ₹52,650
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium mt-2">Total Tax</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            3
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium mt-2">Total Orders</div>
        </Card>
      </div>

      {/* Purchase Table */}
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Purchase Details</h3>
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
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Order ID</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Vendor</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Date</th>
                <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Amount</th>
                <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Tax</th>
                <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Total</th>
                <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {purchaseData.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">{purchase.id}</td>
                  <td className="p-4 text-gray-700 dark:text-gray-300">{purchase.vendorName}</td>
                  <td className="p-4 text-gray-700 dark:text-gray-300">{purchase.date}</td>
                  <td className="p-4 text-right text-gray-900 dark:text-white">₹{purchase.amount.toLocaleString()}</td>
                  <td className="p-4 text-right text-gray-900 dark:text-white">₹{purchase.tax.toLocaleString()}</td>
                  <td className="p-4 text-right font-semibold text-gray-900 dark:text-white">₹{purchase.total.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      purchase.status === 'Received' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                    }`}>
                      {purchase.status}
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
