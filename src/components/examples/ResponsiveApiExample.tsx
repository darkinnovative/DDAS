import { useState } from 'react';
import { 
  useIsMobile, 
  useIsTablet, 
  useBreakpoint, 
  useWindowSize,
  Container,
  ResponsiveGrid,
  Show,
  Hide
} from '../../hooks/useResponsive';
import { invoiceApi } from '../../services/invoiceApi';
import { authApi } from '../../services/authApi';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Wifi, 
  WifiOff,
  Loader,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface ApiStatus {
  auth: 'idle' | 'loading' | 'success' | 'error';
  invoices: 'idle' | 'loading' | 'success' | 'error';
}

export function ResponsiveApiExample() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    auth: 'idle',
    invoices: 'idle'
  });
  const [authResult, setAuthResult] = useState<any>(null);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  
  // Responsive hooks
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useBreakpoint('lg');
  const windowSize = useWindowSize();

  // Test FastAPI authentication
  const testAuth = async () => {
    setApiStatus(prev => ({ ...prev, auth: 'loading' }));
    try {
      // Test login endpoint
      const result = await authApi.login({
        username: 'demo@example.com',
        password: 'demo123'
      });
      setAuthResult(result);
      setApiStatus(prev => ({ ...prev, auth: 'success' }));
    } catch (error) {
      console.error('Auth test failed:', error);
      setAuthResult({ error: 'Authentication failed' });
      setApiStatus(prev => ({ ...prev, auth: 'error' }));
    }
  };

  // Test FastAPI invoice endpoints
  const testInvoices = async () => {
    setApiStatus(prev => ({ ...prev, invoices: 'loading' }));
    try {
      // Test get invoices endpoint
      const result = await invoiceApi.getInvoices({
        page: 1,
        search: 'test'
      });
      setInvoiceData(result);
      setApiStatus(prev => ({ ...prev, invoices: 'success' }));
    } catch (error) {
      console.error('Invoice test failed:', error);
      setInvoiceData({ error: 'Invoice API failed' });
      setApiStatus(prev => ({ ...prev, invoices: 'error' }));
    }
  };

  const getDeviceIcon = () => {
    if (isMobile) return <Smartphone className="text-primary-500" size={24} />;
    if (isTablet) return <Tablet className="text-primary-500" size={24} />;
    return <Monitor className="text-primary-500" size={24} />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'loading':
        return <Loader className="animate-spin text-yellow-500" size={20} />;
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <WifiOff className="text-gray-400" size={20} />;
    }
  };

  return (
    <Container className="py-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Responsive Design & FastAPI Integration Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          This component demonstrates the responsive design utilities and FastAPI backend integration
          working together in a comprehensive billing system.
        </p>
      </div>

      {/* Device Detection Section */}
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-3">
            {getDeviceIcon()}
            Device Detection & Responsiveness
          </h2>
          
          <ResponsiveGrid 
            cols={{ xs: 1, md: 2, lg: 3 }} 
            gap="4"
            className="mb-6"
          >
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Current Device</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Screen Size</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {windowSize.width} × {windowSize.height}px
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Breakpoints</h3>
              <div className="text-xs space-y-1">
                <div className={`${isMobile ? 'text-primary-600 font-semibold' : 'text-gray-500'}`}>
                  Mobile: {isMobile ? '✓' : '✗'}
                </div>
                <div className={`${isTablet ? 'text-primary-600 font-semibold' : 'text-gray-500'}`}>
                  Tablet: {isTablet ? '✓' : '✗'}
                </div>
                <div className={`${isDesktop ? 'text-primary-600 font-semibold' : 'text-gray-500'}`}>
                  Desktop: {isDesktop ? '✓' : '✗'}
                </div>
              </div>
            </div>
          </ResponsiveGrid>

          {/* Responsive Visibility Examples */}
          <div className="space-y-3">
            <Show below="md">
              <div className="p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
                <p className="text-primary-800 dark:text-primary-200 text-sm">
                  <strong>Mobile Only:</strong> This message only appears on mobile devices
                </p>
              </div>
            </Show>

            <Show only={['md', 'lg']}>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>Tablet Only:</strong> This message only appears on tablet devices
                </p>
              </div>
            </Show>

            <Show above="lg">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-800 dark:text-green-200 text-sm">
                  <strong>Desktop Only:</strong> This message only appears on desktop devices
                </p>
              </div>
            </Show>

            <Hide below="md">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <p className="text-orange-800 dark:text-orange-200 text-sm">
                  <strong>Hidden on Mobile:</strong> This content is hidden on mobile devices for better UX
                </p>
              </div>
            </Hide>
          </div>
        </div>
      </Card>

      {/* FastAPI Integration Section */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <Wifi className="text-primary-500" size={24} />
            FastAPI Backend Integration
          </h2>
          
          <ResponsiveGrid 
            cols={{ xs: 1, lg: 2 }} 
            gap="6"
          >
            {/* Authentication Test */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Authentication API
                </h3>
                {getStatusIcon(apiStatus.auth)}
              </div>
              
              <Button 
                onClick={testAuth}
                disabled={apiStatus.auth === 'loading'}
                variant="primary"
                className="w-full sm:w-auto"
              >
                {apiStatus.auth === 'loading' ? 'Testing...' : 'Test OAuth2 Login'}
              </Button>

              {authResult && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Auth Response:
                  </h4>
                  <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto">
                    {JSON.stringify(authResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Invoice API Test */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Invoice API
                </h3>
                {getStatusIcon(apiStatus.invoices)}
              </div>
              
              <Button 
                onClick={testInvoices}
                disabled={apiStatus.invoices === 'loading'}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                {apiStatus.invoices === 'loading' ? 'Loading...' : 'Test Invoice Endpoints'}
              </Button>

              {invoiceData && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Invoice Response:
                  </h4>
                  <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-40">
                    {JSON.stringify(invoiceData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </ResponsiveGrid>

          {/* API Endpoint Information */}
          <div className="mt-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              FastAPI Endpoints Configured:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                <code className="text-blue-800 dark:text-blue-200">POST /auth/login</code>
              </div>
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                <code className="text-green-800 dark:text-green-200">GET /invoices</code>
              </div>
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                <code className="text-purple-800 dark:text-purple-200">POST /invoices</code>
              </div>
              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                <code className="text-orange-800 dark:text-orange-200">GET /users/profile</code>
              </div>
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                <code className="text-red-800 dark:text-red-200">POST /auth/refresh</code>
              </div>
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded">
                <code className="text-indigo-800 dark:text-indigo-200">GET /analytics</code>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Container>
  );
}
