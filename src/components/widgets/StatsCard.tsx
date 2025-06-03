import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { StatItem } from '../../types';
import { 
  TrendingDown, 
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  Activity,
  CreditCard
} from 'lucide-react';

const iconMap: { [key: string]: React.ComponentType<{ size?: number }> } = {
  users: Users,
  'shopping-cart': ShoppingCart,
  'dollar-sign': DollarSign,
  'arrow-up-right': ArrowUpRight,
  activity: Activity,
  'credit-card': CreditCard
};

interface StatsCardProps {
  stat: StatItem;
}

const getIcon = (iconName: string, size = 20) => {
  const Icon = iconMap[iconName];
  return Icon ? <Icon size={size} /> : null;
};

export const StatsCard: React.FC<StatsCardProps> = ({ stat }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{stat.value}</h3>
          </div>
          <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300">
            {stat.icon && getIcon(stat.icon, 24)}
          </div>
        </div>
        
        {stat.change !== undefined && (
          <div className="mt-4 flex items-center">
            {stat.change >= 0 ? (
              <div className="flex items-center text-green-600 dark:text-green-400">
                <TrendingUp size={16} className="mr-1" />
                <span className="text-sm font-medium">+{stat.change}%</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600 dark:text-red-400">
                <TrendingDown size={16} className="mr-1" />
                <span className="text-sm font-medium">{stat.change}%</span>
              </div>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};