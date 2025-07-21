import { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell } from '../../ui/Table';
import { 
  Package, 
  TrendingDown, 
  AlertTriangle, 
  BarChart3, 
  Download, 
  Search,
  Filter,
  Calendar,
  DollarSign,
  TrendingUp
} from 'lucide-react';

interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  maxStock: number;
  unit: string;
  value: number;
  lastUpdated: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock';
}

export function StockReport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Sample stock data
  const stockData: StockItem[] = [
    {
      id: '1',
      name: 'MacBook Pro 14-inch',
      sku: 'MBP-14-M3-512',
      category: 'Electronics',
      currentStock: 15,
      reorderLevel: 10,
      maxStock: 50,
      unit: 'pcs',
      value: 2998500,
      lastUpdated: '2025-07-21',
      status: 'in_stock'
    },
    {
      id: '2',
      name: 'Dell XPS 13',
      sku: 'DELL-XPS13-I7',
      category: 'Electronics',
      currentStock: 3,
      reorderLevel: 5,
      maxStock: 30,
      unit: 'pcs',
      value: 329700,
      lastUpdated: '2025-07-20',
      status: 'low_stock'
    },
    {
      id: '3',
      name: 'iPhone 15 Pro',
      sku: 'IP15-PRO-256',
      category: 'Electronics',
      currentStock: 0,
      reorderLevel: 8,
      maxStock: 25,
      unit: 'pcs',
      value: 0,
      lastUpdated: '2025-07-19',
      status: 'out_of_stock'
    },
    {
      id: '4',
      name: 'Office Chair Executive',
      sku: 'CHAIR-EXEC-001',
      category: 'Office Supplies',
      currentStock: 25,
      reorderLevel: 15,
      maxStock: 100,
      unit: 'pcs',
      value: 322500,
      lastUpdated: '2025-07-21',
      status: 'in_stock'
    },
    {
      id: '5',
      name: 'A4 Copy Paper',
      sku: 'PAPER-A4-500',
      category: 'Office Supplies',
      currentStock: 85,
      reorderLevel: 100,
      maxStock: 500,
      unit: 'pack',
      value: 25415,
      lastUpdated: '2025-07-20',
      status: 'low_stock'
    }
  ];

  // Calculate summary statistics
  const totalItems = stockData.length;
  const inStockItems = stockData.filter(item => item.status === 'in_stock').length;
  const lowStockItems = stockData.filter(item => item.status === 'low_stock').length;
  const outOfStockItems = stockData.filter(item => item.status === 'out_of_stock').length;
  const totalValue = stockData.reduce((sum, item) => sum + item.value, 0);

  // Filter data based on search and filters
  const filteredData = stockData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      case 'overstock': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_stock': return 'In Stock';
      case 'low_stock': return 'Low Stock';
      case 'out_of_stock': return 'Out of Stock';
      case 'overstock': return 'Overstock';
      default: return 'Unknown';
    }
  };

  const categories = [...new Set(stockData.map(item => item.category))];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Report</h1>
          <p className="text-gray-600">Monitor inventory levels and stock status</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar size={16} className="mr-2" />
            Date Range
          </Button>
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">In Stock</p>
              <p className="text-2xl font-bold text-gray-900">{inStockItems}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockItems}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{outOfStockItems}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalValue.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search items..."
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="w-full"
            >
              <Filter size={16} className="mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Stock Report Table */}
      <Card>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Stock Details</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <BarChart3 size={14} className="mr-2" />
                Chart View
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Item Details</TableHeaderCell>
                  <TableHeaderCell>SKU</TableHeaderCell>
                  <TableHeaderCell>Category</TableHeaderCell>
                  <TableHeaderCell>Current Stock</TableHeaderCell>
                  <TableHeaderCell>Reorder Level</TableHeaderCell>
                  <TableHeaderCell>Max Stock</TableHeaderCell>
                  <TableHeaderCell>Stock Value</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Last Updated</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-center py-8" colSpan={9}>
                      <Package size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">No stock data found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">ID: {item.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{item.sku}</span>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-medium">{item.currentStock}</span>
                          <span className="text-gray-500 ml-1">{item.unit}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-orange-600 font-medium">
                          {item.reorderLevel} {item.unit}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-blue-600 font-medium">
                          {item.maxStock} {item.unit}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">₹{item.value.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{item.lastUpdated}</span>
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
