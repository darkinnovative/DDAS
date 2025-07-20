import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BillingProvider } from './context/BillingContext';
import { EwayBillProvider } from './context/EwayBillContext';
import { EInvoiceProvider } from './context/EInvoiceContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Invoices } from './components/Invoices';
import { Customers } from './components/Customers';
import { Payments } from './components/Payments';
import { Inventory } from './components/Inventory';
import { Ledger } from './components/Ledger';
import { Settings } from './components/Settings';
import { EwayBills } from './components/EwayBills';
import { EInvoices } from './components/EInvoices';

function AppLayout() {
  const { isAuthenticated } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col md:flex-row relative">
      {/* Mobile backdrop */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'md:w-16' : 'md:w-64'} transition-all duration-300`}>
        <Sidebar collapsed={sidebarCollapsed} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header with enhanced styling */}
        <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 relative z-50 flex-shrink-0">
          <Header onToggleSidebar={toggleSidebar} sidebarCollapsed={sidebarCollapsed} />
        </div>
        
        {/* Visual gap/separator */}
        <div className="h-4 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 
                      dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 
                      shadow-inner border-b border-gray-100 dark:border-gray-600 flex-shrink-0"></div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto min-h-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/e-invoices" element={<EInvoices />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/eway-bills" element={<EwayBills />} />
            <Route path="/items" element={<Inventory />} />
            <Route path="/chart-of-accounts" element={<Ledger />} />
            <Route path="/settings" element={<Settings />} />
            {/* Placeholder routes for additional features */}
            <Route path="/purchase-orders" element={
              <div className="p-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Purchase Orders</h1>
                  <p className="text-gray-600">Coming Soon</p>
                </div>
              </div>
            } />
            <Route path="/vendors" element={
              <div className="p-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Vendors</h1>
                  <p className="text-gray-600">Coming Soon</p>
                </div>
              </div>
            } />
            <Route path="/stock-report" element={
              <div className="p-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Stock Report</h1>
                  <p className="text-gray-600">Coming Soon</p>
                </div>
              </div>
            } />
            <Route path="/journal-entries" element={
              <div className="p-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Journal Entries</h1>
                  <p className="text-gray-600">Coming Soon</p>
                </div>
              </div>
            } />
            <Route path="/trial-balance" element={
              <div className="p-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Trial Balance</h1>
                  <p className="text-gray-600">Coming Soon</p>
                </div>
              </div>
            } />
            <Route path="/profit-loss" element={
              <div className="p-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Profit & Loss</h1>
                  <p className="text-gray-600">Coming Soon</p>
                </div>
              </div>
            } />
            <Route path="/reports" element={
              <div className="p-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports</h1>
                  <p className="text-gray-600">Coming Soon</p>
                </div>
              </div>
            } />
            <Route path="/company" element={
              <div className="p-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Company Settings</h1>
                  <p className="text-gray-600">Coming Soon</p>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BillingProvider>
        <EwayBillProvider>
          <EInvoiceProvider>
            <Router>
              <AppLayout />
            </Router>
          </EInvoiceProvider>
        </EwayBillProvider>
      </BillingProvider>
    </AuthProvider>
  )
}

export default App
