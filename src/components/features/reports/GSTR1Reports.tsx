import { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { FileSpreadsheet, Download, Filter, Calendar, FileText } from 'lucide-react';

export function GSTR1Reports() {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('2025');

  const gstr1Data = [
    {
      gstin: '27ABCDE1234F1Z5',
      customerName: 'ABC Corp',
      invoiceNo: 'INV-001',
      invoiceDate: '2025-01-15',
      invoiceValue: 147500,
      place: 'Maharashtra',
      rate: 18,
      taxableValue: 125000,
      cgst: 11250,
      sgst: 11250,
      igst: 0
    },
    {
      gstin: '06XYZAB5678G1H9',
      customerName: 'XYZ Ltd',
      invoiceNo: 'INV-002',
      invoiceDate: '2025-01-14',
      invoiceValue: 103250,
      place: 'Haryana',
      rate: 18,
      taxableValue: 87500,
      cgst: 0,
      sgst: 0,
      igst: 15750
    }
  ];

  const handleExport = (format: 'pdf' | 'excel' | 'json') => {
    console.log(`Exporting GSTR1 report as ${format}`);
  };

  const handleFileGSTR1 = () => {
    console.log('Filing GSTR1 return...');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">GSTR-1 Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Goods and Services Tax Return - Outward Supplies
          </p>
        </div>
        <FileSpreadsheet size={32} className="text-orange-500" />
      </div>

      {/* Period Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Tax Period</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              label="Month"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              icon={<Calendar size={16} />}
            />
          </div>
          <div>
            <Input
              label="Year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="2020"
              max="2030"
            />
          </div>
          <div className="flex items-end">
            <Button variant="primary" className="w-full">
              <Filter size={16} />
              Generate Report
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ₹2,50,750
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium mt-2">Total Invoice Value</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            ₹2,12,500
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium mt-2">Taxable Value</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            ₹22,500
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium mt-2">Total Tax</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            2
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium mt-2">Total Invoices</div>
        </Card>
      </div>

      {/* GSTR1 Table */}
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">GSTR-1 Details</h3>
            <div className="flex gap-2">
              <Button variant="primary" onClick={handleFileGSTR1}>
                <FileText size={16} />
                File GSTR-1
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                <Download size={16} />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
                <Download size={16} />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
                <Download size={16} />
                JSON
              </Button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">GSTIN</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Customer</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Invoice No</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Date</th>
                <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Taxable Value</th>
                <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Rate %</th>
                <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">CGST</th>
                <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">SGST</th>
                <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">IGST</th>
                <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Total Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {gstr1Data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-4 font-mono text-sm text-gray-900 dark:text-white">{item.gstin}</td>
                  <td className="p-4 text-gray-700 dark:text-gray-300">{item.customerName}</td>
                  <td className="p-4 text-gray-700 dark:text-gray-300">{item.invoiceNo}</td>
                  <td className="p-4 text-gray-700 dark:text-gray-300">{item.invoiceDate}</td>
                  <td className="p-4 text-right text-gray-900 dark:text-white">₹{item.taxableValue.toLocaleString()}</td>
                  <td className="p-4 text-right text-gray-900 dark:text-white">{item.rate}%</td>
                  <td className="p-4 text-right text-gray-900 dark:text-white">₹{item.cgst.toLocaleString()}</td>
                  <td className="p-4 text-right text-gray-900 dark:text-white">₹{item.sgst.toLocaleString()}</td>
                  <td className="p-4 text-right text-gray-900 dark:text-white">₹{item.igst.toLocaleString()}</td>
                  <td className="p-4 text-right font-semibold text-gray-900 dark:text-white">₹{item.invoiceValue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Important Notes */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Important Notes</h3>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p>• GSTR-1 must be filed by the 11th of every month for the previous month</p>
          <p>• Ensure all invoice details are accurate before filing</p>
          <p>• Late filing may attract penalties as per GST rules</p>
          <p>• Keep backup of all supporting documents</p>
        </div>
      </Card>
    </div>
  );
}
