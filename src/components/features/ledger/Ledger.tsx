import { useState } from 'react';
import { Plus, Search, BookOpen, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell } from '../../ui/Table';

interface LedgerAccount {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  balance: number;
  isActive: boolean;
}

interface LedgerEntry {
  id: string;
  date: Date;
  description: string;
  reference?: string;
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
  balance: number;
}

export function Ledger() {
  const [activeTab, setActiveTab] = useState<'accounts' | 'entries'>('accounts');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Sample chart of accounts
  const [accounts] = useState<LedgerAccount[]>([
    { id: '1', code: '1000', name: 'Cash', type: 'asset', balance: 15000, isActive: true },
    { id: '2', code: '1100', name: 'Accounts Receivable', type: 'asset', balance: 8500, isActive: true },
    { id: '3', code: '1200', name: 'Inventory', type: 'asset', balance: 12000, isActive: true },
    { id: '4', code: '2000', name: 'Accounts Payable', type: 'liability', balance: 5500, isActive: true },
    { id: '5', code: '3000', name: 'Owner\'s Equity', type: 'equity', balance: 25000, isActive: true },
    { id: '6', code: '4000', name: 'Sales Revenue', type: 'income', balance: 45000, isActive: true },
    { id: '7', code: '5000', name: 'Cost of Goods Sold', type: 'expense', balance: 18000, isActive: true },
    { id: '8', code: '6000', name: 'Office Expenses', type: 'expense', balance: 3500, isActive: true },
  ]);

  // Sample ledger entries
  const [entries] = useState<LedgerEntry[]>([
    {
      id: '1',
      date: new Date('2025-01-15'),
      description: 'Initial cash deposit',
      reference: 'JE-001',
      accountId: '1',
      accountName: 'Cash',
      debit: 15000,
      credit: 0,
      balance: 15000
    },
    {
      id: '2',
      date: new Date('2025-01-15'),
      description: 'Initial cash deposit',
      reference: 'JE-001',
      accountId: '5',
      accountName: 'Owner\'s Equity',
      debit: 0,
      credit: 15000,
      balance: 15000
    },
    {
      id: '3',
      date: new Date('2025-01-16'),
      description: 'Sale to customer',
      reference: 'INV-001',
      accountId: '2',
      accountName: 'Accounts Receivable',
      debit: 5000,
      credit: 0,
      balance: 5000
    },
    {
      id: '4',
      date: new Date('2025-01-16'),
      description: 'Sale to customer',
      reference: 'INV-001',
      accountId: '6',
      accountName: 'Sales Revenue',
      debit: 0,
      credit: 5000,
      balance: 5000
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(Math.abs(amount));
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'asset': return '#10b981';
      case 'liability': return '#ef4444';
      case 'equity': return '#8b5cf6';
      case 'income': return '#3b82f6';
      case 'expense': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || account.type === typeFilter;
    
    return matchesSearch && matchesType && account.isActive;
  });

  const filteredEntries = entries.filter(entry => 
    entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.reference && entry.reference.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const accountTypes = ['all', 'asset', 'liability', 'equity', 'income', 'expense'];

  const totalAssets = accounts
    .filter(a => a.type === 'asset')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalLiabilities = accounts
    .filter(a => a.type === 'liability')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalEquity = accounts
    .filter(a => a.type === 'equity')
    .reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">General Ledger</h1>
          <p className="text-gray-600">Manage accounts and journal entries</p>
        </div>
        <Button>
          <Plus size={16} className="mr-2" />
          New Journal Entry
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Assets</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAssets)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg mr-4">
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Liabilities</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalLiabilities)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Equity</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalEquity)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button 
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'accounts'
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('accounts')}
          >
            Chart of Accounts
          </button>
          <button 
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'entries'
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('entries')}
          >
            Journal Entries
          </button>
        </nav>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={activeTab === 'accounts' ? 'Search accounts...' : 'Search entries...'}
                className="pl-10"
              />
            </div>
          </div>
          
          {activeTab === 'accounts' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
              <select 
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {accountTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-end">
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('all');
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card>
        <div className="p-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {activeTab === 'accounts' ? (
                  <TableRow>
                    <TableHeaderCell>Account Code</TableHeaderCell>
                    <TableHeaderCell>Account Name</TableHeaderCell>
                    <TableHeaderCell>Type</TableHeaderCell>
                    <TableHeaderCell>Balance</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableHeaderCell>Date</TableHeaderCell>
                    <TableHeaderCell>Reference</TableHeaderCell>
                    <TableHeaderCell>Description</TableHeaderCell>
                    <TableHeaderCell>Account</TableHeaderCell>
                    <TableHeaderCell>Debit</TableHeaderCell>
                    <TableHeaderCell>Credit</TableHeaderCell>
                    <TableHeaderCell>Balance</TableHeaderCell>
                  </TableRow>
                )}
              </TableHeader>
              <TableBody>
                {activeTab === 'accounts' ? (
                  filteredAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>
                        <span className="font-mono text-sm font-medium">{account.code}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-gray-900">{account.name}</span>
                      </TableCell>
                      <TableCell>
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: getAccountTypeColor(account.type) }}
                        >
                          {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {account.type === 'liability' || account.type === 'equity' || account.type === 'income' 
                            ? `(${formatCurrency(account.balance)})` 
                            : formatCurrency(account.balance)
                          }
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          account.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {account.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <span className="text-sm text-gray-900">{format(entry.date, 'MMM dd, yyyy')}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm text-blue-600">{entry.reference || '-'}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-900">{entry.description}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-gray-900">{entry.accountName}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600">
                          {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-red-600">
                          {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-gray-900">{formatCurrency(entry.balance)}</span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}
