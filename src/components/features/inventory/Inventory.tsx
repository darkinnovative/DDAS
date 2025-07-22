import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Package, Eye, Filter, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

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
  createdAt: string;
}

interface InventoryFormData {
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
}

// Sample data
const initialInventoryData: InventoryItem[] = [
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
    currentStock: 2,
    minStock: 15,
    maxStock: 100,
    reorderLevel: 20,
    status: 'Active',
    createdAt: '2025-01-12'
  }
];

export function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>(initialInventoryData);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [viewingItem, setViewingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<InventoryFormData>({
    name: '',
    description: '',
    sku: '',
    category: '',
    unit: 'Pieces',
    hsnSacCode: '',
    costPrice: 0,
    sellingPrice: 0,
    currentStock: 0,
    minStock: 5,
    maxStock: 100,
    reorderLevel: 10,
    status: 'Active'
  });

  // Get unique categories
  const categories = Array.from(new Set(items.map(item => item.category)));

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate statistics
  const totalItems = items.length;
  const activeItems = items.filter(item => item.status === 'Active').length;
  const lowStockItems = items.filter(item => 
    item.currentStock <= item.reorderLevel && item.currentStock > 0
  ).length;
  const outOfStockItems = items.filter(item => item.currentStock === 0).length;
  const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.sellingPrice), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      // Update existing item
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...editingItem, ...formData }
          : item
      ));
    } else {
      // Add new item
      const newItem: InventoryItem = {
        ...formData,
        id: `INV${String(items.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setItems([...items, newItem]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      sku: '',
      category: '',
      unit: 'Pieces',
      hsnSacCode: '',
      costPrice: 0,
      sellingPrice: 0,
      currentStock: 0,
      minStock: 5,
      maxStock: 100,
      reorderLevel: 10,
      status: 'Active'
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item: InventoryItem) => {
    setFormData({
      name: item.name,
      description: item.description,
      sku: item.sku,
      category: item.category,
      unit: item.unit,
      hsnSacCode: item.hsnSacCode,
      costPrice: item.costPrice,
      sellingPrice: item.sellingPrice,
      currentStock: item.currentStock,
      minStock: item.minStock,
      maxStock: item.maxStock,
      reorderLevel: item.reorderLevel,
      status: item.status
    });
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleView = (item: InventoryItem) => {
    setViewingItem(item);
    setShowViewModal(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) {
      return { label: 'Out of Stock', color: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400' };
    }
    if (item.currentStock <= item.reorderLevel) {
      return { label: 'Low Stock', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400' };
    }
    return { label: 'In Stock', color: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400' };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your products, stock levels, and inventory operations
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add Item
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {totalItems}
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium mt-1">Total Items</div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <BarChart3 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {activeItems}
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium mt-1">Active Items</div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {lowStockItems}
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium mt-1">Low Stock</div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">
            {outOfStockItems}
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium mt-1">Out of Stock</div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {formatCurrency(totalValue)}
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium mt-1">Total Value</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, description, or SKU..."
              icon={<Search size={16} />}
            />
          </div>
          
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <Button variant="outline" onClick={clearFilters} className="w-full">
              <Filter size={16} className="mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
        
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredItems.length} of {items.length} items
        </div>
      </Card>

      {/* Inventory Table */}
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Inventory Items</h3>
        </div>
        
        <div className="overflow-x-auto">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No items found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm || categoryFilter ? 'Try adjusting your search filters.' : 'Get started by adding your first inventory item.'}
              </p>
              {!searchTerm && !categoryFilter && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus size={16} className="mr-2" />
                  Add First Item
                </Button>
              )}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">SKU</th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Item</th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Category</th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">HSN/SAC</th>
                  <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Cost Price</th>
                  <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Selling Price</th>
                  <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Stock</th>
                  <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredItems.map((item) => {
                  const stockStatus = getStockStatus(item);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="p-4 font-mono text-sm text-gray-900 dark:text-white">{item.sku}</td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{item.description}</div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700 dark:text-gray-300">{item.category}</td>
                      <td className="p-4 font-mono text-sm text-gray-700 dark:text-gray-300">{item.hsnSacCode}</td>
                      <td className="p-4 text-right font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.costPrice)}
                      </td>
                      <td className="p-4 text-right font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.sellingPrice)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className={`font-medium ${stockStatus.color.split(' ')[0]}`}>
                            {item.currentStock} {item.unit}
                          </span>
                          <span className="text-xs text-gray-500">
                            Min: {item.minStock}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleView(item)}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEdit(item)}
                            title="Edit Item"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete Item"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h2>
              <Button variant="ghost" onClick={resetForm}>
                ✕
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Item Name *"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <Input
                  label="SKU *"
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="HSN/SAC Code *"
                  type="text"
                  value={formData.hsnSacCode}
                  onChange={(e) => setFormData({...formData, hsnSacCode: e.target.value})}
                  placeholder="e.g. 9401 for Furniture"
                  required
                />
              </div>

              <Input
                label="Description"
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Services">Services</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit *</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="Pieces">Pieces</option>
                    <option value="Kilograms">Kilograms</option>
                    <option value="Liters">Liters</option>
                    <option value="Meters">Meters</option>
                    <option value="Hours">Hours</option>
                    <option value="Days">Days</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Cost Price"
                  type="number"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({...formData, costPrice: parseFloat(e.target.value) || 0})}
                  min="0"
                  step="0.01"
                />
                <Input
                  label="Selling Price *"
                  type="number"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({...formData, sellingPrice: parseFloat(e.target.value) || 0})}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  label="Current Stock"
                  type="number"
                  value={formData.currentStock}
                  onChange={(e) => setFormData({...formData, currentStock: parseInt(e.target.value) || 0})}
                  min="0"
                />
                <Input
                  label="Min Stock"
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})}
                  min="0"
                />
                <Input
                  label="Max Stock"
                  type="number"
                  value={formData.maxStock}
                  onChange={(e) => setFormData({...formData, maxStock: parseInt(e.target.value) || 0})}
                  min="0"
                />
                <Input
                  label="Reorder Level"
                  type="number"
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData({...formData, reorderLevel: parseInt(e.target.value) || 0})}
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" variant="primary" className="flex-1">
                  <Package size={16} className="mr-2" />
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Item Details</h2>
              <Button variant="ghost" onClick={() => setShowViewModal(false)}>
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{viewingItem.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{viewingItem.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">SKU</label>
                  <p className="text-gray-900 dark:text-white font-mono">{viewingItem.sku}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Category</label>
                  <p className="text-gray-900 dark:text-white">{viewingItem.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">HSN/SAC Code</label>
                  <p className="text-gray-900 dark:text-white font-mono">{viewingItem.hsnSacCode}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Unit</label>
                  <p className="text-gray-900 dark:text-white">{viewingItem.unit}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    viewingItem.status === 'Active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                  }`}>
                    {viewingItem.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Cost Price</label>
                  <p className="text-gray-900 dark:text-white">{formatCurrency(viewingItem.costPrice)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Selling Price</label>
                  <p className="text-gray-900 dark:text-white">{formatCurrency(viewingItem.sellingPrice)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Current Stock</label>
                  <p className="text-gray-900 dark:text-white">{viewingItem.currentStock} {viewingItem.unit}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Stock Levels</label>
                  <p className="text-gray-900 dark:text-white">
                    Min: {viewingItem.minStock}, Max: {viewingItem.maxStock}, Reorder: {viewingItem.reorderLevel}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={() => {
                  setShowViewModal(false);
                  handleEdit(viewingItem);
                }}>
                  <Edit size={16} className="mr-2" />
                  Edit Item
                </Button>
                <Button variant="outline" onClick={() => setShowViewModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
