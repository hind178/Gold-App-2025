
import React, { useState, useMemo } from 'react';

interface PhysicalGoldProps {
  goldPricePerGram: number;
}

const FIXED_COMMISSION_RATE = 1.5; // 1.5%

const PhysicalGold: React.FC<PhysicalGoldProps> = ({ goldPricePerGram }) => {
  const [tradeType, setTradeType] = useState<'Buy' | 'Sell'>('Buy');
  const [grams, setGrams] = useState<string>('10');

  const numericGrams = parseFloat(grams) || 0;

  const { subtotal, commission, total } = useMemo(() => {
    const basePrice = numericGrams * goldPricePerGram;
    const commissionAmount = basePrice * (FIXED_COMMISSION_RATE / 100);
    
    let finalTotal = 0;
    if (tradeType === 'Buy') {
      finalTotal = basePrice + commissionAmount;
    } else {
      finalTotal = basePrice - commissionAmount;
    }

    return {
      subtotal: basePrice,
      commission: commissionAmount,
      total: finalTotal,
    };
  }, [numericGrams, goldPricePerGram, tradeType]);

  const handleTrade = () => {
    alert(`${tradeType} ${numericGrams}g of gold for $${total.toFixed(2)}.`);
  }

  return (
    <div className="p-4 text-brand-text">
      <h1 className="text-2xl font-bold mb-6 text-center">Physical Gold</h1>

      <div className="bg-brand-surface rounded-xl p-6 shadow-lg space-y-6">
        {/* Trade Type Toggle */}
        <div className="grid grid-cols-2 gap-2 bg-brand-light p-1 rounded-lg">
          <button
            onClick={() => setTradeType('Buy')}
            className={`py-2 px-4 rounded-md text-sm font-semibold transition ${tradeType === 'Buy' ? 'bg-gold text-black' : 'text-brand-text-secondary'}`}
          >
            Buy Gold
          </button>
          <button
            onClick={() => setTradeType('Sell')}
            className={`py-2 px-4 rounded-md text-sm font-semibold transition ${tradeType === 'Sell' ? 'bg-gold text-black' : 'text-brand-text-secondary'}`}
          >
            Sell Gold
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label htmlFor="grams" className="block text-sm font-medium text-brand-text-secondary mb-1">
            Amount (grams)
          </label>
          <div className="relative">
            <input
              type="number"
              id="grams"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              className="w-full bg-brand-light border-brand-light border rounded-lg p-3 text-brand-text text-lg focus:ring-gold focus:border-gold"
              placeholder="e.g., 10.5"
            />
            <span className="absolute inset-y-0 right-3 flex items-center text-brand-text-secondary">g</span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t border-brand-light pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-brand-text-secondary">Gold Value</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-text-secondary">Commission ({FIXED_COMMISSION_RATE}%)</span>
            <span className="font-medium">${commission.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button 
          onClick={handleTrade}
          className="w-full bg-gold text-black font-bold py-3 rounded-lg hover:bg-gold-dark transition-colors duration-200"
        >
          {tradeType === 'Buy' ? 'Confirm Purchase' : 'Confirm Sale'}
        </button>
      </div>
    </div>
  );
};

export default PhysicalGold;