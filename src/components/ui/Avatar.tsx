import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'away' | 'busy' | none;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User avatar',
  initials,
  size = 'md',
  status = 'none',
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    none: 'hidden',
  };

  return (
    <div className="relative inline-block">
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white dark:border-gray-800`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-purple-200 dark:bg-purple-900 
                     text-purple-800 dark:text-purple-200 flex items-center justify-center
                     font-medium border-2 border-white dark:border-gray-800`}
        >
          {initials || alt.slice(0, 2).toUpperCase()}
        </div>
      )}
      {status !== 'none' && (
        <span
          className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-800 ${statusClasses[status]}`}
        />
      )}
    </div>
  );
};