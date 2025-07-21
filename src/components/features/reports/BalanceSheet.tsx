import { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  Package
} from 'lucide-react';
import { format } from 'date-fns';

interface BalanceSheetItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  subcategory?: string;
}

interface BalanceSheetData {
  assets: {
    current: BalanceSheetItem[];
    nonCurrent: BalanceSheetItem[];
  };
  liabilities: {
    current: BalanceSheetItem[];
    nonCurrent: BalanceSheetItem[];
  };
  equity: BalanceSheetItem[];
}

export function BalanceSheet() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showComparative, setShowComparative] = useState(false);

  // Sample balance sheet data
  const balanceSheetData: BalanceSheetData = {
    assets: {
      current: [
        { id: '1', name: 'Cash and Cash Equivalents', amount: 250000, category: 'current' },
        { id: '2', name: 'Accounts Receivable', amount: 180000, category: 'current' },
        { id: '3', name: 'Inventory', amount: 320000, category: 'current' },
        { id: '4', name: 'Prepaid Expenses', amount: 45000, category: 'current' },
        { id: '5', name: 'Short-term Investments', amount: 150000, category: 'current' }
      ],
      nonCurrent: [
        { id: '6', name: 'Property, Plant & Equipment', amount: 1200000, category: 'non-current' },
        { id: '7', name: 'Accumulated Depreciation', amount: -180000, category: 'non-current' },
        { id: '8', name: 'Intangible Assets', amount: 95000, category: 'non-current' },
        { id: '9', name: 'Long-term Investments', amount: 280000, category: 'non-current' },
        { id: '10', name: 'Goodwill', amount: 75000, category: 'non-current' }
      ]
    },
    liabilities: {
      current: [
        { id: '11', name: 'Accounts Payable', amount: 125000, category: 'current' },
        { id: '12', name: 'Short-term Debt', amount: 80000, category: 'current' },
        { id: '13', name: 'Accrued Liabilities', amount: 65000, category: 'current' },
        { id: '14', name: 'Income Tax Payable', amount: 35000, category: 'current' },
        { id: '15', name: 'Current Portion of Long-term Debt', amount: 45000, category: 'current' }
      ],
      nonCurrent: [
        { id: '16', name: 'Long-term Debt', amount: 420000, category: 'non-current' },
        { id: '17', name: 'Deferred Tax Liabilities', amount: 85000, category: 'non-current' },
        { id: '18', name: 'Employee Benefits Payable', amount: 95000, category: 'non-current' },
        { id: '19', name: 'Other Long-term Liabilities', amount: 55000, category: 'non-current' }
      ]
    },
    equity: [
      { id: '20', name: 'Share Capital', amount: 500000, category: 'equity' },
      { id: '21', name: 'Retained Earnings', amount: 380000, category: 'equity' },
      { id: '22', name: 'Other Comprehensive Income', amount: 45000, category: 'equity' },
      { id: '23', name: 'Treasury Stock', amount: -25000, category: 'equity' }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const calculateTotal = (items: BalanceSheetItem[]) => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const totalCurrentAssets = calculateTotal(balanceSheetData.assets.current);
  const totalNonCurrentAssets = calculateTotal(balanceSheetData.assets.nonCurrent);
  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

  const totalCurrentLiabilities = calculateTotal(balanceSheetData.liabilities.current);
  const totalNonCurrentLiabilities = calculateTotal(balanceSheetData.liabilities.nonCurrent);
  const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;

  const totalEquity = calculateTotal(balanceSheetData.equity);
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

  const renderSection = (title: string, items: BalanceSheetItem[], showSubtotal = false, subtotalLabel?: string) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center py-1 hover:bg-gray-50 px-2 rounded">
            <span className="text-gray-800">{item.name}</span>
            <span className={`font-medium ${item.amount < 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {item.amount < 0 ? `(${formatCurrency(item.amount)})` : formatCurrency(item.amount)}
            </span>
          </div>
        ))}
        {showSubtotal && (
          <div className="flex justify-between items-center py-2 border-t border-gray-300 font-semibold">
            <span className="text-gray-900">{subtotalLabel || `Total ${title}`}</span>
            <span className="text-gray-900">{formatCurrency(calculateTotal(items))}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Balance Sheet</h1>
          <p className="text-gray-600">Financial position statement as of selected date</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar size={16} className="mr-2" />
            Compare Periods
          </Button>
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">As of Date:</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="comparative"
              checked={showComparative}
              onChange={(e) => setShowComparative(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <label htmlFor="comparative" className="text-sm font-medium text-gray-700">
              Show Comparative Period
            </label>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assets</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalAssets)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Liabilities</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalLiabilities)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Equity</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalEquity)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Balance Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Package className="mr-2 text-blue-600" size={20} />
            ASSETS
          </h2>
          
          {renderSection('Current Assets', balanceSheetData.assets.current, true)}
          {renderSection('Non-Current Assets', balanceSheetData.assets.nonCurrent, true)}
          
          <div className="border-t-2 border-gray-400 pt-3 mt-4">
            <div className="flex justify-between items-center font-bold text-lg">
              <span className="text-gray-900">TOTAL ASSETS</span>
              <span className="text-gray-900">{formatCurrency(totalAssets)}</span>
            </div>
          </div>
        </Card>

        {/* Liabilities and Equity */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Building2 className="mr-2 text-red-600" size={20} />
            LIABILITIES & EQUITY
          </h2>
          
          {renderSection('Current Liabilities', balanceSheetData.liabilities.current, true)}
          {renderSection('Non-Current Liabilities', balanceSheetData.liabilities.nonCurrent, true)}
          
          <div className="border-t border-gray-300 pt-3 mt-4 mb-6">
            <div className="flex justify-between items-center font-semibold">
              <span className="text-gray-900">Total Liabilities</span>
              <span className="text-gray-900">{formatCurrency(totalLiabilities)}</span>
            </div>
          </div>

          {renderSection("Shareholders' Equity", balanceSheetData.equity, true)}
          
          <div className="border-t-2 border-gray-400 pt-3 mt-4">
            <div className="flex justify-between items-center font-bold text-lg">
              <span className="text-gray-900">TOTAL LIABILITIES & EQUITY</span>
              <span className="text-gray-900">{formatCurrency(totalLiabilitiesAndEquity)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Balance Check */}
      <Card className="p-4 mt-6">
        <div className="flex items-center justify-center">
          <div className={`flex items-center p-3 rounded-lg ${
            totalAssets === totalLiabilitiesAndEquity 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <FileText className="mr-2" size={20} />
            <span className="font-medium">
              Balance Check: {totalAssets === totalLiabilitiesAndEquity ? 'BALANCED' : 'NOT BALANCED'}
            </span>
            <span className="ml-4 text-sm">
              Difference: {formatCurrency(totalAssets - totalLiabilitiesAndEquity)}
            </span>
          </div>
        </div>
      </Card>

      {/* Additional Information */}
      <Card className="p-4 mt-6">
        <h3 className="font-semibold text-gray-900 mb-2">Notes:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Balance sheet as of {format(new Date(selectedDate), 'MMMM dd, yyyy')}</li>
          <li>• All amounts are in Indian Rupees (INR)</li>
          <li>• Figures are rounded to the nearest rupee</li>
          <li>• Negative amounts are shown in parentheses</li>
        </ul>
      </Card>
    </div>
  );
}
