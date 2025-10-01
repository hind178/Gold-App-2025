import React, { useState, useEffect } from 'react';
import type { AdminUser, Role } from '../../types';
import { CloseIcon } from '../icons';

interface UserManagementProps {
  users: AdminUser[];
  roles: Role[];
  onCreateUser: (newUser: Omit<AdminUser, 'id' | 'createdAt'>) => void;
  onUpdateUser: (updatedUser: AdminUser) => void;
}

const initialFormState = {
  name: '',
  email: '',
  role: '',
};

const UserFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Omit<AdminUser, 'id' | 'createdAt'>) => void;
  roles: Role[];
  editingUser: AdminUser | null;
}> = ({ isOpen, onClose, onSubmit, roles, editingUser }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState(initialFormState);

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [editingUser, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = { ...initialFormState };
    let isValid = true;
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid.';
      isValid = false;
    }
    if (!formData.role) {
      newErrors.role = 'Role is required.';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(editingUser ? { ...editingUser, ...formData } : formData);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if(errors[name as keyof typeof errors]) {
      setErrors(prev => ({...prev, [name]: ''}));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-surface rounded-xl p-6 shadow-lg w-full max-w-md text-brand-text relative">
        <h2 className="text-xl font-bold mb-4 text-gold">{editingUser ? 'Edit User' : 'Create User'}</h2>
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-text-secondary hover:text-brand-text">
          <CloseIcon className="w-6 h-6" />
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-brand-text-secondary mb-1">Full Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full bg-brand-light border-brand-light border rounded-lg p-2 focus:ring-gold focus:border-gold"/>
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-text-secondary mb-1">Email</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="w-full bg-brand-light border-brand-light border rounded-lg p-2 focus:ring-gold focus:border-gold"/>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-brand-text-secondary mb-1">Role</label>
            <select name="role" id="role" value={formData.role} onChange={handleChange} className="w-full bg-brand-light border-brand-light border rounded-lg p-2 focus:ring-gold focus:border-gold">
              <option value="">Select a role</option>
              {roles.map(role => <option key={role.id} value={role.name}>{role.name}</option>)}
            </select>
            {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role}</p>}
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="bg-brand-light text-brand-text font-semibold py-2 px-4 rounded-lg hover:bg-brand-bg">Cancel</button>
            <button type="submit" className="bg-gold text-black font-semibold py-2 px-4 rounded-lg hover:bg-gold-dark">Save User</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const UserManagement: React.FC<UserManagementProps> = ({ users, roles, onCreateUser, onUpdateUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleFormSubmit = (formData: Omit<AdminUser, 'id' | 'createdAt'>) => {
    if (editingUser) {
      onUpdateUser({ ...editingUser, ...formData });
    } else {
      onCreateUser(formData);
    }
    handleCloseModal();
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand-text">User Management</h1>
        <button onClick={handleOpenCreateModal} className="bg-gold text-black font-semibold py-2 px-4 rounded-lg hover:bg-gold-dark transition-colors">
          Create User
        </button>
      </div>

      <div className="bg-brand-surface rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-brand-light text-brand-text-secondary uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Role</th>
                <th scope="col" className="px-6 py-3">Joined</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-brand-light hover:bg-brand-light">
                  <td className="px-6 py-4 font-medium text-brand-text">
                    {user.name}
                    <div className="text-xs text-brand-text-secondary">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">{user.createdAt}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleOpenEditModal(user)} className="text-blue-500 hover:underline font-semibold">Edit</button>
                    <button className="text-red-500 hover:underline font-semibold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        roles={roles}
        editingUser={editingUser}
      />
    </div>
  );
};

export default UserManagement;
