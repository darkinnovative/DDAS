import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Package, AlertTriangle, TrendingDown } from 'lucide-react';
import type { InventoryItem } from '../types/billing';

function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Sample inventory data
  const [items] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Laptop Computer',
      description: 'High-performance laptop for business use',
      sku: 'COMP-001',
      category: 'Electronics',
      unit: 'piece',
      purchasePrice: 800,
      sellingPrice: 1200,
      quantity: 15,
      minQuantity: 5,
      supplier: 'Tech Supplies Inc',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Office Chair',
      description: 'Ergonomic office chair with lumbar support',
      sku: 'FURN-001',
      category: 'Furniture',
      unit: 'piece',
      purchasePrice: 150,
      sellingPrice: 250,
      quantity: 3,
      minQuantity: 5,
      supplier: 'Office Furniture Co',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Printer Paper',
      description: 'A4 size white printer paper',
      sku: 'STAT-001',
      category: 'Stationery',
      unit: 'ream',
      purchasePrice: 5,
      sellingPrice: 8,
      quantity: 50,
      minQuantity: 10,
      supplier: 'Paper Plus',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))];
  const lowStockItems = items.filter(item => item.quantity <= item.minQuantity);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Inventory</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your products and stock levels</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl">
          <Plus size={20} />
          Add Item
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 mb-8 flex items-start gap-3">
          <AlertTriangle size={20} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Low Stock Alert</h3>
            <p className="text-yellow-700 dark:text-yellow-300">
              {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} running low on stock.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Items</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{items.length}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
              <Package size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Low Stock Items</h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{lowStockItems.length}</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
              <TrendingDown size={24} className="text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Value</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(items.reduce((sum, item) => sum + (item.quantity * item.purchasePrice), 0))}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <Package size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Purchase Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Selling Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filteredItems.map((item) => (
                <tr key={item.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${item.quantity <= item.minQuantity ? 'bg-red-50 dark:bg-red-900/20' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{item.supplier}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-sm font-mono text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {item.sku}
                    </code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`font-semibold ${item.quantity <= item.minQuantity ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                      {item.quantity} {item.unit}
                    </div>
                    {item.quantity <= item.minQuantity && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                        Low Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {formatCurrency(item.purchasePrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {formatCurrency(item.sellingPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export { Inventory };
