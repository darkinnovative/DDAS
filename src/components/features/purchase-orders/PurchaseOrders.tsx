import { useState } from 'react';
import { format } from 'date-fns';
import { 
  Plus, 
  Search, 
  Eye,
  Edit3,
  Trash2,
  Send,
  X,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Package,
  DollarSign
} from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Table } from '../../ui/Table';
import type { PurchaseOrder } from '../../../types/billing';

// We'll define the components inline for now to avoid circular imports
// import { PurchaseOrderForm } from './PurchaseOrderForm';
// import { PurchaseOrderView } from './PurchaseOrderView';

// Sample data for demonstration
const samplePurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    poNumber: 'PO-2024-001',
    vendorId: 'vendor-1',
    vendor: {
      id: 'vendor-1',
      name: 'Tech Solutions Pvt Ltd',
      email: 'sales@techsolutions.com',
      phone: '+91 98765 43210',
      address: {
        street: '456 Industrial Area',
        city: 'Noida',
        state: 'Uttar Pradesh',
        zipCode: '201301',
        country: 'India'
      },
      gstNumber: '09AAACT2727Q1ZS',
      stateCode: '09',
      category: 'goods',
      paymentTerms: 'net30',
      isActive: true,
      rating: 5,
      totalPurchases: 250000,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    items: [
      {
        id: 'item-1',
        description: 'Laptop - Dell Inspiron 15',
        specifications: 'Intel Core i5, 8GB RAM, 512GB SSD',
        quantity: 10,
        unitPrice: 45000,
        total: 450000,
        gstRate: 0.18,
        gstAmount: 81000,
        hsnCode: '8471',
        taxableValue: 450000,
        unit: 'Pieces',
        deliveryDate: new Date('2024-12-30')
      }
    ],
    subtotal: 450000,
    taxRate: 0.18,
    taxAmount: 81000,
    cgstAmount: 40500,
    sgstAmount: 40500,
    igstAmount: 0,
    totalGst: 81000,
    total: 531000,
    status: 'approved',
    orderDate: new Date('2024-12-15'),
    expectedDeliveryDate: new Date('2024-12-30'),
    approvedBy: 'John Doe',
    approvedDate: new Date('2024-12-16'),
    notes: 'Urgent requirement for new office setup',
    terms: 'Standard terms and conditions apply',
    gstType: 'intrastate',
    priority: 'high',
    paymentTerms: 'net30',
    contactPerson: 'Rajesh Kumar',
    contactPhone: '+91 98765 43210',
    contactEmail: 'rajesh@techsolutions.com',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-16')
  },
  {
    id: '2',
    poNumber: 'PO-2024-002',
    vendorId: 'vendor-2',
    vendor: {
      id: 'vendor-2',
      name: 'Office Supplies Co.',
      email: 'contact@officesupplies.com',
      phone: '+91 87654 32109',
      address: {
        street: '789 Commercial Complex',
        city: 'Gurugram',
        state: 'Haryana',
        zipCode: '122001',
        country: 'India'
      },
      gstNumber: '06AABCO6789M1ZX',
      stateCode: '06',
      category: 'goods',
      paymentTerms: 'net15',
      isActive: true,
      rating: 4,
      totalPurchases: 150000,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01')
    },
    items: [
      {
        id: 'item-2',
        description: 'Office Chairs',
        specifications: 'Ergonomic, Height adjustable, Black color',
        quantity: 20,
        unitPrice: 8500,
        total: 170000,
        gstRate: 0.18,
        gstAmount: 30600,
        hsnCode: '9401',
        taxableValue: 170000,
        unit: 'Pieces',
        deliveryDate: new Date('2024-12-28')
      }
    ],
    subtotal: 170000,
    taxRate: 0.18,
    taxAmount: 30600,
    cgstAmount: 15300,
    sgstAmount: 15300,
    igstAmount: 0,
    totalGst: 30600,
    total: 200600,
    status: 'sent',
    orderDate: new Date('2024-12-18'),
    expectedDeliveryDate: new Date('2024-12-28'),
    notes: 'Please ensure quality packaging',
    gstType: 'intrastate',
    priority: 'medium',
    paymentTerms: 'net15',
    contactPerson: 'Priya Sharma',
    contactPhone: '+91 87654 32109',
    contactEmail: 'priya@officesupplies.com',
    createdAt: new Date('2024-12-18'),
    updatedAt: new Date('2024-12-18')
  }
];

export function PurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(samplePurchaseOrders);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="w-4 h-4 text-gray-500" />;
      case 'sent':
        return <Send className="w-4 h-4 text-blue-500" />;
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'received':
        return <Package className="w-4 h-4 text-purple-500" />;
      case 'cancelled':
        return <X className="w-4 h-4 text-red-500" />;
      case 'partially_received':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'received':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'partially_received':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPurchaseOrders = purchaseOrders.filter(po => {
    const matchesSearch = po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.vendor?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setIsFormOpen(true);
  };

  const handleView = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setIsViewOpen(true);
  };

  const handleDelete = (id: string) => {
    setPurchaseOrders(prev => prev.filter(po => po.id !== id));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Purchase Orders
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your purchase orders and supplier relationships
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={() => {
              setSelectedPO(null);
              setIsFormOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Purchase Order
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total POs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{purchaseOrders.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {purchaseOrders.filter(po => po.status === 'approved').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {purchaseOrders.filter(po => po.status === 'sent' || po.status === 'draft').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(purchaseOrders.reduce((sum, po) => sum + po.total, 0))}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by PO number or vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="approved">Approved</option>
              <option value="received">Received</option>
              <option value="cancelled">Cancelled</option>
              <option value="partially_received">Partially Received</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  PO Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Expected Delivery
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
              {filteredPurchaseOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No purchase orders found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {searchTerm || statusFilter !== 'all'
                        ? 'Try adjusting your search or filters'
                        : 'Get started by creating your first purchase order'}
                    </p>
                    {(!searchTerm && statusFilter === 'all') && (
                      <Button
                        onClick={() => {
                          setSelectedPO(null);
                          setIsFormOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Purchase Order
                      </Button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredPurchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{po.poNumber}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {format(po.orderDate, 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{po.vendor?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{po.vendor?.gstNumber}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(po.total)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(po.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(po.status)}`}>
                          {po.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(po.priority)}`}>
                        {po.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {format(po.expectedDeliveryDate, 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(po)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(po)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(po.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Purchase Order Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedPO ? 'Edit Purchase Order' : 'New Purchase Order'}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => {
                setIsFormOpen(false);
                setSelectedPO(null);
              }}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Purchase Order Form
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Purchase Order form is under development. Full functionality coming soon!
                </p>
                <Button
                  onClick={() => {
                    setIsFormOpen(false);
                    setSelectedPO(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Order View Modal */}
      {isViewOpen && selectedPO && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Purchase Order - {selectedPO.poNumber}
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsViewOpen(false);
                    setIsFormOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => {
                  setIsViewOpen(false);
                  setSelectedPO(null);
                }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Order Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">PO Number:</span>
                      <span className="font-semibold">{selectedPO.poNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Order Date:</span>
                      <span>{format(selectedPO.orderDate, 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Expected Delivery:</span>
                      <span>{format(selectedPO.expectedDeliveryDate, 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPO.status)}`}>
                        {selectedPO.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Vendor Details
                  </h3>
                  <div className="space-y-2">
                    <h4 className="font-semibold">{selectedPO.vendor?.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedPO.vendor?.address?.street}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedPO.vendor?.address?.city}, {selectedPO.vendor?.address?.state}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      GST: {selectedPO.vendor?.gstNumber}
                    </p>
                  </div>
                </Card>
              </div>
              
              <Card className="p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Order Items
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 dark:border-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left border-b">Item</th>
                        <th className="px-4 py-2 text-center border-b">Qty</th>
                        <th className="px-4 py-2 text-right border-b">Unit Price</th>
                        <th className="px-4 py-2 text-right border-b">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPO.items.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2">{item.description}</td>
                          <td className="px-4 py-2 text-center">{item.quantity}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                          <td className="px-4 py-2 text-right font-semibold">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedPO.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({(selectedPO.taxRate * 100).toFixed(1)}%):</span>
                    <span>{formatCurrency(selectedPO.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedPO.total)}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
