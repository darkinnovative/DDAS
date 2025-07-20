import { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  BarChart3,
  FileText,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { useInventory } from '../../../context/InventoryContext';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell } from '../../ui/Table';
import { ItemForm } from './ItemForm';
import type { InventoryItem } from '../../../types/inventory';

export function Inventory() {
  const {
    stats,
    alerts,
    filters,
    isLoading,
    getFilteredItems,
    setFilters,
    deleteItem,
    resolveAlert,
    exportData
  } = useInventory();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const filteredItems = getFilteredItems();

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value });
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteItem(id);
    }
  };

  const getStockStatusColor = (item: InventoryItem) => {
    if (item.currentStock === 0) return 'text-red-600 bg-red-50';
    if (item.currentStock <= item.reorderLevel) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getStockStatusText = (item: InventoryItem) => {
    if (item.currentStock === 0) return 'Out of Stock';
    if (item.currentStock <= item.reorderLevel) return 'Low Stock';
    return 'In Stock';
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage your products and stock levels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportData}>
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload size={16} className="mr-2" />
            Import
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus size={16} className="mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Stock Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalValue.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{stats.lowStockItems}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{stats.outOfStockItems}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.filter(alert => !alert.isResolved).length > 0 && (
        <Card className="p-4 mb-6 border-orange-200 bg-orange-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
              <span className="font-medium text-orange-800">
                {alerts.filter(alert => !alert.isResolved).length} Stock Alerts
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => alerts.filter(alert => !alert.isResolved).forEach(alert => resolveAlert(alert.id))}
            >
              Resolve All
            </Button>
          </div>
          <div className="mt-2 space-y-1">
            {alerts.filter(alert => !alert.isResolved).slice(0, 3).map(alert => (
              <p key={alert.id} className="text-sm text-orange-700">
                {alert.item?.name} - {alert.alertType.replace('_', ' ')} ({alert.currentStock} units)
              </p>
            ))}
            {alerts.filter(alert => !alert.isResolved).length > 3 && (
              <p className="text-sm text-orange-600">
                +{alerts.filter(alert => !alert.isResolved).length - 3} more alerts
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Search and Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search items by name, SKU, or HSN code..."
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-2" />
            Filters
          </Button>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'table' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <FileText size={16} />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <BarChart3 size={16} />
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                  <option value="Home">Home & Garden</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                <select
                  value={filters.stockStatus || ''}
                  onChange={(e) => handleFilterChange('stockStatus', e.target.value || undefined)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">All Stock</option>
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="discontinued">Discontinued</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GST Rate</label>
                <select
                  value={filters.gstRate || ''}
                  onChange={(e) => handleFilterChange('gstRate', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">All GST Rates</option>
                  <option value="0">0%</option>
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                  <option value="28">28%</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
                <select
                  value={filters.warehouse || ''}
                  onChange={(e) => handleFilterChange('warehouse', e.target.value || undefined)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">All Warehouses</option>
                  <option value="Main Warehouse">Main Warehouse</option>
                  <option value="Electronics Store">Electronics Store</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Storage Facility">Storage Facility</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => setFilters({})}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Items Table/Grid */}
      <Card>
        {viewMode === 'table' ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Item Details</TableHeaderCell>
                <TableHeaderCell>SKU</TableHeaderCell>
                <TableHeaderCell>Category</TableHeaderCell>
                <TableHeaderCell>Current Stock</TableHeaderCell>
                <TableHeaderCell>Location</TableHeaderCell>
                <TableHeaderCell>Price</TableHeaderCell>
                <TableHeaderCell>GST</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-8" colSpan={9}>
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-2">No inventory items found</p>
                    <Button onClick={() => setShowAddForm(true)}>
                      Add your first item
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
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
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(item)}`}>
                          {getStockStatusText(item)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {item.warehouse && (
                          <p className="font-medium text-gray-900">{item.warehouse}</p>
                        )}
                        {item.location && (
                          <p className="text-sm text-gray-600">{item.location}</p>
                        )}
                        {item.rack && (
                          <p className="text-xs text-gray-500">Rack: {item.rack}</p>
                        )}
                        {!item.warehouse && !item.location && !item.rack && (
                          <p className="text-sm text-gray-400">No location set</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">₹{item.sellingPrice.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Cost: ₹{item.costPrice.toLocaleString()}</p>
                      </div>
                    </TableCell>
                    <TableCell>{item.gstRate}%</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedItem(item)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setShowAddForm(true);
                          }}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{item.sku}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(item)}`}>
                      {getStockStatusText(item)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Stock:</span>
                      <span className="text-sm font-medium">{item.currentStock} {item.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Price:</span>
                      <span className="text-sm font-medium">₹{item.sellingPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Category:</span>
                      <span className="text-sm">{item.category}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)}>
                      <Eye size={14} className="mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      setSelectedItem(item);
                      setShowAddForm(true);
                    }}>
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Add/Edit Item Modal */}
      <ItemForm
        item={selectedItem}
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setSelectedItem(null);
        }}
      />

      {/* Item Details Modal */}
      {selectedItem && !showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{selectedItem.name}</h2>
              <Button variant="ghost" onClick={() => setSelectedItem(null)}>
                ×
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Basic Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">SKU:</span>
                    <span className="font-mono">{selectedItem.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span>{selectedItem.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brand:</span>
                    <span>{selectedItem.brand || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">HSN Code:</span>
                    <span>{selectedItem.hsnCode}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Stock & Pricing</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Stock:</span>
                    <span className="font-medium">{selectedItem.currentStock} {selectedItem.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reorder Level:</span>
                    <span>{selectedItem.reorderLevel} {selectedItem.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost Price:</span>
                    <span>₹{selectedItem.costPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selling Price:</span>
                    <span>₹{selectedItem.sellingPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Margin:</span>
                    <span className="text-green-600">₹{selectedItem.margin.toLocaleString()} ({selectedItem.marginPercentage.toFixed(1)}%)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-3">Description</h3>
              <p className="text-gray-700">{selectedItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
