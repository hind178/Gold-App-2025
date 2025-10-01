
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartDataPoint, TimeRange, Position, Theme } from '../types';
import { CloseIcon } from './icons';

interface TradingGoldProps {
  chartData: ChartDataPoint[];
  activeTimeRange: TimeRange;
  setActiveTimeRange: (range: TimeRange) => void;
  goldPricePerGram: number;
  goldPricePerKg: number;
  openPositions: Position[];
  onOpenPosition: (type: 'Buy' | 'Sell', amountGrams: number) => void;
  onClosePosition: (positionId: string) => void;
  theme: Theme;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-light p-2 border border-brand-light rounded-md shadow-lg">
        <p className="label text-brand-text-secondary">{`${label}`}</p>
        <p className="intro text-gold">{`Price: $${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

const PositionCard: React.FC<{ position: Position; currentPrice: number; onClose: (id: string) => void; }> = ({ position, currentPrice, onClose }) => {
    const { id, type, amountGrams, openPrice } = position;
    
    const profitLoss = useMemo(() => {
        if (type === 'Buy') {
            return (currentPrice - openPrice) * amountGrams;
        }
        return (openPrice - currentPrice) * amountGrams;
    }, [currentPrice, openPrice, amountGrams, type]);

    const isProfit = profitLoss >= 0;

    return (
        <div className="bg-brand-light rounded-lg p-3 grid grid-cols-3 gap-2 text-sm relative">
            <div className="col-span-1 space-y-1">
                <p className={`font-bold ${type === 'Buy' ? 'text-green-400' : 'text-red-400'}`}>{type.toUpperCase()}</p>
                <p className="text-brand-text font-mono">{amountGrams}g</p>
            </div>
            <div className="col-span-1 space-y-1 text-center">
                <p className="text-brand-text-secondary text-xs">Open</p>
                <p className="text-brand-text font-mono">${openPrice.toFixed(2)}</p>
            </div>
            <div className="col-span-1 space-y-1 text-right">
                <p className="text-brand-text-secondary text-xs">P/L</p>
                <p className={`font-bold font-mono ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                    {isProfit ? '+' : ''}${profitLoss.toFixed(2)}
                </p>
            </div>
            <button 
                onClick={() => onClose(id)}
                className="absolute -top-1 -right-1 bg-red-600 rounded-full p-0.5 hover:bg-red-700 transition-colors"
                aria-label="Close position"
            >
                <CloseIcon className="w-3 h-3 text-white" />
            </button>
        </div>
    );
};


const TradingGold: React.FC<TradingGoldProps> = ({ chartData, activeTimeRange, setActiveTimeRange, goldPricePerGram, goldPricePerKg, openPositions, onOpenPosition, onClosePosition, theme }) => {
  const [gramSize, setGramSize] = useState('10');
  
  const axisColor = theme === 'dark' ? '#A0A0A0' : '#6B7280';
  const gridColor = theme === 'dark' ? '#2A2A2A' : '#E5E7EB';

  const handleTrade = (type: 'Buy' | 'Sell') => {
    const amount = parseFloat(gramSize);
    if (!isNaN(amount) && amount > 0) {
        onOpenPosition(type, amount);
        setGramSize('10'); // Reset after trade
    } else {
        alert('Please enter a valid, positive amount of grams.');
    }
  };

  return (
    <div className="p-4 text-brand-text">
      <h1 className="text-2xl font-bold mb-2 text-center">Trading Terminal</h1>
      <p className="text-center text-brand-text-secondary mb-1">XAU/USD Market</p>
      <p className="text-center text-xs text-yellow-500 mb-4">(Live price is simulated to prevent API errors)</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-center">
        <div className="bg-brand-surface p-3 rounded-lg shadow-md">
          <p className="text-xs text-brand-text-secondary">Price / Gram</p>
          <p className="font-bold text-gold">${goldPricePerGram.toFixed(2)}</p>
        </div>
        <div className="bg-brand-surface p-3 rounded-lg shadow-md">
          <p className="text-xs text-brand-text-secondary">Price / KG</p>
          <p className="font-bold text-gold">${goldPricePerKg.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-center gap-2 mb-4">
        {(['5M', '1H', '4H'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setActiveTimeRange(range)}
              className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors duration-200 ${
                activeTimeRange === range 
                ? 'bg-gold text-black' 
                : 'bg-brand-light text-brand-text-secondary hover:bg-brand-surface'
              }`}
            >
              {range}
            </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-brand-surface rounded-xl p-4 shadow-lg h-64 md:h-80 w-full">
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="date" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 10']} allowDataOverflow={true} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="price" stroke="#FFD700" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Trading Controls */}
      <div className="mt-6 bg-brand-surface rounded-xl p-6 shadow-lg">
         <div className="mb-4">
          <label htmlFor="gramSize" className="block text-sm font-medium text-brand-text-secondary mb-1">
            Gram Size
          </label>
          <input
            type="number"
            id="gramSize"
            step="0.01"
            min="0.01"
            value={gramSize}
            onChange={(e) => setGramSize(e.target.value)}
            className="w-full bg-brand-light border-brand-light border rounded-lg p-3 text-brand-text text-lg focus:ring-gold focus:border-gold"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => handleTrade('Sell')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors">
            SELL
          </button>
          <button onClick={() => handleTrade('Buy')} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors">
            BUY
          </button>
        </div>
      </div>
      
      {/* Open Positions */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-brand-text mb-2">Open Positions</h2>
        <div className="bg-brand-surface rounded-xl p-2 space-y-2">
            {openPositions.length > 0 ? (
                openPositions.map(pos => <PositionCard key={pos.id} position={pos} currentPrice={goldPricePerGram} onClose={onClosePosition} />)
            ) : (
                <div className="text-center py-4">
                    <p className="text-brand-text-secondary">No open positions.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TradingGold;