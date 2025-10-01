import React from 'react';
import { LogoutIcon, SunIcon, MoonIcon } from './icons';
import type { Theme } from '../types';

interface HeaderProps {
    onLogout: () => void;
    theme: Theme;
    onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, theme, onToggleTheme }) => {
    return (
        <header className="sticky top-0 bg-brand-surface/80 backdrop-blur-sm z-10 shadow-md">
            <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gold">Aura Gold</h1>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onToggleTheme}
                        className="text-brand-text-secondary hover:text-gold transition-colors"
                        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                    </button>
                    <button 
                        onClick={onLogout} 
                        className="flex items-center space-x-2 text-brand-text-secondary hover:text-gold transition-colors"
                        aria-label="Logout"
                    >
                        <LogoutIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;