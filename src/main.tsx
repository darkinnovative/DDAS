import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('📱 Main.tsx loaded');

try {
  const rootElement = document.getElementById('root');
  console.log('🎯 Root element:', rootElement);
  
  if (!rootElement) {
    console.error('❌ Root element not found!');
    throw new Error('Root element not found');
  }

  const root = createRoot(rootElement);
  console.log('🌟 React root created');
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('✅ App rendered successfully');
} catch (error) {
  console.error('💥 Error in main.tsx:', error);
  const errorMessage = error instanceof Error ? error.message : String(error);
  document.body.innerHTML = `<div style="padding: 20px; color: red; font-family: Arial, sans-serif;">
    <h1>Application Error</h1>
    <p>Error: ${errorMessage}</p>
    <p>Check the console for more details.</p>
  </div>`;
}
