import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useInventory } from '../../../context/InventoryContext';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import type { InventoryItem } from '../../../types/inventory';

interface ItemFormProps {
  item?: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ItemForm({ item, isOpen, onClose }: ItemFormProps) {
  const { addItem, updateItem } = useInventory();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    category: '',
    subcategory: '',
    brand: '',
    hsnCode: '',
    unit: 'pcs' as 'pcs' | 'kg' | 'gm' | 'ltr' | 'mtr' | 'ft' | 'box' | 'pack' | 'dozen' | 'other',
    customUnit: '',
    costPrice: 0,
    sellingPrice: 0,
    mrp: 0,
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    reorderLevel: 0,
    gstRate: 18,
    taxCategory: 'taxable' as 'taxable' | 'exempt' | 'zero_rated',
    cessRate: 0,
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    },
    location: '',
    warehouse: '',
    rack: '',
    isActive: true,
    isDiscontinued: false,
    vendorIds: [] as string[],
    images: [] as string[],
    barcode: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        sku: item.sku,
        category: item.category,
        subcategory: item.subcategory || '',
        brand: item.brand || '',
        hsnCode: item.hsnCode,
        unit: item.unit,
        customUnit: item.customUnit || '',
        costPrice: item.costPrice,
        sellingPrice: item.sellingPrice,
        mrp: item.mrp,
        currentStock: item.currentStock,
        minStock: item.minStock,
        maxStock: item.maxStock,
        reorderLevel: item.reorderLevel,
        gstRate: item.gstRate,
        taxCategory: item.taxCategory,
        cessRate: item.cessRate || 0,
        weight: item.weight || 0,
        dimensions: item.dimensions || { length: 0, width: 0, height: 0 },
        location: item.location || '',
        warehouse: item.warehouse || '',
        rack: item.rack || '',
        isActive: item.isActive,
        isDiscontinued: item.isDiscontinued,
        vendorIds: item.vendorIds,
        images: item.images,
        barcode: item.barcode || ''
      });
    } else {
      // Reset form for new item
      setFormData({
        name: '',
        description: '',
        sku: `SKU-${Date.now()}`,
        category: '',
        subcategory: '',
        brand: '',
        hsnCode: '',
        unit: 'pcs',
        customUnit: '',
        costPrice: 0,
        sellingPrice: 0,
        mrp: 0,
        currentStock: 0,
        minStock: 0,
        maxStock: 0,
        reorderLevel: 0,
        gstRate: 18,
        taxCategory: 'taxable',
        cessRate: 0,
        weight: 0,
        dimensions: { length: 0, width: 0, height: 0 },
        location: '',
        warehouse: '',
        rack: '',
        isActive: true,
        isDiscontinued: false,
        vendorIds: [],
        images: [],
        barcode: ''
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate margin
    const margin = formData.sellingPrice - formData.costPrice;
    const marginPercentage = formData.costPrice > 0 ? (margin / formData.costPrice) * 100 : 0;
    
    const itemData = {
      ...formData,
      margin,
      marginPercentage,
      preferredVendorId: formData.vendorIds[0] || undefined,
      createdBy: 'current-user',
      updatedBy: 'current-user'
    };
    
    if (item) {
      updateItem({
        ...item,
        ...itemData,
        updatedAt: new Date()
      });
    } else {
      addItem(itemData);
    }
    
    onClose();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDimensionChange = (dimension: 'length' | 'width' | 'height', value: number) => {
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: value
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {item ? 'Edit Item' : 'Add New Item'}
          </h2>
          <Button variant="ghost" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter item description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    required
                    placeholder="SKU-123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">HSN Code</label>
                  <Input
                    value={formData.hsnCode}
                    onChange={(e) => handleInputChange('hsnCode', e.target.value)}
                    placeholder="1234"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Home">Home & Garden</option>
                    <option value="Sports">Sports</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <Input
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    placeholder="Brand name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="pcs">Pieces</option>
                    <option value="kg">Kilograms</option>
                    <option value="gm">Grams</option>
                    <option value="ltr">Litres</option>
                    <option value="mtr">Metres</option>
                    <option value="ft">Feet</option>
                    <option value="box">Box</option>
                    <option value="pack">Pack</option>
                    <option value="dozen">Dozen</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
                  <Input
                    value={formData.barcode}
                    onChange={(e) => handleInputChange('barcode', e.target.value)}
                    placeholder="Barcode"
                  />
                </div>
              </div>
            </div>

            {/* Pricing and Stock */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing & Stock</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost Price <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => handleInputChange('costPrice', parseFloat(e.target.value) || 0)}
                    required
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selling Price <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.sellingPrice}
                    onChange={(e) => handleInputChange('sellingPrice', parseFloat(e.target.value) || 0)}
                    required
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MRP</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.mrp}
                  onChange={(e) => handleInputChange('mrp', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                  <Input
                    type="number"
                    value={formData.currentStock}
                    onChange={(e) => handleInputChange('currentStock', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
                  <Input
                    type="number"
                    value={formData.reorderLevel}
                    onChange={(e) => handleInputChange('reorderLevel', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
                  <Input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => handleInputChange('minStock', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Stock</label>
                  <Input
                    type="number"
                    value={formData.maxStock}
                    onChange={(e) => handleInputChange('maxStock', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST Rate (%)</label>
                  <select
                    value={formData.gstRate}
                    onChange={(e) => handleInputChange('gstRate', parseFloat(e.target.value))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax Category</label>
                  <select
                    value={formData.taxCategory}
                    onChange={(e) => handleInputChange('taxCategory', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="taxable">Taxable</option>
                    <option value="exempt">Exempt</option>
                    <option value="zero_rated">Zero Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location and Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Location & Status</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
                  <Input
                    value={formData.warehouse}
                    onChange={(e) => handleInputChange('warehouse', e.target.value)}
                    placeholder="Warehouse name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Section A, Aisle 3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rack/Shelf</label>
                  <Input
                    value={formData.rack}
                    onChange={(e) => handleInputChange('rack', e.target.value)}
                    placeholder="A1-B2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions (cm)</label>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.dimensions.length}
                    onChange={(e) => handleDimensionChange('length', parseFloat(e.target.value) || 0)}
                    placeholder="Length"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.dimensions.width}
                    onChange={(e) => handleDimensionChange('width', parseFloat(e.target.value) || 0)}
                    placeholder="Width"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.dimensions.height}
                    onChange={(e) => handleDimensionChange('height', parseFloat(e.target.value) || 0)}
                    placeholder="Height"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Active</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isDiscontinued}
                    onChange={(e) => handleInputChange('isDiscontinued', e.target.checked)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Discontinued</span>
                </label>
              </div>
            </div>

            {/* Calculated Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Calculated Information</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Margin Amount:</span>
                  <span className="text-sm text-gray-900">
                    ₹{(formData.sellingPrice - formData.costPrice).toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Margin Percentage:</span>
                  <span className="text-sm text-gray-900">
                    {formData.costPrice > 0 
                      ? ((formData.sellingPrice - formData.costPrice) / formData.costPrice * 100).toFixed(1)
                      : 0
                    }%
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Stock Value:</span>
                  <span className="text-sm text-gray-900">
                    ₹{(formData.currentStock * formData.costPrice).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Save size={16} className="mr-2" />
              {item ? 'Update Item' : 'Add Item'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
