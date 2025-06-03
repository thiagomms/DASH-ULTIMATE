import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { ActivityItem } from '../../types';
import { Avatar } from '../ui/Avatar';

interface ActivityCardProps {
  activities: ActivityItem[];
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activities }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 overflow-hidden">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <Avatar
                initials={activity.user.name.split(' ').map(n => n[0]).join('')}
                status={activity.user.status}
                size="sm"
              />
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white">
                  <span className="font-medium">{activity.user.name}</span>
                  <span className="text-gray-600 dark:text-gray-300"> {activity.action} </span>
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {activity.timestamp}
                </p>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                {activity.user.role}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};