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
  X
} from 'lucide-react';
import { useIsMobile, useIsTablet } from '../../hooks/useResponsive';
import { useEffect } from 'react';

interface SidebarProps {
  collapsed: boolean;
  onClose?: () => void;
}

export function Sidebar({ collapsed, onClose }: SidebarProps) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  // Close sidebar when clicking outside on mobile/tablet
  useEffect(() => {
    if (isMobile || isTablet) {
      const handleClickOutside = (event: MouseEvent) => {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && !sidebar.contains(event.target as Node) && !collapsed && onClose) {
          onClose();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [collapsed, isMobile, isTablet, onClose]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && !collapsed) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isMobile, collapsed]);
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
    <>
      {/* Mobile/Tablet Backdrop Overlay */}
      {(isMobile || isTablet) && !collapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside 
        id="sidebar"
        className={`
          h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
          transition-all duration-300 flex flex-col overflow-x-hidden
          ${isMobile || isTablet ? (
            /* Mobile/Tablet: Full overlay sidebar */
            `fixed left-0 top-0 z-40 shadow-xl
             ${collapsed ? 'w-0' : 'w-80 sm:w-72'}
             ${collapsed ? 'transform -translate-x-full' : 'transform translate-x-0'}`
          ) : (
            /* Desktop: Standard sidebar behavior */
            `relative z-10 shadow-none
             ${collapsed ? 'w-16' : 'w-64 xl:w-72'}
             transform translate-x-0`
          )}
        `}
      >
        {/* Mobile Header with Close Button */}
        {(isMobile || isTablet) && !collapsed && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center gap-3">
              <Building2 size={28} className="text-primary-500 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">DDAS</h2>
                <span className="text-xs text-gray-500 dark:text-gray-400">Digital Daily Account System</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 
                       hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Desktop Header */}
        {!(isMobile || isTablet) && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 text-gray-900 dark:text-white">
              <Building2 size={collapsed ? 28 : 32} className="text-primary-500 flex-shrink-0" />
              {!collapsed && (
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">DDAS</h2>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Digital Daily Account System</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 sm:py-4">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-4 sm:mb-6">
              {(!collapsed || (isMobile || isTablet)) && (
                <div className="px-3 sm:px-4 mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {section.section}
                  </h3>
                </div>
              )}
              <ul className="space-y-0.5 sm:space-y-1">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="px-2">
                    <NavLink 
                      to={item.path} 
                      onClick={(isMobile || isTablet) ? onClose : undefined}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2.5 sm:py-3 rounded-lg transition-all duration-200
                        text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 
                        hover:text-gray-900 dark:hover:text-white
                        ${isActive ? 'bg-primary-600 text-white shadow-lg hover:bg-primary-700' : ''}
                        ${collapsed && !(isMobile || isTablet) ? 'justify-center' : ''}
                        text-sm sm:text-base
                      `}
                      title={collapsed && !(isMobile || isTablet) ? item.label : undefined}
                    >
                      <item.icon size={isMobile ? 18 : 20} className="flex-shrink-0" />
                      {(!collapsed || (isMobile || isTablet)) && (
                        <span className="font-medium text-sm sm:text-base truncate">{item.label}</span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer - Only show on desktop or when expanded */}
        {(!collapsed || (isMobile || isTablet)) && !(isMobile && isTablet) && (
          <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <div className="text-center">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Version 1.0.0</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">© 2025 DDAS</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
