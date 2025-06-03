export interface User {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

export interface StatItem {
  id: string;
  label: string;
  value: number | string;
  change?: number;
  icon?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

export interface ActivityItem {
  id: string;
  user: User;
  action: string;
  target: string;
  timestamp: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number | string;
}