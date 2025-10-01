import React, { useState, useEffect } from 'react';

interface DepositWithdrawProps {
  type: 'Deposit' | 'Withdrawal';
  tradingBalance: number;
  onConfirm: (amount: number, type: 'Deposit' | 'Withdrawal') => void;
  onClose: () => void;
}

const DepositWithdraw: React.FC<DepositWithdrawProps> = ({ type, tradingBalance, onConfirm, onClose }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleConfirm = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (type === 'Withdrawal' && numericAmount > tradingBalance) {
      setError('Withdrawal amount cannot exceed your balance.');
      return;
    }
    onConfirm(numericAmount, type);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-brand-surface rounded-xl p-6 shadow-lg w-full max-w-sm m-4 text-brand-text">
        <h2 className="text-xl font-bold mb-4 text-gold">{type} Funds</h2>
        
        <p className="text-sm text-brand-text-secondary mb-4">
          Trading Wallet Balance: ${tradingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-brand-text-secondary mb-1">
            Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-brand-text-secondary">$</span>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              className="w-full bg-brand-light border-brand-light border rounded-lg p-3 pl-7 text-brand-text text-lg focus:ring-gold focus:border-gold"
              placeholder="0.00"
              autoFocus
            />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={onClose}
            className="bg-brand-light text-brand-text font-bold py-3 rounded-lg hover:bg-brand-bg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-gold text-black font-bold py-3 rounded-lg hover:bg-gold-dark transition-colors"
          >
            Confirm {type}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositWithdraw;