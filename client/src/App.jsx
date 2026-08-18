import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { AmenityPage } from './pages/AmenityPage';
import { PropertyPage } from './pages/PropertyPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import './styles/index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <AppProvider>
      <div className="app-container">
        <Navbar />
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="main-content">
          {activeTab === 'dashboard' && <DashboardPage setActiveTab={setActiveTab} />}
          {activeTab === 'maintenance' && <MaintenancePage />}
          {activeTab === 'amenities' && <AmenityPage />}
          {activeTab === 'properties' && <PropertyPage />}
          {activeTab === 'analytics' && <AnalyticsPage />}
        </main>
      </div>
    </AppProvider>
  );
}
