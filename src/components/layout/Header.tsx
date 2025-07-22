import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';
import { useIsMobile, useIsTablet } from '../../hooks/useResponsive';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export function Header({ onToggleSidebar, sidebarCollapsed }: HeaderProps) {
  const { user, logout, toggleTheme, isDarkMode } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const notifications = [
    { id: 1, message: 'New invoice created', time: '5 min ago', unread: true },
    { id: 2, message: 'Payment received', time: '1 hour ago', unread: true },
    { id: 3, message: 'Monthly report ready', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 
                     flex items-center justify-between px-3 sm:px-4 lg:px-6 shadow-sm sticky top-0 z-40">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        {/* Mobile Menu Toggle */}
        <button 
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 
                   hover:text-gray-900 dark:hover:text-white transition-colors lg:hidden"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
        >
          {sidebarCollapsed ? <Menu size={isMobile ? 18 : 20} /> : <X size={isMobile ? 18 : 20} />}
        </button>

        {/* Desktop Sidebar Toggle */}
        <button 
          className="hidden lg:flex p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 
                   dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>

        {/* Search Bar - Hidden on mobile, responsive width */}
        <div className={`relative hidden sm:block transition-all duration-200 ${
          showMobileSearch ? 'w-full' : 'w-64 md:w-80 lg:w-96 max-w-md'
        }`}>
          <Search size={isMobile ? 16 : 20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search invoices, customers..."
            className="w-full pl-9 sm:pl-10 pr-4 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 
                     rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                     bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                     transition-all duration-200"
          />
        </div>

        {/* Mobile Search Toggle */}
        <button 
          className="sm:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 
                   dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          aria-label="Toggle search"
        >
          <Search size={18} />
        </button>
      </div>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-white dark:bg-gray-800 z-50 flex flex-col sm:hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Search</h2>
            <button 
              onClick={() => setShowMobileSearch(false)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 
                       dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search invoices, customers..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            className="relative p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 
                     dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell size={isMobile ? 18 : 20} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 bg-red-500 text-white rounded-full 
                             text-xs font-semibold flex items-center justify-center min-w-0">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              {/* Mobile/Tablet Fullscreen Overlay */}
              {(isMobile || isTablet) ? (
                <div className="fixed inset-0 bg-white dark:bg-gray-800 z-50 flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 
                               dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`px-4 py-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 
                                    dark:hover:bg-gray-700 cursor-pointer transition-colors
                                    ${notification.unread ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-l-primary-500' : ''}`}
                        >
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{notification.message}</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 px-4">
                        <Bell size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-center">No notifications yet</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Desktop Dropdown */
                <div className="absolute right-0 top-full mt-2 w-80 xl:w-96 bg-white dark:bg-gray-800 
                              border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 
                                       dark:hover:text-primary-300 transition-colors">
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 
                                    dark:hover:bg-gray-700 cursor-pointer last:border-b-0 transition-colors
                                    ${notification.unread ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-l-primary-500' : ''}`}
                        >
                          <p className="text-sm text-gray-900 dark:text-white mb-1">{notification.message}</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 px-4">
                        <Bell size={32} className="text-gray-300 dark:text-gray-600 mb-2" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 
                   dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
          onClick={toggleTheme}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun size={isMobile ? 18 : 20} /> : <Moon size={isMobile ? 18 : 20} />}
        </button>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 
                     dark:hover:bg-gray-700 transition-colors"
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="User menu"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
              ) : (
                <User size={isMobile ? 16 : 20} className="text-gray-600 dark:text-gray-300" />
              )}
            </div>
            {/* Hide user info on mobile, show abbreviated on tablet, full on desktop */}
            <div className="hidden sm:block text-left min-w-0">
              <span className="block text-sm font-medium text-gray-900 dark:text-white truncate">
                {isMobile || isTablet ? user?.firstName : `${user?.firstName} ${user?.lastName}`}
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                {user?.role}
              </span>
            </div>
            <ChevronDown 
              size={isMobile ? 14 : 16} 
              className="text-gray-400 dark:text-gray-500 hidden sm:block flex-shrink-0" 
            />
          </button>

          {showUserMenu && (
            <>
              {/* Mobile/Tablet Fullscreen User Menu */}
              {(isMobile || isTablet) ? (
                <div className="fixed inset-0 bg-white dark:bg-gray-800 z-50 flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Account</h2>
                    <button 
                      onClick={() => setShowUserMenu(false)}
                      className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 
                               dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  {/* User Info */}
                  <div className="px-4 py-6 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
                        ) : (
                          <User size={32} className="text-gray-600 dark:text-gray-300" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-lg font-medium text-gray-900 dark:text-white truncate">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-4">
                    <button className="w-full flex items-center gap-4 px-6 py-4 text-left text-gray-700 dark:text-gray-300 
                                     hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <User size={20} />
                      <span className="text-base">Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-4 px-6 py-4 text-left text-gray-700 dark:text-gray-300 
                                     hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Settings size={20} />
                      <span className="text-base">Settings</span>
                    </button>
                    <hr className="my-4 border-gray-200 dark:border-gray-700" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-4 px-6 py-4 text-left text-red-600 dark:text-red-400 
                               hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut size={20} />
                      <span className="text-base">Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Desktop User Menu Dropdown */
                <div className="absolute right-0 top-full mt-2 w-60 xl:w-72 bg-white dark:bg-gray-800 
                              border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 
                                flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} className="text-gray-600 dark:text-gray-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 
                                     hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <User size={16} />
                      Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 
                                     hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Settings size={16} />
                      Settings
                    </button>
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 
                               hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
