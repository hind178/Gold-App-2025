import React, { useState } from 'react';
import type { Wallet } from '../types';
import { BankIcon, CreditCardIcon, CryptoIcon, MobilePaymentIcon } from './icons';

interface FundProps {
  wallets: Wallet[];
}

const PaymentMethodCard: React.FC<{ icon: React.ReactNode; name: string; }> = ({ icon, name }) => (
    <button 
        onClick={() => alert(`${name} is not yet implemented.`)}
        className="w-full bg-brand-light p-4 rounded-lg flex items-center space-x-4 hover:bg-brand-surface transition-colors duration-200"
    >
        {icon}
        <span className="font-semibold">{name}</span>
    </button>
);

const Fund: React.FC<FundProps> = ({ wallets }) => {
    const [transactionType, setTransactionType] = useState<'Deposit' | 'Withdrawal'>('Deposit');
    const tradingWallet = wallets.find(w => w.type === 'Trading');

    const paymentMethods = [
        { name: 'Bank Transfer', icon: <BankIcon className="w-8 h-8 text-gold" /> },
        { name: 'Credit/Debit Card', icon: <CreditCardIcon className="w-8 h-8 text-gold" /> },
        { name: 'Zain Cash', icon: <MobilePaymentIcon className="w-8 h-8 text-gold" /> },
        { name: 'Asia Pay', icon: <MobilePaymentIcon className="w-8 h-8 text-gold" /> },
        { name: 'FIB', icon: <BankIcon className="w-8 h-8 text-gold" /> },
        { name: 'USDT (Tether)', icon: <CryptoIcon className="w-8 h-8 text-gold" /> },
    ];

    return (
        <div className="p-4 text-brand-text">
            <h1 className="text-2xl font-bold mb-6 text-center">Fund Your Account</h1>

            {tradingWallet && (
                 <div className="bg-brand-surface rounded-xl p-4 mb-6 text-center shadow-lg">
                    <h3 className="text-brand-text-secondary font-medium">Trading Wallet Balance</h3>
                    <p className="text-brand-text text-3xl font-bold mt-1">
                        ${tradingWallet.balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
            )}

            <div className="bg-brand-surface rounded-xl p-6 shadow-lg space-y-6">
                <div className="grid grid-cols-2 gap-2 bg-brand-light p-1 rounded-lg">
                    <button
                        onClick={() => setTransactionType('Deposit')}
                        className={`py-2 px-4 rounded-md text-sm font-semibold transition ${transactionType === 'Deposit' ? 'bg-gold text-black' : 'text-brand-text-secondary'}`}
                    >
                        Deposit
                    </button>
                    <button
                        onClick={() => setTransactionType('Withdrawal')}
                        className={`py-2 px-4 rounded-md text-sm font-semibold transition ${transactionType === 'Withdrawal' ? 'bg-gold text-black' : 'text-brand-text-secondary'}`}
                    >
                        Withdrawal
                    </button>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-gold mb-4">Select a {transactionType} Method</h2>
                    <div className="space-y-3">
                        {paymentMethods.map(method => (
                            <PaymentMethodCard key={method.name} name={method.name} icon={method.icon} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Fund;