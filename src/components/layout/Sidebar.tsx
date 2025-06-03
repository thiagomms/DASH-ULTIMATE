import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  LogOut, 
  Menu,
  Home,
  Users,
  Settings,
  BarChart2,
  Mail,
  Bell,
  Calendar,
  FileText,
  HelpCircle,
  LayoutDashboard,
  BarChart,
  Briefcase,
  CheckSquare
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { menuItems, currentUser } from '../../utils/mockData';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { User } from '@supabase/supabase-js';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const iconMap: { [key: string]: React.ElementType } = {
  'layout-dashboard': LayoutDashboard,
  'bar-chart': BarChart,
  users: Users,
  briefcase: Briefcase,
  'check-square': CheckSquare,
  calendar: Calendar,
  settings: Settings,
  home: Home,
  'bar-chart-2': BarChart2,
  mail: Mail,
  bell: Bell,
  'file-text': FileText,
  'help-circle': HelpCircle
};



interface SlackProfile {
  image_192?: string;
  image_512?: string;
  image_72?: string;
  real_name?: string;
  display_name?: string;
}

// Busca o perfil do Slack via função serverless
async function getSlackProfile(): Promise<SlackProfile | null> {
  const baseUrl = 'https://dash-comercial.netlify.app/.netlify/functions/slackProfile';
  const response = await fetch(baseUrl);
  const data = await response.json();
  if (data.real_name || data.display_name) {
    return data;
  }
  return null;
}

export function SidebarAvatar() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAvatar() {
      const url = await getSlackProfile();
      setAvatarUrl(url?.image_192 || url?.image_512 || url?.image_72 || null);
    }
    fetchAvatar();
  }, []);

  return (
    <img
      src={avatarUrl || '/default-avatar.png'}
      alt="Avatar"
      className="rounded-full w-10 h-10"
      onError={e => e.currentTarget.src = '/default-avatar.png'}
    />
  );
}

// Adicionar novo item ao menu
const menuItemsExtended = [
  ...menuItems,
  {
    id: 'recorrencia-excel',
    label: 'Recorrência Extensão & Oferta',
    path: '/recorrencia-excel',
    icon: 'file-text',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const [user, setUser] = useState<User | null>(null);
  const [slackProfile, setSlackProfile] = useState<SlackProfile | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    };
    getUser();
  }, []);

  useEffect(() => {
    async function fetchSlackProfile() {
      const profile = await getSlackProfile();
      setSlackProfile(profile);
    }
    fetchSlackProfile();
  }, []);

  const getIcon = (iconName: string, size = 20) => {
    const Icon = iconMap[iconName];
    return Icon ? <Icon size={size} /> : null;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!user) return null;

  // Avatar e nome do Slack
  const avatarUrl = slackProfile?.image_192 || slackProfile?.image_512 || slackProfile?.image_72;
  let slackName = slackProfile?.real_name || slackProfile?.display_name || 'Usuário Slack';
  if (slackName) {
    const parts = slackName.split(' ');
    slackName = parts.length > 1 ? `${parts[0]} ${parts[1]}` : parts[0];
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div 
      className={`
        fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 
        dark:border-gray-800 z-40 transition-all duration-300
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold">
              NS
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white"></span>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 mx-auto rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold">
            NS
          </div>
        )}
        <button 
          onClick={onToggle} 
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 
                    hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="py-4">
        <nav className="px-2 space-y-1">
          {menuItemsExtended.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`
                w-full flex items-center ${collapsed ? 'justify-center' : 'justify-start'} 
                p-2.5 rounded-lg transition-all
                ${
                  isActive(item.path)
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
                }
              `}
            >
              <div className="flex items-center justify-center">
                <span className={`${isActive(item.path) ? 'text-purple-600 dark:text-purple-300' : ''}`}>
                  {getIcon(item.icon)}
                </span>
              </div>
              
              {!collapsed && (
                <>
                  <span className="ml-3 text-sm font-medium">{item.label}</span>
                </>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 w-full border-t border-gray-200 dark:border-gray-800 p-4">
        <div className={`flex ${collapsed ? 'justify-center' : 'items-center space-x-3'}`}>
          {!collapsed ? (
            <>
              <img src={avatarUrl || '/default-avatar.png'} alt="Avatar" className="rounded-full w-10 h-10" onError={e => (e.currentTarget.src = '/default-avatar.png')} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {slackName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {currentUser.role}
                </p>
              </div>
              <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" onClick={handleLogout}>
                <LogOut size={18} />
              </button>
            </>
          ) : (
            avatarUrl ? (
              <img src={avatarUrl || '/default-avatar.png'} alt="Avatar" className="rounded-full w-10 h-10" onError={e => (e.currentTarget.src = '/default-avatar.png')} />
          ) : (
            <Avatar 
              initials={currentUser.name.split(' ').map(n => n[0]).join('')}
              status={currentUser.status}
              size="sm"
            />
            )
          )}
        </div>
      </div>
    </div>
  );
};