# Responsive Design & FastAPI Integration

This project now includes comprehensive responsive design utilities and FastAPI backend integration for the DDAS (Digital Daily Account System) billing application.

## ✅ Features Implemented

### 🎨 Responsive Design System
- **Comprehensive breakpoint system**: xs(475px), sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1536px), 3xl(1920px)
- **Device detection hooks**: `useIsMobile()`, `useIsTablet()`, `useIsDesktop()`
- **Responsive utilities**: `useWindowSize()`, `useBreakpoint()`, `useCurrentBreakpoint()`
- **Responsive components**: `ResponsiveGrid`, `Container`, `Show`, `Hide`, `Responsive`
- **Touch device detection**: `useIsTouchDevice()`, `useOrientation()`
- **Enhanced Tailwind configuration** with extended responsive classes

### 🔧 FastAPI Backend Integration
- **Axios configuration**: FastAPI-specific setup with OAuth2 authentication
- **Authentication API**: Login, register, profile management, token refresh
- **Invoice API**: Full CRUD operations with pagination and analytics
- **Error handling**: Comprehensive error handling with retry logic
- **File operations**: Upload/download utilities for PDFs and documents
- **Environment configuration**: Development and production settings

### 📱 Enhanced Layout Components
- **Responsive Header**: Mobile-first design with collapsible menus and search
- **Responsive Sidebar**: Adaptive navigation with overlay on mobile/tablet
- **Mobile-optimized UX**: Touch-friendly interfaces and gesture support

## 📁 File Structure

```
src/
├── hooks/
│   └── useResponsive.tsx          # Comprehensive responsive design utilities
├── lib/
│   └── api.ts                     # FastAPI axios configuration
├── services/
│   ├── authApi.ts                 # FastAPI authentication endpoints
│   ├── invoiceApi.ts              # FastAPI invoice management
│   └── index.ts                   # Service exports
├── components/
│   ├── layout/
│   │   ├── Header.tsx             # Enhanced responsive header
│   │   └── Sidebar.tsx            # Enhanced responsive sidebar
│   └── examples/
│       └── ResponsiveApiExample.tsx # Demo component
├── types/
│   └── *.ts                       # TypeScript interfaces
└── utils/
    └── *.ts                       # Utility functions

# Configuration Files
├── .env                           # Development environment variables
├── .env.production                # Production environment variables
└── tailwind.config.js             # Enhanced Tailwind configuration
```

## 🚀 Usage Examples

### Responsive Design Hooks

```typescript
import { useIsMobile, useIsTablet, useBreakpoint, useWindowSize } from './hooks/useResponsive';

function MyComponent() {
  const isMobile = useIsMobile();       // < 768px
  const isTablet = useIsTablet();       // 768px - 1023px
  const isDesktop = useBreakpoint('lg'); // >= 1024px
  const { width, height } = useWindowSize();

  return (
    <div>
      <p>Current device: {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}</p>
      <p>Screen size: {width} × {height}</p>
    </div>
  );
}
```

### Responsive Components

```typescript
import { ResponsiveGrid, Container, Show, Hide } from './hooks/useResponsive';

function ResponsiveLayout() {
  return (
    <Container size="xl" padding={{ xs: 'px-4', lg: 'px-8' }}>
      <ResponsiveGrid cols={{ xs: 1, md: 2, lg: 3 }} gap="gap-6">
        <div>Card 1</div>
        <div>Card 2</div>
        <div>Card 3</div>
      </ResponsiveGrid>

      <Show above="lg">
        <p>Only visible on desktop</p>
      </Show>

      <Hide below="md">
        <p>Hidden on mobile</p>
      </Hide>
    </Container>
  );
}
```

### FastAPI Integration

```typescript
import { authApi, invoiceApi } from './services';

// Authentication
const loginResult = await authApi.login({
  username: 'user@example.com',
  password: 'password123'
});

// Invoice operations
const invoices = await invoiceApi.getInvoices({
  page: 1,
  search: 'customer name'
});

const newInvoice = await invoiceApi.createInvoice({
  customerId: '123',
  items: [...]
});
```

## 🎯 Breakpoint System

| Breakpoint | Min Width | Device Type |
|------------|-----------|-------------|
| xs         | 475px     | Large phones |
| sm         | 640px     | Tablets (portrait) |
| md         | 768px     | Tablets (landscape) |
| lg         | 1024px    | Small laptops |
| xl         | 1280px    | Desktops |
| 2xl        | 1536px    | Large desktops |
| 3xl        | 1920px    | Ultra-wide screens |

## 🔐 Environment Variables

### Development (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_AUTH_BASE_URL=http://localhost:8000/auth
VITE_ENABLE_AUTH=true
VITE_ENABLE_OAUTH2=true
VITE_TOKEN_REFRESH_THRESHOLD=300000
```

### Production (.env.production)
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_AUTH_BASE_URL=https://api.yourdomain.com/auth
VITE_ENABLE_AUTH=true
VITE_ENABLE_OAUTH2=true
VITE_TOKEN_REFRESH_THRESHOLD=300000
VITE_ENABLE_ANALYTICS=true
```

## 🔄 FastAPI Endpoints

### Authentication
- `POST /auth/login` - OAuth2 login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Token refresh
- `GET /auth/profile` - User profile
- `PUT /auth/profile` - Update profile

### Invoices
- `GET /invoices` - List invoices with pagination
- `POST /invoices` - Create new invoice
- `GET /invoices/{id}` - Get invoice details
- `PUT /invoices/{id}` - Update invoice
- `DELETE /invoices/{id}` - Delete invoice
- `GET /invoices/{id}/pdf` - Download PDF
- `GET /invoices/analytics` - Invoice analytics

## 🛠 Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your FastAPI backend URL
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Test responsive features**:
   - Open browser developer tools
   - Toggle device emulation
   - Test different screen sizes

## 📱 Mobile-First Approach

The responsive system follows mobile-first principles:
- Base styles target mobile devices
- Progressive enhancement for larger screens
- Touch-friendly interfaces on mobile
- Optimized layouts for each device type

## 🎨 Design System

### Colors
- **Primary**: Blue tones for main actions
- **Gray**: Neutral tones for backgrounds and text
- **Success**: Green tones for positive actions
- **Warning**: Yellow tones for cautions
- **Danger**: Red tones for errors
- **Info**: Blue tones for information

### Typography
- Responsive font scales
- Line height optimizations
- Letter spacing adjustments
- Font weight variations

### Spacing
- Consistent spacing scale
- Responsive margins and paddings
- Grid-based layouts
- Flexible gap systems

## 🔧 FastAPI Backend Requirements

Your FastAPI backend should implement:

1. **OAuth2 Authentication**:
   ```python
   from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
   ```

2. **CORS Configuration**:
   ```python
   from fastapi.middleware.cors import CORSMiddleware
   ```

3. **Endpoint Structure**:
   - `/auth/*` - Authentication endpoints
   - `/api/v1/*` - API endpoints
   - Proper error handling with HTTP status codes

4. **Response Format**:
   ```json
   {
     "data": {...},
     "message": "Success",
     "status": 200
   }
   ```

## 🧪 Testing

The `ResponsiveApiExample` component provides comprehensive testing for:
- Device detection accuracy
- Responsive component behavior
- FastAPI integration functionality
- Error handling scenarios

## 📚 Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [React Hooks Documentation](https://reactjs.org/docs/hooks-reference.html)

## 🎯 Next Steps

Consider implementing:
- **Offline support** with service workers
- **Progressive Web App** features
- **Performance monitoring** with analytics
- **Accessibility improvements** (WCAG compliance)
- **Internationalization** support
- **Advanced caching strategies**
