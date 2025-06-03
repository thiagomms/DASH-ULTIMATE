import { ActivityItem, ChartData, MenuItem, StatItem, User } from '../types';
import { Bar } from 'recharts';
import { BarChart3Icon } from 'lucide-react';

export const currentUser: User = {
  id: '1',
  name: 'Alex Johnson',
  role: 'Admin',
  status: 'online',
};

export const statsData: StatItem[] = [
  {
    id: '1',
    label: 'Total Users',
    value: '3,721',
    change: 12.5,
    icon: 'users',
  },
  {
    id: '2',
    label: 'Revenue',
    value: '$48,352',
    change: 8.2,
    icon: 'dollar-sign',
  },
  {
    id: '3',
    label: 'Active Projects',
    value: '24',
    change: -3.1,
    icon: 'briefcase',
  },
  {
    id: '4',
    label: 'Conversion Rate',
    value: '6.4%',
    change: 4.3,
    icon: 'percent',
  },
];

export const revenueData: ChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [30, 40, 35, 50, 49, 60],
      borderColor: '#8B5CF6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      borderWidth: 2,
    },
    {
      label: 'Expenses',
      data: [15, 20, 25, 22, 30, 28],
      borderColor: '#EC4899',
      backgroundColor: 'rgba(236, 72, 153, 0.1)',
      borderWidth: 2,
    },
  ],
};

export const usersData: ChartData = {
  labels: ['Free', 'Basic', 'Premium', 'Enterprise'],
  datasets: [
    {
      label: 'Users by Plan',
      data: [30, 40, 20, 10],
      backgroundColor: [
        'rgba(139, 92, 246, 0.8)',
        'rgba(124, 58, 237, 0.8)',
        'rgba(109, 40, 217, 0.8)',
        'rgba(91, 33, 182, 0.8)',
      ],
      borderWidth: 0,
    },
  ],
};

export const recentActivity: ActivityItem[] = [
  {
    id: '1',
    user: {
      id: '2',
      name: 'Emma Roberts',
      role: 'Designer',
      status: 'online',
    },
    action: 'created',
    target: 'New dashboard wireframe',
    timestamp: '5 min ago',
  },
  {
    id: '2',
    user: {
      id: '3',
      name: 'Thomas Chen',
      role: 'Developer',
      status: 'away',
    },
    action: 'commented on',
    target: 'API integration issue #42',
    timestamp: '1 hour ago',
  },
  {
    id: '3',
    user: {
      id: '4',
      name: 'Sarah Kim',
      role: 'Marketing',
      status: 'offline',
    },
    action: 'published',
    target: 'Q2 Marketing Report',
    timestamp: '3 hours ago',
  },
  {
    id: '4',
    user: {
      id: '5',
      name: 'James Wilson',
      role: 'Product Manager',
      status: 'busy',
    },
    action: 'scheduled',
    target: 'Product Roadmap Review',
    timestamp: 'Yesterday',
  },
];

export const menuItems: MenuItem[] = [
  {
    id: '1',
    label: 'Dashboard',
    icon: 'layout-dashboard',
    path: '/',
  },
  {
    id: '2',
    label: 'Ticket Médio',
    icon: 'users',
    path: '/ticket-medio',
  },
  {
    id: '3',
    label: 'Faturamento',
    icon: 'bar-chart',
    path: '/faturamento',
    badge: 5,
  },
  // {
  //   id: '4',
  //   label: 'Projects',
  //   icon: 'briefcase',
  //   path: '/projects',
  // },
  // {
  //   id: '5',
  //   label: 'Tasks',
  //   icon: 'check-square',
  //   path: '/tasks',
  //   badge: '12',
  // },
  // {
  //   id: '6',
  //   label: 'Calendar',
  //   icon: 'calendar',
  //   path: '/calendar',
  // },
  // {
  //   id: '7',
  //   label: 'Settings',
  //   icon: 'settings',
  //   path: '/settings',
  // },
];