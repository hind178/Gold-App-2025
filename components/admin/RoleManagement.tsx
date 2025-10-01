import React, { useState, useMemo, useEffect } from 'react';
import type { Role, Permission } from '../../types';

interface RoleManagementProps {
  roles: Role[];
  allPermissions: Permission[];
  onSaveRole: (updatedRole: Role) => void;
}

const RoleManagement: React.FC<RoleManagementProps> = ({ roles, allPermissions, onSaveRole }) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(roles[0]?.id || null);
  const [editedPermissions, setEditedPermissions] = useState<Set<Permission>>(new Set());

  const selectedRole = useMemo(() => roles.find(r => r.id === selectedRoleId), [roles, selectedRoleId]);

  useEffect(() => {
    if (selectedRole) {
      setEditedPermissions(new Set(selectedRole.permissions));
    }
  }, [selectedRole]);
  
  const handleRoleClick = (role: Role) => {
    setSelectedRoleId(role.id);
  };

  const handlePermissionChange = (permission: Permission, isChecked: boolean) => {
    setEditedPermissions(prev => {
        const newPermissions = new Set(prev);
        if (isChecked) {
            newPermissions.add(permission);
        } else {
            newPermissions.delete(permission);
        }
        return newPermissions;
    });
  };

  const isDirty = useMemo(() => {
    if (!selectedRole) return false;
    if (selectedRole.permissions.length !== editedPermissions.size) return true;
    for (const perm of selectedRole.permissions) {
        if (!editedPermissions.has(perm)) return true;
    }
    return false;
  }, [selectedRole, editedPermissions]);

  const handleSaveChanges = () => {
    if (!selectedRole || !isDirty) return;
    const updatedRole: Role = {
      ...selectedRole,
      permissions: Array.from(editedPermissions),
    };
    onSaveRole(updatedRole);
  };

  const handleCancelChanges = () => {
    if (selectedRole) {
      setEditedPermissions(new Set(selectedRole.permissions));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-text">Roles & Permissions</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Roles List */}
        <div className="w-full md:w-1/3">
          <div className="bg-brand-surface rounded-lg shadow">
            <ul className="divide-y divide-brand-light">
              {roles.map(role => (
                <li key={role.id}>
                  <button 
                    onClick={() => handleRoleClick(role)}
                    className={`w-full text-left p-4 ${selectedRole?.id === role.id ? 'bg-gold text-black' : 'hover:bg-brand-light'}`}
                  >
                    <p className="font-semibold">{role.name}</p>
                    <p className={`text-xs ${selectedRole?.id === role.id ? 'text-gray-800' : 'text-brand-text-secondary'}`}>{role.description}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Permissions Editor */}
        <div className="w-full md:w-2/3">
          {selectedRole ? (
            <div className="bg-brand-surface rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gold">Permissions for {selectedRole.name}</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allPermissions.map(permission => (
                  <label key={permission} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold"
                      checked={editedPermissions.has(permission)}
                      onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                    />
                    <span className="text-brand-text">{permission}</span>
                  </label>
                ))}
              </div>
              <div className="mt-6 flex justify-end space-x-3 border-t border-brand-light pt-4">
                <button
                  onClick={handleCancelChanges}
                  disabled={!isDirty}
                  className="bg-brand-light text-brand-text font-semibold py-2 px-4 rounded-lg hover:bg-brand-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={!isDirty}
                  className="bg-gold text-black font-semibold py-2 px-4 rounded-lg hover:bg-gold-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Save Role
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-brand-surface rounded-lg shadow p-6 text-center text-brand-text-secondary">
              <p>Select a role to view and edit its permissions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;