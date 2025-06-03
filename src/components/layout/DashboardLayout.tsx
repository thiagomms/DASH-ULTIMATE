import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <Header sidebarCollapsed={sidebarCollapsed} />
      
      <main 
        className={`
          pt-24 pb-8 px-6 transition-all duration-300
          ${sidebarCollapsed ? 'ml-20' : 'ml-64'}
        `}
      >
        {children}
      </main>
    </div>
  );
};