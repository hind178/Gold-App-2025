import React from 'react';
import type { AuditLog } from '../../types';

interface AuditLogsProps {
  logs: AuditLog[];
}

const AuditLogs: React.FC<AuditLogsProps> = ({ logs }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-text">Audit Logs</h1>
      
      <div className="bg-brand-surface rounded-lg shadow">
        <ul className="divide-y divide-brand-light">
          {logs.map(log => (
            <li key={log.id} className="p-4">
              <p className="text-brand-text text-sm font-medium">
                <span className="font-bold text-gold">{log.user}</span> {log.action}
              </p>
              <p className="text-brand-text-secondary text-xs mt-1">{log.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AuditLogs;
