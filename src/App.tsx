import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { HomeDashboard } from './pages/HomeDashboard';
import { BuildingDashboard } from './pages/BuildingDashboard';
import { IndustryDashboard } from './pages/IndustryDashboard';
import { CityDashboard } from './pages/CityDashboard';
import { Marketplace } from './pages/Marketplace';

function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/building" element={<BuildingDashboard />} />
          <Route path="/industry" element={<IndustryDashboard />} />
          <Route path="/city" element={<CityDashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/admin" element={<div className="text-zinc-500">Admin Panel Placeholder</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;
