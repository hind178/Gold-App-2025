import React, { useState } from 'react';
import type { AdminUser, Role, AuditLog, Permission } from '../../types';
import { HomeIcon, UserGroupIcon, ShieldCheckIcon, DocumentTextIcon } from '../icons';

import AdminDashboardView from './AdminDashboardView';
import UserManagement from './UserManagement';
import RoleManagement from './RoleManagement';
import AuditLogs from './AuditLogs';

type AdminView = 'dashboard' | 'users' | 'roles' | 'logs';

interface AdminLayoutProps {
  adminUsers: AdminUser[];
  roles: Role[];
  auditLogs: AuditLog[];
  permissions: Permission[];
  onSaveRole: (updatedRole: Role) => void;
  onCreateUser: (newUser: Omit<AdminUser, 'id' | 'createdAt'>) => void;
  onUpdateUser: (updatedUser: AdminUser) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-3 w-full p-2 rounded-lg text-left transition-colors duration-200 ${
      isActive
        ? 'bg-gold text-black font-semibold'
        : 'text-brand-text-secondary hover:bg-brand-light hover:text-brand-text'
    }`}
    aria-current={isActive ? 'page' : undefined}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const AdminLayout: React.FC<AdminLayoutProps> = ({ adminUsers, roles, auditLogs, permissions, onSaveRole, onCreateUser, onUpdateUser }) => {
  const [activeAdminView, setActiveAdminView] = useState<AdminView>('dashboard');

  const renderAdminContent = () => {
    switch (activeAdminView) {
      case 'dashboard':
        return <AdminDashboardView usersCount={adminUsers.length} rolesCount={roles.length} recentLogs={auditLogs.slice(0, 3)} />;
      case 'users':
        return <UserManagement 
                  users={adminUsers} 
                  roles={roles}
                  onCreateUser={onCreateUser}
                  onUpdateUser={onUpdateUser} 
                />;
      case 'roles':
        return <RoleManagement roles={roles} allPermissions={permissions} onSaveRole={onSaveRole} />;
      case 'logs':
        return <AuditLogs logs={auditLogs} />;
      default:
        return <AdminDashboardView usersCount={adminUsers.length} rolesCount={roles.length} recentLogs={auditLogs.slice(0, 3)} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Sidebar for larger screens, tabs for smaller? For now, one column is fine */}
      <aside className="w-full md:w-56 p-4 space-y-2 border-b md:border-b-0 md:border-r border-brand-light">
         <NavItem
            icon={<HomeIcon className="w-5 h-5" />}
            label="Dashboard"
            isActive={activeAdminView === 'dashboard'}
            onClick={() => setActiveAdminView('dashboard')}
          />
          <NavItem
            icon={<UserGroupIcon className="w-5 h-5" />}
            label="Users"
            isActive={activeAdminView === 'users'}
            onClick={() => setActiveAdminView('users')}
          />
          <NavItem
            icon={<ShieldCheckIcon className="w-5 h-5" />}
            label="Roles"
            isActive={activeAdminView === 'roles'}
            onClick={() => setActiveAdminView('roles')}
          />
          <NavItem
            icon={<DocumentTextIcon className="w-5 h-5" />}
            label="Audit Logs"
            isActive={activeAdminView === 'logs'}
            onClick={() => setActiveAdminView('logs')}
          />
      </aside>
      <main className="flex-grow p-4">
        {renderAdminContent()}
      </main>
    </div>
  );
};

export default AdminLayout;
