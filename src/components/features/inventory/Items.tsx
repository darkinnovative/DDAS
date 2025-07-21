import { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Plus, Search, Edit, Trash2, Package, Eye, Filter } from 'lucide-react';

interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  sellingPrice: number;
  purchasePrice: number;
  taxRate: number;
  hsn: string;
  stock: number;
  lowStockAlert: number;
  status: 'Active' | 'Inactive';
  createdDate: string;
}

export function Items() {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState<Partial<Item>>({
    name: '',
    description: '',
    category: '',
    unit: 'Pcs',
    sellingPrice: 0,
    purchasePrice: 0,
    taxRate: 18,
    hsn: '',
    stock: 0,
    lowStockAlert: 10,
    status: 'Active'
  });

  // Sample items data
  useEffect(() => {
    const sampleItems: Item[] = [
      {
        id: 'ITM-001',
        name: 'Office Chair',
        description: 'Ergonomic office chair with lumbar support',
        category: 'Furniture',
        unit: 'Pcs',
        sellingPrice: 8500,
        purchasePrice: 6500,
        taxRate: 18,
        hsn: '9401',
        stock: 25,
        lowStockAlert: 5,
        status: 'Active',
        createdDate: '2025-01-15'
      },
      {
        id: 'ITM-002',
        name: 'Laptop Stand',
        description: 'Adjustable aluminum laptop stand',
        category: 'Electronics',
        unit: 'Pcs',
        sellingPrice: 2500,
        purchasePrice: 1800,
        taxRate: 18,
        hsn: '8473',
        stock: 15,
        lowStockAlert: 3,
        status: 'Active',
        createdDate: '2025-01-14'
      },
      {
        id: 'ITM-003',
        name: 'Consulting Service',
        description: 'Business consulting service per hour',
        category: 'Services',
        unit: 'Hours',
        sellingPrice: 3000,
        purchasePrice: 0,
        taxRate: 18,
        hsn: '9983',
        stock: 0,
        lowStockAlert: 0,
        status: 'Active',
        createdDate: '2025-01-13'
      }
    ];
    setItems(sampleItems);
  }, []);

  const categories = Array.from(new Set(items.map(item => item.category)));
  
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      // Update existing item
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ));
    } else {
      // Add new item
      const newItem: Item = {
        ...formData,
        id: `ITM-${String(items.length + 1).padStart(3, '0')}`,
        createdDate: new Date().toISOString().split('T')[0]
      } as Item;
      
      setItems([...items, newItem]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      unit: 'Pcs',
      sellingPrice: 0,
      purchasePrice: 0,
      taxRate: 18,
      hsn: '',
      stock: 0,
      lowStockAlert: 10,
      status: 'Active'
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item: Item) => {
    setFormData(item);
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Items Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your products and services
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

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Search Items"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or description"
            icon={<Search size={16} />}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
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
            <Button variant="outline" className="w-full">
              <Filter size={16} />
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {items.length}
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium mt-2">Total Items</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {items.filter(item => item.status === 'Active').length}
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium mt-2">Active Items</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {items.filter(item => item.stock <= item.lowStockAlert && item.stock > 0).length}
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium mt-2">Low Stock</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {categories.length}
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium mt-2">Categories</div>
        </Card>
      </div>

      {/* Items Table */}
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Items List</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Item ID</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Name</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Category</th>
                <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Selling Price</th>
                <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Stock</th>
                <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">{item.id}</td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{item.description}</div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-700 dark:text-gray-300">{item.category}</td>
                  <td className="p-4 text-right font-medium text-gray-900 dark:text-white">₹{item.sellingPrice.toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <span className={`font-medium ${
                      item.stock <= item.lowStockAlert && item.stock > 0 
                        ? 'text-orange-600 dark:text-orange-400' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {item.stock} {item.unit}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h2>
              <Button variant="ghost" onClick={resetForm}>
                ×
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Item Name *"
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Services">Services</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <Input
                label="Description"
                type="text"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit</label>
                  <select
                    value={formData.unit || 'Pcs'}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="Pcs">Pieces</option>
                    <option value="Kg">Kilograms</option>
                    <option value="L">Liters</option>
                    <option value="Hours">Hours</option>
                    <option value="Days">Days</option>
                    <option value="Meters">Meters</option>
                  </select>
                </div>
                <Input
                  label="HSN Code"
                  type="text"
                  value={formData.hsn || ''}
                  onChange={(e) => setFormData({...formData, hsn: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Purchase Price"
                  type="number"
                  value={formData.purchasePrice || 0}
                  onChange={(e) => setFormData({...formData, purchasePrice: parseFloat(e.target.value) || 0})}
                  min="0"
                  step="0.01"
                />
                <Input
                  label="Selling Price *"
                  type="number"
                  value={formData.sellingPrice || 0}
                  onChange={(e) => setFormData({...formData, sellingPrice: parseFloat(e.target.value) || 0})}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Tax Rate (%)"
                  type="number"
                  value={formData.taxRate || 18}
                  onChange={(e) => setFormData({...formData, taxRate: parseFloat(e.target.value) || 0})}
                  min="0"
                  max="100"
                />
                <Input
                  label="Stock Quantity"
                  type="number"
                  value={formData.stock || 0}
                  onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                  min="0"
                />
                <Input
                  label="Low Stock Alert"
                  type="number"
                  value={formData.lowStockAlert || 10}
                  onChange={(e) => setFormData({...formData, lowStockAlert: parseInt(e.target.value) || 0})}
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select
                  value={formData.status || 'Active'}
                  onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" variant="primary" className="flex-1">
                  <Package size={16} />
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
    </div>
  );
}
