import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { EnergyProvider } from './context/EnergyContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EnergyProvider>
      <App />
    </EnergyProvider>
  </StrictMode>,
);
