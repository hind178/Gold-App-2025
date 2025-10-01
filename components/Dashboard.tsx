
import React, { useState, useMemo } from 'react';
import type { Wallet, Transaction } from '../types';
import { ArrowUpIcon, ArrowDownIcon } from './icons';
import type { ActiveView } from '../App';

interface DashboardProps {
  wallets: Wallet[];
  recentTransactions: Transaction[];
  goldPrice: number;
  priceDirection: 'up' | 'down' | 'neutral';
  priceChangePercent: number;
  setActiveView: (view: ActiveView) => void;
}

const WalletCard: React.FC<{ wallet: Wallet }> = ({ wallet }) => (
  <div className="bg-brand-light rounded-xl p-4 flex flex-col justify-between shadow-lg">
    <div>
      <h3 className="text-brand-text-secondary font-medium">{wallet.type} Wallet</h3>
      <p className="text-brand-text text-2xl font-bold mt-2">
        ${wallet.balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
    <p className="text-brand-text-secondary mt-1 text-sm">{wallet.balanceGrams.toFixed(4)} g</p>
  </div>
);

interface GoldPriceCardProps {
  price: number;
  direction: 'up' | 'down' | 'neutral';
  changePercent: number;
}

const GoldPriceCard: React.FC<GoldPriceCardProps> = ({ price, direction, changePercent }) => {
  const isUp = direction === 'up';
  const isDown = direction === 'down';
  const colorClass = isUp ? 'text-green-400' : isDown ? 'text-red-400' : 'text-brand-text-secondary';
  const sign = isUp ? '+' : '';

  return (
    <div className="bg-brand-surface rounded-xl p-4 flex items-center justify-between shadow-lg">
      <div>
        <div className="flex items-center space-x-2">
          <h3 className="text-brand-text-secondary font-medium">Gold Spot Price (USD/oz)</h3>
          <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">Simulation</span>
        </div>
        <p className="text-brand-text text-2xl font-bold mt-2">${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
      {direction !== 'neutral' && (
        <div className={`flex items-center font-bold transition-colors duration-300 ${colorClass}`}>
          {isUp && <ArrowUpIcon className="w-5 h-5" />}
          {isDown && <ArrowDownIcon className="w-5 h-5" />}
          <span className="ml-1">{sign}{changePercent.toFixed(2)}%</span>
        </div>
      )}
    </div>
  );
};


const QuickActions: React.FC<{ onAction: (action: string) => void }> = ({ onAction }) => (
  <div className="grid grid-cols-4 gap-4 text-center">
    {['Buy', 'Sell', 'Deposit', 'Withdraw'].map((action) => (
      <button 
        key={action} 
        onClick={() => onAction(action)}
        className="bg-brand-light rounded-lg p-3 text-brand-text hover:bg-gold hover:text-black transition-colors duration-200"
      >
        <span className="font-semibold text-sm">{action}</span>
      </button>
    ))}
  </div>
);

const TransactionItem: React.FC<{ tx: Transaction }> = ({ tx }) => {
  const isCredit = tx.type === 'Deposit' || tx.type === 'Sell';
  return (
    <div className="flex justify-between items-center py-3">
      <div>
        <p className="font-semibold text-brand-text">{tx.type} ({tx.wallet})</p>
        <p className="text-xs text-brand-text-secondary">{tx.date}</p>
      </div>
      <p className={`font-bold ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
        {isCredit ? '+' : '-'}${tx.amountUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
      </p>
    </div>
  );
};


const Dashboard: React.FC<DashboardProps> = ({ wallets, recentTransactions, goldPrice, priceDirection, priceChangePercent, setActiveView }) => {
  const [filterWallet, setFilterWallet] = useState<'All' | Transaction['wallet']>('All');

  const filteredTransactions = useMemo(() => {
    return recentTransactions
      .filter(tx => filterWallet === 'All' || tx.wallet === filterWallet);
  }, [recentTransactions, filterWallet]);

  const handleAction = (action: string) => {
    if (action === 'Deposit' || action === 'Withdrawal') {
      setActiveView('fund');
    } else {
      // Placeholder for future implementation
      alert(`${action} functionality coming soon!`);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-brand-text">Welcome, Investor</h1>
        <p className="text-brand-text-secondary">Here's your financial overview.</p>
      </header>
      
      <GoldPriceCard price={goldPrice} direction={priceDirection} changePercent={priceChangePercent} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wallets.map(wallet => <WalletCard key={wallet.type} wallet={wallet} />)}
      </div>

      <QuickActions onAction={handleAction} />

      <div>
        <h2 className="text-lg font-semibold text-brand-text mb-2">Recent Activity</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="filter-wallet" className="block text-sm font-medium text-brand-text-secondary mb-1">
              Wallet
            </label>
            <select
              id="filter-wallet"
              value={filterWallet}
              onChange={(e) => setFilterWallet(e.target.value as 'All' | Transaction['wallet'])}
              className="w-full bg-brand-light border-brand-light border rounded-lg p-2 text-brand-text focus:ring-gold focus:border-gold"
            >
              <option value="All">All Wallets</option>
              <option value="Physical">Physical</option>
              <option value="Trading">Trading</option>
            </select>
          </div>
        </div>

        <div className="bg-brand-surface rounded-xl p-4 divide-y divide-brand-light">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map(tx => <TransactionItem key={tx.id} tx={tx} />)
          ) : (
            <p className="text-brand-text-secondary text-center py-4">No transactions match the current filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;