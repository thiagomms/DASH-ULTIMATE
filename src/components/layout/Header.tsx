import React from 'react';
import { Bell, Search } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ sidebarCollapsed }) => {
  return (
    <header 
      className={`
        fixed top-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 
        dark:border-gray-800 flex items-center justify-between z-30 transition-all duration-300
        ${sidebarCollapsed ? 'left-20' : 'left-64'}
      `}
    >
      <div className="flex-1 flex items-center px-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white"></h1>
      </div>
      
      <div className="flex items-center space-x-4 px-6">
        <ThemeToggle />
      </div>
    </header>
  );
};