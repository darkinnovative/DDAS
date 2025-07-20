import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { generateSampleData } from '../utils/sampleData';
import type { 
  InventoryItem, 
  StockTransaction, 
  StockAdjustment, 
  LowStockAlert, 
  InventoryFilters,
  InventoryStats,
  InventoryCategory
} from '../types/inventory';

interface InventoryState {
  items: InventoryItem[];
  categories: InventoryCategory[];
  transactions: StockTransaction[];
  adjustments: StockAdjustment[];
  alerts: LowStockAlert[];
  stats: InventoryStats;
  filters: InventoryFilters;
  isLoading: boolean;
  error: string | null;
}

type InventoryAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ITEMS'; payload: InventoryItem[] }
  | { type: 'ADD_ITEM'; payload: InventoryItem }
  | { type: 'UPDATE_ITEM'; payload: InventoryItem }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: InventoryCategory[] }
  | { type: 'ADD_CATEGORY'; payload: InventoryCategory }
  | { type: 'UPDATE_CATEGORY'; payload: InventoryCategory }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_TRANSACTIONS'; payload: StockTransaction[] }
  | { type: 'ADD_TRANSACTION'; payload: StockTransaction }
  | { type: 'SET_ADJUSTMENTS'; payload: StockAdjustment[] }
  | { type: 'ADD_ADJUSTMENT'; payload: StockAdjustment }
  | { type: 'SET_ALERTS'; payload: LowStockAlert[] }
  | { type: 'ADD_ALERT'; payload: LowStockAlert }
  | { type: 'RESOLVE_ALERT'; payload: string }
  | { type: 'SET_STATS'; payload: InventoryStats }
  | { type: 'SET_FILTERS'; payload: InventoryFilters }
  | { type: 'UPDATE_STOCK'; payload: { itemId: string; quantity: number } };

const initialState: InventoryState = {
  items: [],
  categories: [],
  transactions: [],
  adjustments: [],
  alerts: [],
  stats: {
    totalItems: 0,
    activeItems: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalValue: 0,
    averageMargin: 0
  },
  filters: {},
  isLoading: false,
  error: null
};

function inventoryReducer(state: InventoryState, action: InventoryAction): InventoryState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_ITEMS':
      return { ...state, items: action.payload, error: null };
    
    case 'ADD_ITEM':
      return { 
        ...state, 
        items: [...state.items, action.payload],
        error: null 
      };
    
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.id ? action.payload : item
        ),
        error: null
      };
    
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        error: null
      };
    
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload, error: null };
    
    case 'ADD_CATEGORY':
      return { 
        ...state, 
        categories: [...state.categories, action.payload],
        error: null 
      };
    
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category => 
          category.id === action.payload.id ? action.payload : category
        ),
        error: null
      };
    
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
        error: null
      };
    
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload, error: null };
    
    case 'ADD_TRANSACTION':
      return { 
        ...state, 
        transactions: [action.payload, ...state.transactions],
        error: null 
      };
    
    case 'SET_ADJUSTMENTS':
      return { ...state, adjustments: action.payload, error: null };
    
    case 'ADD_ADJUSTMENT':
      return { 
        ...state, 
        adjustments: [action.payload, ...state.adjustments],
        error: null 
      };
    
    case 'SET_ALERTS':
      return { ...state, alerts: action.payload, error: null };
    
    case 'ADD_ALERT':
      return { 
        ...state, 
        alerts: [action.payload, ...state.alerts],
        error: null 
      };
    
    case 'RESOLVE_ALERT':
      return {
        ...state,
        alerts: state.alerts.map(alert => 
          alert.id === action.payload 
            ? { ...alert, isResolved: true, resolvedAt: new Date() }
            : alert
        ),
        error: null
      };
    
    case 'SET_STATS':
      return { ...state, stats: action.payload, error: null };
    
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    
    case 'UPDATE_STOCK':
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.itemId 
            ? { ...item, currentStock: action.payload.quantity, updatedAt: new Date() }
            : item
        ),
        error: null
      };
    
    default:
      return state;
  }
}

interface InventoryContextType extends InventoryState {
  // Item management
  addItem: (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (item: InventoryItem) => void;
  deleteItem: (id: string) => void;
  getItemById: (id: string) => InventoryItem | undefined;
  
  // Category management
  addCategory: (category: Omit<InventoryCategory, 'id' | 'createdAt' | 'updatedAt' | 'itemCount'>) => void;
  updateCategory: (category: InventoryCategory) => void;
  deleteCategory: (id: string) => void;
  
  // Stock management
  addStockTransaction: (transaction: Omit<StockTransaction, 'id' | 'createdAt'>) => void;
  addStockAdjustment: (adjustment: Omit<StockAdjustment, 'id' | 'createdAt'>) => void;
  updateStock: (itemId: string, quantity: number, type: StockTransaction['type'], notes?: string) => void;
  
  // Alerts
  resolveAlert: (alertId: string) => void;
  checkLowStock: () => void;
  
  // Filtering and search
  setFilters: (filters: InventoryFilters) => void;
  getFilteredItems: () => InventoryItem[];
  
  // Calculations
  calculateStats: () => void;
  calculateItemMargin: (costPrice: number, sellingPrice: number) => { margin: number; percentage: number };
  
  // Data management
  loadData: () => void;
  exportData: () => void;
  importData: (data: any) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const STORAGE_KEY = 'ddas-inventory-data';

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(inventoryReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (state.items.length > 0 || state.categories.length > 0) {
      const dataToSave = {
        items: state.items,
        categories: state.categories,
        transactions: state.transactions,
        adjustments: state.adjustments,
        alerts: state.alerts
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [state.items, state.categories, state.transactions, state.adjustments, state.alerts]);

  const loadData = () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const data = JSON.parse(savedData);
        dispatch({ type: 'SET_ITEMS', payload: data.items || [] });
        dispatch({ type: 'SET_CATEGORIES', payload: data.categories || [] });
        dispatch({ type: 'SET_TRANSACTIONS', payload: data.transactions || [] });
        dispatch({ type: 'SET_ADJUSTMENTS', payload: data.adjustments || [] });
        dispatch({ type: 'SET_ALERTS', payload: data.alerts || [] });
      } else {
        // Load sample data if no data exists
        const sampleData = generateSampleData();
        if (sampleData.inventoryItems && sampleData.inventoryCategories) {
          dispatch({ type: 'SET_ITEMS', payload: sampleData.inventoryItems });
          dispatch({ type: 'SET_CATEGORIES', payload: sampleData.inventoryCategories });
        }
      }
      calculateStats();
      checkLowStock();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load inventory data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addItem = (itemData: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user', // Replace with actual user
      updatedBy: 'current-user'
    };
    dispatch({ type: 'ADD_ITEM', payload: newItem });
    calculateStats();
    checkLowStock();
  };

  const updateItem = (item: InventoryItem) => {
    const updatedItem = { ...item, updatedAt: new Date(), updatedBy: 'current-user' };
    dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
    calculateStats();
    checkLowStock();
  };

  const deleteItem = (id: string) => {
    dispatch({ type: 'DELETE_ITEM', payload: id });
    calculateStats();
  };

  const getItemById = (id: string) => {
    return state.items.find(item => item.id === id);
  };

  const addCategory = (categoryData: Omit<InventoryCategory, 'id' | 'createdAt' | 'updatedAt' | 'itemCount'>) => {
    const newCategory: InventoryCategory = {
      ...categoryData,
      id: Date.now().toString(),
      itemCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
  };

  const updateCategory = (category: InventoryCategory) => {
    const updatedCategory = { ...category, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_CATEGORY', payload: updatedCategory });
  };

  const deleteCategory = (id: string) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
  };

  const addStockTransaction = (transactionData: Omit<StockTransaction, 'id' | 'createdAt'>) => {
    const newTransaction: StockTransaction = {
      ...transactionData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    
    // Update stock quantity based on transaction type
    const item = state.items.find(i => i.id === transactionData.itemId);
    if (item) {
      let newStock = item.currentStock;
      if (['purchase', 'return'].includes(transactionData.type)) {
        newStock += transactionData.quantity;
      } else if (['sale', 'adjustment', 'damaged', 'expired'].includes(transactionData.type)) {
        newStock -= transactionData.quantity;
      }
      dispatch({ type: 'UPDATE_STOCK', payload: { itemId: item.id, quantity: Math.max(0, newStock) } });
    }
    
    calculateStats();
    checkLowStock();
  };

  const addStockAdjustment = (adjustmentData: Omit<StockAdjustment, 'id' | 'createdAt'>) => {
    const newAdjustment: StockAdjustment = {
      ...adjustmentData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    dispatch({ type: 'ADD_ADJUSTMENT', payload: newAdjustment });
    
    // Create corresponding transaction
    addStockTransaction({
      itemId: adjustmentData.itemId,
      type: 'adjustment',
      quantity: adjustmentData.quantity,
      unitPrice: 0,
      totalValue: 0,
      referenceType: 'stock_adjustment',
      referenceId: newAdjustment.id,
      notes: adjustmentData.notes,
      performedBy: adjustmentData.performedBy
    });
  };

  const updateStock = (itemId: string, quantity: number, type: StockTransaction['type'], notes?: string) => {
    const item = state.items.find(i => i.id === itemId);
    if (item) {
      addStockTransaction({
        itemId,
        type,
        quantity,
        unitPrice: item.costPrice,
        totalValue: quantity * item.costPrice,
        referenceType: 'other',
        notes,
        performedBy: 'current-user'
      });
    }
  };

  const resolveAlert = (alertId: string) => {
    dispatch({ type: 'RESOLVE_ALERT', payload: alertId });
  };

  const checkLowStock = () => {
    const alerts: LowStockAlert[] = [];
    
    state.items.forEach(item => {
      if (item.isActive && !item.isDiscontinued) {
        if (item.currentStock === 0) {
          alerts.push({
            id: `alert-${item.id}-${Date.now()}`,
            itemId: item.id,
            item,
            currentStock: item.currentStock,
            reorderLevel: item.reorderLevel,
            alertType: 'out_of_stock',
            isResolved: false,
            createdAt: new Date()
          });
        } else if (item.currentStock <= item.reorderLevel) {
          alerts.push({
            id: `alert-${item.id}-${Date.now()}`,
            itemId: item.id,
            item,
            currentStock: item.currentStock,
            reorderLevel: item.reorderLevel,
            alertType: 'low_stock',
            isResolved: false,
            createdAt: new Date()
          });
        } else if (item.maxStock > 0 && item.currentStock > item.maxStock) {
          alerts.push({
            id: `alert-${item.id}-${Date.now()}`,
            itemId: item.id,
            item,
            currentStock: item.currentStock,
            reorderLevel: item.reorderLevel,
            alertType: 'overstock',
            isResolved: false,
            createdAt: new Date()
          });
        }
      }
    });
    
    // Remove resolved alerts and add new ones
    const existingUnresolvedAlerts = state.alerts.filter(alert => !alert.isResolved);
    dispatch({ type: 'SET_ALERTS', payload: [...existingUnresolvedAlerts, ...alerts] });
  };

  const setFilters = (filters: InventoryFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const getFilteredItems = () => {
    let filtered = [...state.items];
    
    if (state.filters.search) {
      const search = state.filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.sku.toLowerCase().includes(search) ||
        item.hsnCode.includes(search)
      );
    }
    
    if (state.filters.category) {
      filtered = filtered.filter(item => item.category === state.filters.category);
    }
    
    if (state.filters.subcategory) {
      filtered = filtered.filter(item => item.subcategory === state.filters.subcategory);
    }
    
    if (state.filters.brand) {
      filtered = filtered.filter(item => item.brand === state.filters.brand);
    }
    
    if (state.filters.status) {
      if (state.filters.status === 'active') {
        filtered = filtered.filter(item => item.isActive && !item.isDiscontinued);
      } else if (state.filters.status === 'inactive') {
        filtered = filtered.filter(item => !item.isActive);
      } else if (state.filters.status === 'discontinued') {
        filtered = filtered.filter(item => item.isDiscontinued);
      }
    }
    
    if (state.filters.stockStatus) {
      if (state.filters.stockStatus === 'in_stock') {
        filtered = filtered.filter(item => item.currentStock > item.reorderLevel);
      } else if (state.filters.stockStatus === 'low_stock') {
        filtered = filtered.filter(item => item.currentStock <= item.reorderLevel && item.currentStock > 0);
      } else if (state.filters.stockStatus === 'out_of_stock') {
        filtered = filtered.filter(item => item.currentStock === 0);
      }
    }
    
    if (state.filters.priceRange) {
      filtered = filtered.filter(item => 
        item.sellingPrice >= state.filters.priceRange!.min &&
        item.sellingPrice <= state.filters.priceRange!.max
      );
    }
    
    if (state.filters.gstRate !== undefined) {
      filtered = filtered.filter(item => item.gstRate === state.filters.gstRate);
    }
    
    if (state.filters.warehouse) {
      filtered = filtered.filter(item => item.warehouse === state.filters.warehouse);
    }
    
    if (state.filters.location) {
      filtered = filtered.filter(item => 
        item.location?.toLowerCase().includes(state.filters.location!.toLowerCase())
      );
    }
    
    return filtered;
  };

  const calculateItemMargin = (costPrice: number, sellingPrice: number) => {
    const margin = sellingPrice - costPrice;
    const percentage = costPrice > 0 ? (margin / costPrice) * 100 : 0;
    return { margin, percentage };
  };

  const calculateStats = () => {
    const activeItems = state.items.filter(item => item.isActive);
    const lowStockItems = activeItems.filter(item => item.currentStock <= item.reorderLevel);
    const outOfStockItems = activeItems.filter(item => item.currentStock === 0);
    
    const totalValue = state.items.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0);
    const totalMargin = state.items.reduce((sum, item) => sum + item.margin, 0);
    const averageMargin = state.items.length > 0 ? totalMargin / state.items.length : 0;
    
    const stats: InventoryStats = {
      totalItems: state.items.length,
      activeItems: activeItems.length,
      lowStockItems: lowStockItems.length,
      outOfStockItems: outOfStockItems.length,
      totalValue,
      averageMargin
    };
    
    dispatch({ type: 'SET_STATS', payload: stats });
  };

  const exportData = () => {
    const dataToExport = {
      items: state.items,
      categories: state.categories,
      transactions: state.transactions,
      adjustments: state.adjustments,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (data: any) => {
    try {
      if (data.items) dispatch({ type: 'SET_ITEMS', payload: data.items });
      if (data.categories) dispatch({ type: 'SET_CATEGORIES', payload: data.categories });
      if (data.transactions) dispatch({ type: 'SET_TRANSACTIONS', payload: data.transactions });
      if (data.adjustments) dispatch({ type: 'SET_ADJUSTMENTS', payload: data.adjustments });
      calculateStats();
      checkLowStock();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to import data' });
    }
  };

  const contextValue: InventoryContextType = {
    ...state,
    addItem,
    updateItem,
    deleteItem,
    getItemById,
    addCategory,
    updateCategory,
    deleteCategory,
    addStockTransaction,
    addStockAdjustment,
    updateStock,
    resolveAlert,
    checkLowStock,
    setFilters,
    getFilteredItems,
    calculateStats,
    calculateItemMargin,
    loadData,
    exportData,
    importData
  };

  return (
    <InventoryContext.Provider value={contextValue}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
