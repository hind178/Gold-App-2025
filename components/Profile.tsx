import React from 'react';
import type { IndividualUser } from '../types';
import { UserIcon } from './icons';

interface ProfileProps {
  user: IndividualUser;
}

const ProfileInfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-3">
    <p className="text-brand-text-secondary">{label}</p>
    <p className="font-semibold text-brand-text">{value}</p>
  </div>
);

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="p-4 text-brand-text">
      <h1 className="text-2xl font-bold mb-6 text-center">My Profile</h1>

      <div className="bg-brand-surface rounded-xl p-6 shadow-lg space-y-4">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-brand-light rounded-full flex items-center justify-center mb-4">
            <UserIcon className="w-12 h-12 text-gold" />
          </div>
          <h2 className="text-xl font-bold">{user.name}</h2>
        </div>

        <div className="border-t border-brand-light pt-4 divide-y divide-brand-light">
          <ProfileInfoRow label="Email" value={user.email} />
          <ProfileInfoRow label="Phone Number" value={user.phone} />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-brand-text mb-2">Settings</h2>
        <div className="bg-brand-surface rounded-xl p-2 shadow-lg">
           <button 
             onClick={() => alert("Change Password functionality coming soon!")}
             className="w-full text-left p-4 hover:bg-brand-light rounded-lg transition-colors"
           >
             Change Password
           </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
