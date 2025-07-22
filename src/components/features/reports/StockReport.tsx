import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { 
  Package, 
  TrendingDown, 
  AlertTriangle, 
  TrendingUp, 
  Download,
  Search,
  FileSpreadsheet,
  RefreshCw,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Table } from '../../ui/Table';

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  unit: string;
  hsnSacCode: string;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderLevel: number;
  status: 'Active' | 'Inactive';
  location?: string;
  lastUpdated: string;
  createdAt: string;
}

// Enhanced sample data for stock report
const sampleInventoryData: InventoryItem[] = [
  {
    id: 'INV001',
    name: 'Office Chair Premium',
    description: 'Ergonomic office chair with lumbar support and adjustable height',
    sku: 'CHAIR-001',
    category: 'Furniture',
    unit: 'Pieces',
    hsnSacCode: '9401',
    costPrice: 6500,
    sellingPrice: 8500,
    currentStock: 25,
    minStock: 5,
    maxStock: 100,
    reorderLevel: 10,
    status: 'Active',
    location: 'Warehouse A - Rack 1',
    lastUpdated: '2025-07-20',
    createdAt: '2025-01-15'
  },
  {
    id: 'INV002',
    name: 'Laptop Stand Aluminum',
    description: 'Adjustable aluminum laptop stand with cooling design',
    sku: 'LAPTOP-STAND-001',
    category: 'Electronics',
    unit: 'Pieces',
    hsnSacCode: '8473',
    costPrice: 1800,
    sellingPrice: 2500,
    currentStock: 8,
    minStock: 10,
    maxStock: 50,
    reorderLevel: 15,
    status: 'Active',
    location: 'Warehouse A - Rack 2',
    lastUpdated: '2025-07-21',
    createdAt: '2025-01-14'
  },
  {
    id: 'INV003',
    name: 'Business Consulting',
    description: 'Professional business consulting service per hour',
    sku: 'CONSULT-001',
    category: 'Services',
    unit: 'Hours',
    hsnSacCode: '9983',
    costPrice: 0,
    sellingPrice: 3000,
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    reorderLevel: 0,
    status: 'Active',
    location: 'N/A',
    lastUpdated: '2025-07-22',
    createdAt: '2025-01-13'
  },
  {
    id: 'INV004',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with USB receiver',
    sku: 'MOUSE-001',
    category: 'Electronics',
    unit: 'Pieces',
    hsnSacCode: '8471',
    costPrice: 800,
    sellingPrice: 1200,
    currentStock: 45,
    minStock: 20,
    maxStock: 100,
    reorderLevel: 30,
    status: 'Active',
    location: 'Warehouse B - Rack 1',
    lastUpdated: '2025-07-19',
    createdAt: '2025-02-01'
  },
  {
    id: 'INV005',
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with blue switches',
    sku: 'KEYBOARD-001',
    category: 'Electronics',
    unit: 'Pieces',
    hsnSacCode: '8471',
    costPrice: 3500,
    sellingPrice: 5000,
    currentStock: 2,
    minStock: 5,
    maxStock: 30,
    reorderLevel: 8,
    status: 'Active',
    location: 'Warehouse B - Rack 2',
    lastUpdated: '2025-07-18',
    createdAt: '2025-02-15'
  },
  {
    id: 'INV006',
    name: 'Office Desk Oak',
    description: 'Solid oak office desk with drawers',
    sku: 'DESK-001',
    category: 'Furniture',
    unit: 'Pieces',
    hsnSacCode: '9401',
    costPrice: 12000,
    sellingPrice: 18000,
    currentStock: 0,
    minStock: 2,
    maxStock: 15,
    reorderLevel: 3,
    status: 'Active',
    location: 'Warehouse C',
    lastUpdated: '2025-07-16',
    createdAt: '2025-03-01'
  },
  {
    id: 'INV007',
    name: 'Monitor 24 inch',
    description: '24-inch LED monitor with HDMI and VGA ports',
    sku: 'MONITOR-001',
    category: 'Electronics',
    unit: 'Pieces',
    hsnSacCode: '8528',
    costPrice: 8500,
    sellingPrice: 12000,
    currentStock: 15,
    minStock: 8,
    maxStock: 40,
    reorderLevel: 12,
    status: 'Active',
    location: 'Warehouse A - Rack 3',
    lastUpdated: '2025-07-17',
    createdAt: '2025-03-15'
  },
  {
    id: 'INV008',
    name: 'Printer Paper A4',
    description: 'High-quality A4 printer paper 80gsm (500 sheets per ream)',
    sku: 'PAPER-A4-001',
    category: 'Stationery',
    unit: 'Ream',
    hsnSacCode: '4802',
    costPrice: 250,
    sellingPrice: 350,
    currentStock: 120,
    minStock: 50,
    maxStock: 200,
    reorderLevel: 75,
    status: 'Active',
    location: 'Warehouse D - Storage',
    lastUpdated: '2025-07-21',
    createdAt: '2025-04-01'
  },
  {
    id: 'INV009',
    name: 'Network Switch 8-Port',
    description: '8-port gigabit network switch with LED indicators',
    sku: 'SWITCH-001',
    category: 'Networking',
    unit: 'Pieces',
    hsnSacCode: '8517',
    costPrice: 2800,
    sellingPrice: 4200,
    currentStock: 6,
    minStock: 3,
    maxStock: 20,
    reorderLevel: 5,
    status: 'Active',
    location: 'Warehouse B - Rack 3',
    lastUpdated: '2025-07-20',
    createdAt: '2025-04-15'
  },
  {
    id: 'INV010',
    name: 'UPS 1000VA',
    description: 'Uninterruptible power supply 1000VA with battery backup',
    sku: 'UPS-001',
    category: 'Power',
    unit: 'Pieces',
    hsnSacCode: '8504',
    costPrice: 4500,
    sellingPrice: 6500,
    currentStock: 3,
    minStock: 5,
    maxStock: 25,
    reorderLevel: 8,
    status: 'Inactive',
    location: 'Warehouse C - Storage',
    lastUpdated: '2025-07-15',
    createdAt: '2025-05-01'
  }
];

export function StockReport() {
  const [inventoryData] = useState<InventoryItem[]>(sampleInventoryData);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'currentStock' | 'value' | 'lastUpdated'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Calculate stock status
  const getStockStatus = (item: InventoryItem) => {
    if (item.category === 'Services') return 'service';
    if (item.currentStock === 0) return 'out_of_stock';
    if (item.currentStock <= item.reorderLevel) return 'low_stock';
    if (item.currentStock <= item.minStock) return 'critical';
    if (item.currentStock >= item.maxStock * 0.9) return 'overstocked';
    return 'normal';
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'overstocked':
        return 'bg-purple-100 text-purple-800';
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'service':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatusIcon = (status: string) => {
    switch (status) {
      case 'out_of_stock':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'low_stock':
        return <TrendingDown className="w-4 h-4 text-yellow-500" />;
      case 'overstocked':
        return <TrendingUp className="w-4 h-4 text-purple-500" />;
      case 'normal':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'service':
        return <Package className="w-4 h-4 text-blue-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = inventoryData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      
      const stockStatus = getStockStatus(item);
      const matchesStock = stockFilter === 'all' || 
                          (stockFilter === 'low_stock' && (stockStatus === 'low_stock' || stockStatus === 'critical')) ||
                          (stockFilter === 'out_of_stock' && stockStatus === 'out_of_stock') ||
                          (stockFilter === 'overstocked' && stockStatus === 'overstocked') ||
                          (stockFilter === 'normal' && stockStatus === 'normal');
      
      return matchesSearch && matchesCategory && matchesStatus && matchesStock;
    });

    // Sort data
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'currentStock':
          aValue = a.currentStock;
          bValue = b.currentStock;
          break;
        case 'value':
          aValue = a.currentStock * a.costPrice;
          bValue = b.currentStock * b.costPrice;
          break;
        case 'lastUpdated':
          aValue = new Date(a.lastUpdated).getTime();
          bValue = new Date(b.lastUpdated).getTime();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [inventoryData, searchTerm, categoryFilter, statusFilter, stockFilter, sortBy, sortOrder]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalItems = inventoryData.length;
    const activeItems = inventoryData.filter(item => item.status === 'Active').length;
    const lowStockItems = inventoryData.filter(item => {
      const status = getStockStatus(item);
      return status === 'low_stock' || status === 'critical';
    }).length;
    const outOfStockItems = inventoryData.filter(item => getStockStatus(item) === 'out_of_stock').length;
    const totalStockValue = inventoryData.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0);
    const totalSellingValue = inventoryData.reduce((sum, item) => sum + (item.currentStock * item.sellingPrice), 0);
    
    return {
      totalItems,
      activeItems,
      lowStockItems,
      outOfStockItems,
      totalStockValue,
      totalSellingValue,
      potentialProfit: totalSellingValue - totalStockValue
    };
  }, [inventoryData]);

  // Get unique categories
  const categories = [...new Set(inventoryData.map(item => item.category))];

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const exportToCSV = () => {
    const headers = [
      'SKU', 'Name', 'Category', 'Current Stock', 'Min Stock', 'Max Stock',
      'Reorder Level', 'Unit', 'Cost Price', 'Selling Price', 'Stock Value',
      'Stock Status', 'Location', 'HSN/SAC Code', 'Status', 'Last Updated'
    ];
    
    const csvData = filteredAndSortedData.map(item => [
      item.sku,
      item.name,
      item.category,
      item.currentStock,
      item.minStock,
      item.maxStock,
      item.reorderLevel,
      item.unit,
      item.costPrice,
      item.sellingPrice,
      item.currentStock * item.costPrice,
      getStockStatus(item).replace('_', ' ').toUpperCase(),
      item.location || 'N/A',
      item.hsnSacCode,
      item.status,
      item.lastUpdated
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `stock_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Stock Report
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Comprehensive inventory analysis and stock management report
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="text-green-600 hover:text-green-800 border-green-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="text-blue-600 hover:text-blue-800 border-blue-300"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Print Report
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.totalItems}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {statistics.activeItems} active
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.lowStockItems}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Need reordering
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.outOfStockItems}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Urgent action needed
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Stock Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(statistics.totalStockValue)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                At cost price
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Value Analysis</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Stock Value (Cost):</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(statistics.totalStockValue)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Stock Value (Selling):</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(statistics.totalSellingValue)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600 dark:text-gray-400">Potential Profit:</span>
              <span className="font-bold text-green-600 dark:text-green-400">
                {formatCurrency(statistics.potentialProfit)}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stock Status Summary</h3>
          <div className="space-y-3">
            {['normal', 'low_stock', 'out_of_stock', 'overstocked'].map(status => {
              const count = inventoryData.filter(item => getStockStatus(item) === status).length;
              const percentage = ((count / inventoryData.length) * 100).toFixed(1);
              return (
                <div key={status} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {getStockStatusIcon(status)}
                    <span className="text-gray-600 dark:text-gray-400 capitalize">
                      {status.replace('_', ' ')}:
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      ({percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Stock Levels</option>
              <option value="normal">Normal Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="overstocked">Overstocked</option>
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="name">Sort by Name</option>
              <option value="currentStock">Sort by Stock Qty</option>
              <option value="value">Sort by Stock Value</option>
              <option value="lastUpdated">Sort by Last Updated</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setStatusFilter('all');
                setStockFilter('all');
              }}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Stock Report Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('name')}
                >
                  Item Details {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category & Location
                </th>
                <th 
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('currentStock')}
                >
                  Stock Levels {sortBy === 'currentStock' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Pricing
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('value')}
                >
                  Stock Value {sortBy === 'value' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('lastUpdated')}
                >
                  Last Updated {sortBy === 'lastUpdated' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
              {filteredAndSortedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No items found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Try adjusting your search terms or filters
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAndSortedData.map((item) => {
                  const stockStatus = getStockStatus(item);
                  const stockValue = item.currentStock * item.costPrice;
                  const sellingValue = item.currentStock * item.sellingPrice;
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            SKU: {item.sku} | HSN: {item.hsnSacCode}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {item.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.category}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{item.location}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {item.currentStock} {item.unit}
                          </p>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            <p>Min: {item.minStock} | Max: {item.maxStock}</p>
                            <p>Reorder: {item.reorderLevel}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-900 dark:text-white">
                            Cost: {formatCurrency(item.costPrice)}
                          </p>
                          <p className="text-sm text-gray-900 dark:text-white">
                            Sell: {formatCurrency(item.sellingPrice)}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            Margin: {((item.sellingPrice - item.costPrice) / item.costPrice * 100).toFixed(1)}%
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(stockValue)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Selling: {formatCurrency(sellingValue)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="space-y-2">
                          <div className="flex items-center justify-center space-x-1">
                            {getStockStatusIcon(stockStatus)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(stockStatus)}`}>
                              {stockStatus.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {format(new Date(item.lastUpdated), 'MMM dd, yyyy')}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </div>
        
        {filteredAndSortedData.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing {filteredAndSortedData.length} of {inventoryData.length} items
              </p>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Total filtered value: {formatCurrency(
                  filteredAndSortedData.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0)
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
