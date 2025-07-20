import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Package, Clock, Wrench, Star, Plus, X } from 'lucide-react';
import { useState } from 'react';

export function Inventory() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    quantity: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.sku) {
      const newItem = {
        id: Date.now().toString(),
        ...formData,
        price: parseFloat(formData.price) || 0,
        quantity: parseInt(formData.quantity) || 0,
        createdAt: new Date().toISOString()
      };
      setItems(prev => [...prev, newItem]);
      setFormData({ name: '', sku: '', category: '', price: '', quantity: '' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage your products and stock levels</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddForm(true)}>
            <Plus size={16} className="mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Items List */}
      {items.length > 0 && (
        <Card className="mb-6">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Added Items ({items.length})</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">SKU: {item.sku} | Category: {item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{item.price}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Coming Soon Card */}
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full text-center p-8">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              Our comprehensive inventory management system is currently under development
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-3 text-blue-500" />
              <span>Real-time stock tracking</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Wrench className="w-4 h-4 mr-3 text-blue-500" />
              <span>Automated reorder alerts</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="w-4 h-4 mr-3 text-blue-500" />
              <span>Multi-location support</span>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Expected Launch:</strong> Coming in the next update
            </p>
          </div>
        </Card>
      </div>

      {/* Add Item Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md m-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add New Item</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAddForm(false)}
                >
                  <X size={16} />
                </Button>
              </div>
              
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter item name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU *
                  </label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    placeholder="Enter SKU"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <Input
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="Enter category"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <Input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Add Item
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
