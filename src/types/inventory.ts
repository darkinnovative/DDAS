export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  subcategory?: string;
  brand?: string;
  hsnCode: string;
  unit: 'pcs' | 'kg' | 'gm' | 'ltr' | 'mtr' | 'ft' | 'box' | 'pack' | 'dozen' | 'other';
  customUnit?: string;
  
  // Pricing
  costPrice: number;
  sellingPrice: number;
  mrp: number;
  margin: number;
  marginPercentage: number;
  
  // Stock Management
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderLevel: number;
  
  // Tax Information
  gstRate: number;
  taxCategory: 'taxable' | 'exempt' | 'zero_rated';
  cessRate?: number;
  
  // Physical Properties
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  
  // Location
  location?: string;
  warehouse?: string;
  rack?: string;
  
  // Status
  isActive: boolean;
  isDiscontinued: boolean;
  
  // Vendor Information
  preferredVendorId?: string;
  vendorIds: string[];
  
  // Images
  images: string[];
  barcode?: string;
  
  // Tracking
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface StockTransaction {
  id: string;
  itemId: string;
  item?: InventoryItem;
  type: 'purchase' | 'sale' | 'adjustment' | 'return' | 'transfer' | 'damaged' | 'expired';
  quantity: number;
  unitPrice: number;
  totalValue: number;
  referenceType: 'invoice' | 'purchase_order' | 'stock_adjustment' | 'return' | 'other';
  referenceId?: string;
  referenceNumber?: string;
  notes?: string;
  performedBy: string;
  createdAt: Date;
}

export interface StockAdjustment {
  id: string;
  itemId: string;
  item?: InventoryItem;
  adjustmentType: 'increase' | 'decrease';
  quantity: number;
  reason: 'damaged' | 'expired' | 'lost' | 'found' | 'count_correction' | 'other';
  notes?: string;
  performedBy: string;
  createdAt: Date;
}

export interface LowStockAlert {
  id: string;
  itemId: string;
  item?: InventoryItem;
  currentStock: number;
  reorderLevel: number;
  alertType: 'low_stock' | 'out_of_stock' | 'overstock';
  isResolved: boolean;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface InventoryReport {
  totalItems: number;
  totalStockValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  discontinuedItems: number;
  topSellingItems: InventoryItem[];
  slowMovingItems: InventoryItem[];
  profitMarginAnalysis: {
    averageMargin: number;
    highestMarginItem: InventoryItem;
    lowestMarginItem: InventoryItem;
  };
}

export interface InventoryCategory {
  id: string;
  name: string;
  description?: string;
  parentCategoryId?: string;
  subcategories: string[];
  itemCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  status?: 'active' | 'inactive' | 'discontinued';
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  priceRange?: {
    min: number;
    max: number;
  };
  gstRate?: number;
  warehouse?: string;
  location?: string;
}

export interface InventoryStats {
  totalItems: number;
  activeItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
  averageMargin: number;
}
