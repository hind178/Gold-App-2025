import React, { useState } from 'react';

interface LoginProps {
  onLogin: (userType: 'individual' | 'company') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userType, setUserType] = useState<'individual' | 'company'>('individual');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    onLogin(userType);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gold">Aura Gold</h1>
          <p className="text-brand-text-secondary mt-2">Sign in to access your portfolio.</p>
        </div>
        
        <form onSubmit={handleLogin} className="bg-brand-surface rounded-xl p-8 shadow-lg">
          <div className="grid grid-cols-2 gap-2 bg-brand-light p-1 rounded-lg mb-6">
            <button
              type="button"
              onClick={() => setUserType('individual')}
              className={`py-2 px-4 rounded-md text-sm font-semibold transition ${userType === 'individual' ? 'bg-gold text-black' : 'text-brand-text-secondary'}`}
            >
              Individual
            </button>
            <button
              type="button"
              onClick={() => setUserType('company')}
              className={`py-2 px-4 rounded-md text-sm font-semibold transition ${userType === 'company' ? 'bg-gold text-black' : 'text-brand-text-secondary'}`}
            >
              Company (Admin)
            </button>
          </div>
        
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-text-secondary mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-light border-brand-light border rounded-lg p-3 text-brand-text focus:ring-gold focus:border-gold"
                placeholder="you@example.com"
                aria-label="Email Address"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-brand-text-secondary mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-light border-brand-light border rounded-lg p-3 text-brand-text focus:ring-gold focus:border-gold"
                placeholder="••••••••"
                aria-label="Password"
              />
            </div>
            
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gold text-black font-bold py-3 rounded-lg hover:bg-gold-dark transition-colors duration-200"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;