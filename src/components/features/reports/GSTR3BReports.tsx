import { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { ClipboardList, Download, Filter, Calendar, FileText, AlertCircle } from 'lucide-react';

export function GSTR3BReports() {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('2025');

  const gstr3bData = {
    outwardSupplies: {
      taxableValue: 875000,
      cgst: 78750,
      sgst: 78750,
      igst: 45000,
      cess: 0
    },
    inwardSupplies: {
      taxableValue: 625000,
      cgst: 56250,
      sgst: 56250,
      igst: 32000,
      cess: 0
    },
    itcAvailed: {
      cgst: 45000,
      sgst: 45000,
      igst: 28000,
      cess: 0
    },
    itcReversed: {
      cgst: 2500,
      sgst: 2500,
      igst: 1000,
      cess: 0
    }
  };

  const netTaxLiability = {
    cgst: gstr3bData.outwardSupplies.cgst - gstr3bData.itcAvailed.cgst + gstr3bData.itcReversed.cgst,
    sgst: gstr3bData.outwardSupplies.sgst - gstr3bData.itcAvailed.sgst + gstr3bData.itcReversed.sgst,
    igst: gstr3bData.outwardSupplies.igst - gstr3bData.itcAvailed.igst + gstr3bData.itcReversed.igst,
    cess: 0
  };

  const handleExport = (format: 'pdf' | 'excel' | 'json') => {
    console.log(`Exporting GSTR3B report as ${format}`);
  };

  const handleFileGSTR3B = () => {
    console.log('Filing GSTR3B return...');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">GSTR-3B Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monthly Summary Return
          </p>
        </div>
        <ClipboardList size={32} className="text-purple-500" />
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

      {/* Outward Supplies */}
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">3.1 - Outward Supplies</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ₹{gstr3bData.outwardSupplies.taxableValue.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Taxable Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ₹{gstr3bData.outwardSupplies.cgst.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">CGST</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ₹{gstr3bData.outwardSupplies.sgst.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">SGST</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                ₹{gstr3bData.outwardSupplies.igst.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">IGST</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                ₹{gstr3bData.outwardSupplies.cess.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">CESS</div>
            </div>
          </div>
        </div>
      </Card>

      {/* ITC Available */}
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">4.1 - ITC Available</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ₹{gstr3bData.itcAvailed.cgst.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">CGST</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ₹{gstr3bData.itcAvailed.sgst.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">SGST</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                ₹{gstr3bData.itcAvailed.igst.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">IGST</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                ₹{gstr3bData.itcAvailed.cess.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">CESS</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Net Tax Liability */}
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">5.1 - Net Tax Liability</h3>
            <AlertCircle size={20} className="text-yellow-500" />
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ₹{netTaxLiability.cgst.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">CGST</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ₹{netTaxLiability.sgst.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">SGST</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ₹{netTaxLiability.igst.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">IGST</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ₹{netTaxLiability.cess.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">CESS</div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
                ₹{(netTaxLiability.cgst + netTaxLiability.sgst + netTaxLiability.igst + netTaxLiability.cess).toLocaleString()}
              </div>
              <div className="text-yellow-700 dark:text-yellow-300 font-semibold">Total Tax Payable</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Actions</h3>
            <div className="flex gap-2">
              <Button variant="primary" onClick={handleFileGSTR3B}>
                <FileText size={16} />
                File GSTR-3B
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
      </Card>

      {/* Important Notes */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Important Notes</h3>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p>• GSTR-3B must be filed by the 20th of every month for the previous month</p>
          <p>• Ensure reconciliation with GSTR-1 and GSTR-2A before filing</p>
          <p>• Late filing attracts interest and late fee</p>
          <p>• Payment of tax liability should be done before filing</p>
        </div>
      </Card>
    </div>
  );
}
