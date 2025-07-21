import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  CreditCard, 
  Package,
  BookOpen,
  Settings,
  Building2,
  BarChart3,
  PieChart,
  Calculator,
  DollarSign,
  ShoppingCart,
  UserCheck,
  Truck,
  Receipt,
  FileBarChart,
  ShoppingBag,
  FileSpreadsheet,
  ClipboardList,
  Box
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const menuItems = [
    {
      section: 'Overview',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
      ]
    },
    {
      section: 'Sales & Purchases',
      items: [
        { icon: FileText, label: 'Invoices', path: '/invoices' },
        { icon: Receipt, label: 'E-Invoices', path: '/e-invoices' },
        { icon: CreditCard, label: 'Payments', path: '/payments' },
        { icon: ShoppingCart, label: 'Purchase Orders', path: '/purchase-orders' },
        { icon: Truck, label: 'E-way Bills', path: '/eway-bills' },
      ]
    },
    {
      section: 'Contacts',
      items: [
        { icon: Users, label: 'Customers', path: '/customers' },
        { icon: UserCheck, label: 'Vendors', path: '/vendors' },
      ]
    },
    {
      section: 'Inventory',
      items: [
        { icon: Package, label: 'Inventory', path: '/inventory' },
        { icon: Box, label: 'Items', path: '/items' },
        { icon: BarChart3, label: 'Stock Report', path: '/stock-report' },
      ]
    },
    {
      section: 'Accounting',
      items: [
        { icon: BookOpen, label: 'Ledger', path: '/ledger' },
        { icon: BarChart3, label: 'Balance Sheet', path: '/balance-sheet' },
        { icon: Calculator, label: 'Journal Entries', path: '/journal-entries' },
        { icon: DollarSign, label: 'Trial Balance', path: '/trial-balance' },
        { icon: PieChart, label: 'Profit & Loss', path: '/profit-loss' },
      ]
    },
    {
      section: 'Reports',
      items: [
        { icon: FileBarChart, label: 'Sales Reports', path: '/reports/sales' },
        { icon: ShoppingBag, label: 'Purchase Reports', path: '/reports/purchase' },
        { icon: FileSpreadsheet, label: 'GSTR1', path: '/reports/gstr1' },
        { icon: ClipboardList, label: 'GSTR3B', path: '/reports/gstr3b' },
      ]
    },
    {
      section: 'Setup',
      items: [
        { icon: Building2, label: 'Company', path: '/company' },
        { icon: Settings, label: 'Settings', path: '/settings' },
      ]
    }
  ];

  return (
    <aside className={`
      h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
      transition-all duration-300 flex flex-col overflow-x-hidden
      ${collapsed ? 'w-16' : 'w-64'}
      fixed md:relative left-0 top-0 z-40
      ${collapsed ? 'transform translate-x-0' : 'transform -translate-x-full md:translate-x-0'}
      md:transform-none shadow-lg md:shadow-none
    `}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 text-gray-900 dark:text-white">
          <Building2 size={32} className="text-blue-500 flex-shrink-0" />
          {!collapsed && (
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">DDAS</h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">Digital Daily Account System</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {!collapsed && (
              <div className="px-4 mb-2">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {section.section}
                </h3>
              </div>
            )}
            <ul className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="px-2">
                  <NavLink 
                    to={item.path} 
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                      text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white
                      ${isActive ? 'bg-blue-600 text-white shadow-lg' : ''}
                      ${collapsed ? 'justify-center' : ''}
                    `}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon size={20} className="flex-shrink-0" />
                    {!collapsed && (
                      <span className="font-medium text-sm truncate">{item.label}</span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-700">
          <div className="text-center">
            <p className="text-xs text-gray-400 font-medium">Version 1.0.0</p>
            <p className="text-xs text-gray-500">© 2025 DDAS</p>
          </div>
        </div>
      )}
    </aside>
  );
}
