import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 
                 hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-all duration-300
                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-yellow-300" />
      ) : (
        <Moon size={20} className="text-purple-700" />
      )}
    </button>
  );
};