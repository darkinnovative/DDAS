import { useState } from 'react';
import { Card } from '../../ui';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Calendar, TrendingUp, TrendingDown, DollarSign, ArrowUp } from 'lucide-react';

// Sample P&L data (Financial Year: April to March)
const monthlyPLData = [
  { month: 'Apr', revenue: 61000, expenses: 38000, profit: 23000, fyMonth: 1 },
  { month: 'May', revenue: 55000, expenses: 36000, profit: 19000, fyMonth: 2 },
  { month: 'Jun', revenue: 67000, expenses: 41000, profit: 26000, fyMonth: 3 },
  { month: 'Jul', revenue: 72000, expenses: 43000, profit: 29000, fyMonth: 4 },
  { month: 'Aug', revenue: 68000, expenses: 42000, profit: 26000, fyMonth: 5 },
  { month: 'Sep', revenue: 74000, expenses: 45000, profit: 29000, fyMonth: 6 },
  { month: 'Oct', revenue: 79000, expenses: 47000, profit: 32000, fyMonth: 7 },
  { month: 'Nov', revenue: 81000, expenses: 48000, profit: 33000, fyMonth: 8 },
  { month: 'Dec', revenue: 85000, expenses: 50000, profit: 35000, fyMonth: 9 },
  { month: 'Jan', revenue: 89000, expenses: 52000, profit: 37000, fyMonth: 10 },
  { month: 'Feb', revenue: 92000, expenses: 54000, profit: 38000, fyMonth: 11 },
  { month: 'Mar', revenue: 95000, expenses: 56000, profit: 39000, fyMonth: 12 }
];

const expenseBreakdown = [
  { name: 'Cost of Goods Sold', value: 320000, color: '#ef4444' },
  { name: 'Employee Salaries & Benefits', value: 180000, color: '#3b82f6' },
  { name: 'Office Rent & Utilities', value: 120000, color: '#10b981' },
  { name: 'GST & Tax Expenses', value: 95000, color: '#f59e0b' },
  { name: 'Marketing & Advertising', value: 75000, color: '#8b5cf6' },
  { name: 'Professional Services', value: 45000, color: '#ec4899' },
  { name: 'Other Operating Expenses', value: 35000, color: '#6b7280' }
];

const revenueStreams = [
  { name: 'Product Sales (with GST)', value: 520000, color: '#10b981' },
  { name: 'Service Income', value: 280000, color: '#3b82f6' },
  { name: 'Export Sales', value: 150000, color: '#f59e0b' },
  { name: 'Other Income & Interest', value: 45000, color: '#8b5cf6' }
];

const quarterlyComparison = [
  { quarter: 'Q1 FY24 (Apr-Jun)', profit: 68000, margin: 32.1 },
  { quarter: 'Q2 FY24 (Jul-Sep)', profit: 87000, margin: 35.2 },
  { quarter: 'Q3 FY24 (Oct-Dec)', profit: 100000, margin: 38.4 },
  { quarter: 'Q4 FY24 (Jan-Mar)', profit: 114000, margin: 41.2 }
];

export function ProfitLoss() {
  const [selectedPeriod, setSelectedPeriod] = useState('FY 2024-25');

  const totalRevenue = monthlyPLData.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = monthlyPLData.reduce((sum, item) => sum + item.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profit & Loss Statement
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Financial performance analysis for Indian Financial Year (April - March)
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="FY 2024-25">FY 2024-25</option>
              <option value="FY 2023-24">FY 2023-24</option>
              <option value="FY 2022-23">FY 2022-23</option>
              <option value="FY 2021-22">FY 2021-22</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalRevenue)}
              </p>
              <div className="flex items-center mt-2">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">+12.5%</span>
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalExpenses)}
              </p>
              <div className="flex items-center mt-2">
                <ArrowUp className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600">+8.3%</span>
              </div>
            </div>
            <TrendingDown className="h-8 w-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Net Profit</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(netProfit)}
              </p>
              <div className="flex items-center mt-2">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">+18.7%</span>
              </div>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Profit Margin</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {profitMargin}%
              </p>
              <div className="flex items-center mt-2">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">+2.1%</span>
              </div>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Monthly P&L Trend */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Monthly P&L Trend (Financial Year: Apr - Mar)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={monthlyPLData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={3}
              name="Revenue"
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={3}
              name="Expenses"
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#3b82f6"
              strokeWidth={3}
              name="Net Profit"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Revenue vs Expenses Area Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Revenue vs Expenses
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyPLData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Area
                type="monotone"
                dataKey="revenue"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stackId="2"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.6}
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Quarterly Profit Analysis (FY Format)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={quarterlyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => 
                  name === 'profit' ? formatCurrency(Number(value)) : `${value}%`
                } 
              />
              <Bar dataKey="profit" fill="#3b82f6" name="Profit" />
              <Bar dataKey="margin" fill="#10b981" name="Margin %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Expense and Revenue Breakdown Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Expense Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Revenue Streams
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueStreams}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueStreams.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Financial Summary Table */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Financial Year Summary (April - March)
        </h3>
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">Current Financial Year: {selectedPeriod} (1 April - 31 March)</span>
          </div>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
            As per Indian Financial Year standards
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Month</th>
                <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">FY Month</th>
                <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Revenue</th>
                <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Expenses</th>
                <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Net Profit</th>
                <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {monthlyPLData.map((item, index) => {
                const margin = ((item.profit / item.revenue) * 100).toFixed(1);
                return (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{item.month}</td>
                    <td className="p-4 text-center text-gray-600 dark:text-gray-400">
                      {item.fyMonth}
                    </td>
                    <td className="p-4 text-right text-gray-900 dark:text-white">
                      {formatCurrency(item.revenue)}
                    </td>
                    <td className="p-4 text-right text-gray-900 dark:text-white">
                      {formatCurrency(item.expenses)}
                    </td>
                    <td className="p-4 text-right font-medium text-green-600 dark:text-green-400">
                      {formatCurrency(item.profit)}
                    </td>
                    <td className="p-4 text-right text-gray-900 dark:text-white">
                      {margin}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
