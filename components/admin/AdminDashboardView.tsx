import React from 'react';
import type { AuditLog } from '../../types';

interface StatCardProps {
  title: string;
  value: number | string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => (
  <div className="bg-brand-surface rounded-lg p-4 shadow">
    <h3 className="text-brand-text-secondary text-sm font-medium">{title}</h3>
    <p className="text-brand-text text-3xl font-bold mt-1">{value}</p>
  </div>
);

interface AdminDashboardViewProps {
    usersCount: number;
    rolesCount: number;
    recentLogs: AuditLog[];
}

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ usersCount, rolesCount, recentLogs }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-text">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard title="Total Users" value={usersCount} />
        <StatCard title="Defined Roles" value={rolesCount} />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-brand-text mb-2">Recent Activity</h2>
        <div className="bg-brand-surface rounded-lg shadow">
          <ul className="divide-y divide-brand-light">
            {recentLogs.length > 0 ? (
                recentLogs.map(log => (
                    <li key={log.id} className="p-4">
                        <p className="text-brand-text text-sm font-medium">{log.action}</p>
                        <p className="text-brand-text-secondary text-xs mt-1">
                            By {log.user} on {log.date}
                        </p>
                    </li>
                ))
            ) : (
                <li className="p-4 text-brand-text-secondary text-center">No recent activity.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardView;
