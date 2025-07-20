import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Filter, BookOpen, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

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
  const { isDarkMode } = useAuth();
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
    <div className="ledger">
      <div className="page-header">
        <h1>General Ledger</h1>
        <button className="btn btn-primary">
          <Plus size={20} />
          New Journal Entry
        </button>
      </div>

      <div className="ledger-summary">
        <div className="summary-card">
          <div className="summary-icon assets">
            <TrendingUp size={24} />
          </div>
          <div className="summary-content">
            <h3>Total Assets</h3>
            <p className="summary-amount">{formatCurrency(totalAssets)}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon liabilities">
            <TrendingDown size={24} />
          </div>
          <div className="summary-content">
            <h3>Total Liabilities</h3>
            <p className="summary-amount">{formatCurrency(totalLiabilities)}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon equity">
            <BookOpen size={24} />
          </div>
          <div className="summary-content">
            <h3>Total Equity</h3>
            <p className="summary-amount">{formatCurrency(totalEquity)}</p>
          </div>
        </div>
      </div>

      <div className="ledger-tabs">
        <button 
          className={`tab-button ${activeTab === 'accounts' ? 'active' : ''}`}
          onClick={() => setActiveTab('accounts')}
        >
          Chart of Accounts
        </button>
        <button 
          className={`tab-button ${activeTab === 'entries' ? 'active' : ''}`}
          onClick={() => setActiveTab('entries')}
        >
          Journal Entries
        </button>
      </div>

      <div className="filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder={activeTab === 'accounts' ? 'Search accounts...' : 'Search entries...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {activeTab === 'accounts' && (
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="type-filter"
          >
            {accountTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="table-container">
        {activeTab === 'accounts' ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Account Code</th>
                <th>Account Name</th>
                <th>Type</th>
                <th>Balance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account.id}>
                  <td className="account-code">{account.code}</td>
                  <td className="account-name">{account.name}</td>
                  <td>
                    <span 
                      className="account-type-badge"
                      style={{ backgroundColor: getAccountTypeColor(account.type) }}
                    >
                      {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                    </span>
                  </td>
                  <td className="balance">
                    {account.type === 'liability' || account.type === 'equity' || account.type === 'income' 
                      ? `(${formatCurrency(account.balance)})` 
                      : formatCurrency(account.balance)
                    }
                  </td>
                  <td>
                    <span className={`status ${account.isActive ? 'active' : 'inactive'}`}>
                      {account.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Reference</th>
                <th>Description</th>
                <th>Account</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>{format(entry.date, 'MMM dd, yyyy')}</td>
                  <td className="reference">{entry.reference || '-'}</td>
                  <td>{entry.description}</td>
                  <td className="account-name">{entry.accountName}</td>
                  <td className="debit">
                    {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                  </td>
                  <td className="credit">
                    {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                  </td>
                  <td className="balance">{formatCurrency(entry.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
