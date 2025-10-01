import React from 'react';
import { HomeIcon, ChartIcon, FundIcon, GoldBarIcon, AdminIcon, UserIcon } from './icons';
import type { ActiveView } from '../App';

interface BottomNavProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  userType: 'individual' | 'company';
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
      isActive ? 'text-gold' : 'text-brand-text-secondary hover:text-brand-text dark:hover:text-gold'
    }`}
    aria-current={isActive ? 'page' : undefined}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView, userType }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-brand-surface border-t border-brand-light shadow-lg">
      <div className="flex justify-around h-full">
        <NavItem
          icon={<HomeIcon className="w-6 h-6" />}
          label="Dashboard"
          isActive={activeView === 'dashboard'}
          onClick={() => setActiveView('dashboard')}
        />
        <NavItem
          icon={<GoldBarIcon className="w-6 h-6" />}
          label="Physical"
          isActive={activeView === 'physical'}
          onClick={() => setActiveView('physical')}
        />
        <NavItem
          icon={<ChartIcon className="w-6 h-6" />}
          label="Trading"
          isActive={activeView === 'trading'}
          onClick={() => setActiveView('trading')}
        />
        <NavItem
          icon={<FundIcon className="w-6 h-6" />}
          label="Fund"
          isActive={activeView === 'fund'}
          onClick={() => setActiveView('fund')}
        />
        {userType === 'individual' ? (
           <NavItem
             icon={<UserIcon className="w-6 h-6" />}
             label="Profile"
             isActive={activeView === 'profile'}
             onClick={() => setActiveView('profile')}
           />
        ) : (
           <NavItem
             icon={<AdminIcon className="w-6 h-6" />}
             label="Admin"
             isActive={activeView === 'admin'}
             onClick={() => setActiveView('admin')}
           />
        )}
      </div>
    </div>
  );
};

export default BottomNav;