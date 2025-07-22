import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BillingProvider } from './context/BillingContext';
import { EwayBillProvider } from './context/EwayBillContext';
import { EInvoiceProvider } from './context/EInvoiceContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/features/auth';
import { Header, Sidebar } from './components/layout';
import { Dashboard } from './components/features/dashboard';
import { Invoices } from './components/features/invoices';
import { Customers } from './components/features/customers';
import { Vendors } from './components/features/vendors';
import { Payments } from './components/features/payments';
import { Ledger } from './components/features/ledger';
import { Settings } from './components/features/settings';
import { EwayBills } from './components/features/eway-bills';
import { EInvoices } from './components/features/einvoices';
import { Inventory } from './components/features/inventory';
import { PurchaseOrders } from './components/features/purchase-orders';
import { BalanceSheet, SalesReports, PurchaseReports, GSTR1Reports, GSTR3BReports, ProfitLoss, StockReport } from './components/features/reports';

function AppLayout() {
  console.log('🎨 AppLayout is rendering...');
  
  const { isAuthenticated } = useAuth();
  console.log('🔐 isAuthenticated:', isAuthenticated);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  console.log('✨ AppLayout rendered successfully');

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900`}>
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={toggleSidebar} sidebarCollapsed={sidebarCollapsed} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/ledger" element={<Ledger />} />
            <Route path="/balance-sheet" element={<BalanceSheet />} />
            <Route path="/journal-entries" element={
              <div className="p-6">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Journal Entries
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Journal Entries management coming soon...
                  </p>
                </div>
              </div>
            } />
            <Route path="/trial-balance" element={
              <div className="p-6">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Trial Balance
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Trial Balance report coming soon...
                  </p>
                </div>
              </div>
            } />
            <Route path="/profit-loss" element={<ProfitLoss />} />
            <Route path="/reports/sales" element={<SalesReports />} />
            <Route path="/reports/purchase" element={<PurchaseReports />} />
            <Route path="/reports/gstr1" element={<GSTR1Reports />} />
            <Route path="/reports/gstr3b" element={<GSTR3BReports />} />
            <Route path="/stock-report" element={<StockReport />} />
            <Route path="/eway-bills" element={<EwayBills />} />
            <Route path="/e-invoices" element={<EInvoices />} />
            <Route path="/company" element={<Settings />} />
            <Route path="/purchase-orders" element={<PurchaseOrders />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Page Not Found
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    The page you're looking for doesn't exist.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Current path: {window.location.pathname}
                  </p>
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
  console.log('🚀 App component is loading...');
  
  try {
    console.log('🔧 Setting up providers...');
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
    );
  } catch (error) {
    console.error('💥 Error in App:', error);
    return (
      <div style={{ padding: '20px', color: 'red', fontFamily: 'Arial, sans-serif' }}>
        <h1>Application Error</h1>
        <p>Error: {error instanceof Error ? error.message : String(error)}</p>
        <p>Check the console for more details.</p>
      </div>
    );
  }
}

export default App;
