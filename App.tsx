import React, { useState, useEffect, useRef, useMemo } from 'react';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import PhysicalGold from './components/PhysicalGold';
import TradingGold from './components/TradingGold';
import Login from './components/Login';
import Header from './components/Header';
import Fund from './components/Fund';
import AdminLayout from './components/admin/AdminLayout';
import Profile from './components/Profile';
import type { Wallet, Transaction, ChartDataPoint, TimeRange, Position, Theme, AdminUser, Role, Permission, AuditLog, IndividualUser } from './types';

// Mock Data
const mockWallets: Wallet[] = [
  { type: 'Physical', balanceGrams: 50.1234, balanceUSD: 11528.38 },
  { type: 'Trading', balanceGrams: 0, balanceUSD: 25000.00 },
];

const mockRecentTransactions: Transaction[] = [
  { id: '1', type: 'Buy', wallet: 'Physical', amountGrams: 10, amountUSD: 2300.00, date: '2023-10-27', status: 'Completed' },
  { id: '2', type: 'Deposit', wallet: 'Trading', amountUSD: 5000.00, date: '2023-10-26', status: 'Completed' },
  { id: '3', type: 'Sell', wallet: 'Physical', amountGrams: 5, amountUSD: 1145.00, date: '2023-10-25', status: 'Completed' },
];

const mockIndividualUser: IndividualUser = {
  name: 'John Doe',
  email: 'john.doe@email.com',
  phone: '+1 (555) 123-4567'
};

const initialMockAdminUsers: AdminUser[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@auragold.com', role: 'Super Admin', createdAt: '2023-01-15' },
  { id: '2', name: 'Bob Williams', email: 'bob@auragold.com', role: 'Content Manager', createdAt: '2023-03-22' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@auragold.com', role: 'Support', createdAt: '2023-05-10' },
];

const mockPermissions: Permission[] = ['users:create', 'users:read', 'users:update', 'users:delete', 'roles:manage', 'transactions:view', 'logs:view'];

const initialMockRoles: Role[] = [
  { id: 'role1', name: 'Super Admin', description: "Has all permissions.", permissions: ['users:create', 'users:read', 'users:update', 'users:delete', 'roles:manage', 'transactions:view', 'logs:view']},
  { id: 'role2', name: 'Content Manager', description: "Can view users and logs.", permissions: ['users:read', 'logs:view'] },
  { id: 'role3', name: 'Support', description: "Can view transactions.", permissions: ['transactions:view'] },
];

const mockAuditLogs: AuditLog[] = [
    { id: 'log1', user: 'Alice Johnson', action: 'Deleted user "dave@auragold.com"', date: new Date().toLocaleString() },
    { id: 'log2', user: 'Bob Williams', action: 'Published new market analysis', date: new Date(Date.now() - 3600000).toLocaleString() },
    { id: 'log3', user: 'Alice Johnson', action: 'Updated "Support" role permissions', date: new Date(Date.now() - 86400000).toLocaleString() },
];


const ozToGram = 28.3495;
const INITIAL_GOLD_PRICE = 3884.00; // Updated to a more realistic price

const generateMockChartData = (numPoints: number, basePrice: number, volatility: number, timePrefix: string): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  let price = basePrice - (numPoints / 2) * (volatility * Math.random());
  for (let i = 0; i < numPoints; i++) {
    price += (Math.random() - 0.48) * volatility;
    data.push({ date: `${timePrefix}-${numPoints - i}`, price: parseFloat(price.toFixed(2)) });
  }
  return data;
};


export type ActiveView = 'dashboard' | 'physical' | 'trading' | 'fund' | 'profile' | 'admin';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userType, setUserType] = useState<'individual' | 'company' | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('aura_gold_theme');
    // Default to 'dark' if no theme is stored.
    return (storedTheme as Theme) || 'dark';
  });

  // App-wide state
  const [wallets, setWallets] = useState<Wallet[]>(mockWallets);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(mockRecentTransactions);
  const [openPositions, setOpenPositions] = useState<Position[]>([]);
  const [roles, setRoles] = useState<Role[]>(initialMockRoles);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(initialMockAdminUsers);

  // Real-time data states
  const [goldPrice, setGoldPrice] = useState(INITIAL_GOLD_PRICE);
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | 'neutral'>('neutral');
  const [priceChangePercent, setPriceChangePercent] = useState(0);
  
  // Chart data states
  const [timeRange, setTimeRange] = useState<TimeRange>('5M');
  const [chartData5M, setChartData5M] = useState<ChartDataPoint[]>(generateMockChartData(60, INITIAL_GOLD_PRICE, 0.5, 'T'));
  const [chartData1H, setChartData1H] = useState<ChartDataPoint[]>(generateMockChartData(72, INITIAL_GOLD_PRICE - 5, 1.5, 'H'));
  const [chartData4H, setChartData4H] = useState<ChartDataPoint[]>(generateMockChartData(84, INITIAL_GOLD_PRICE - 20, 4, 'D'));

  const timeCounterRef = useRef(1);
  const priceDriftRef = useRef((Math.random() - 0.5) * 0.1);

  const goldPricePerGram = goldPrice / ozToGram;
  const goldPricePerKg = goldPricePerGram * 1000;
  
  useEffect(() => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('aura_gold_theme', theme);
  }, [theme]);

  useEffect(() => {
    // Check for auth state in local storage on initial load
    const storedAuth = localStorage.getItem('aura_gold_auth');
    const storedUserType = localStorage.getItem('aura_gold_user_type');
    if (storedAuth === 'true' && (storedUserType === 'individual' || storedUserType === 'company')) {
      setIsAuthenticated(true);
      setUserType(storedUserType as 'individual' | 'company');
    }
  }, []);
  
  useEffect(() => {
    if (!isAuthenticated) return;

    // Simulate real-time price fluctuation to avoid API rate limits
    const priceUpdateInterval = setInterval(() => {
      // 10% chance to change drift direction for more realistic market simulation
      if (Math.random() < 0.1) {
        priceDriftRef.current = (Math.random() - 0.5) * 0.1;
      }
      
      setGoldPrice(prevPrice => {
        const volatility = 0.5; // Controls the size of the random jump
        // Combines random fluctuation with a persistent drift
        const change = ((Math.random() - 0.48) * volatility) + priceDriftRef.current;
        const newPrice = parseFloat((prevPrice + change).toFixed(2));

        if (prevPrice > 0) {
          const percentChange = (change / prevPrice) * 100;
          setPriceChangePercent(percentChange);
          setPriceDirection(change > 0 ? 'up' : change < 0 ? 'down' : 'neutral');
        }

        // Update the 5M chart with the new simulated price
        setChartData5M(prevData => {
          const newPoint = {
            date: `T+${timeCounterRef.current}`,
            price: newPrice,
          };
          timeCounterRef.current += 1;
          return [...prevData.slice(1), newPoint];
        });

        return newPrice;
      });
    }, 2000); // Update price every 2 seconds

    return () => clearInterval(priceUpdateInterval);
  }, [isAuthenticated]);

  const activeChartData = useMemo(() => {
    switch (timeRange) {
        case '5M': return chartData5M;
        case '1H': return chartData1H;
        case '4H': return chartData4H;
        default: return chartData5M;
    }
  }, [timeRange, chartData5M, chartData1H, chartData4H]);


  const handleLogin = (loggedInUserType: 'individual' | 'company') => {
    localStorage.setItem('aura_gold_auth', 'true');
    localStorage.setItem('aura_gold_user_type', loggedInUserType);
    setUserType(loggedInUserType);
    setIsAuthenticated(true);
    if (loggedInUserType === 'company') {
        setActiveView('admin');
    } else {
        setActiveView('dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('aura_gold_auth');
    localStorage.removeItem('aura_gold_user_type');
    setIsAuthenticated(false);
    setUserType(null);
    setActiveView('dashboard'); // Reset to default view on logout
  };

  const handleToggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleOpenPosition = (type: 'Buy' | 'Sell', amountGrams: number) => {
    const newPosition: Position = {
        id: `pos_${Date.now()}`,
        type,
        amountGrams,
        openPrice: goldPricePerGram,
        openDate: new Date().toISOString(),
    };
    setOpenPositions(prev => [...prev, newPosition]);
  };

  const handleClosePosition = (positionId: string) => {
    const positionToClose = openPositions.find(p => p.id === positionId);
    if (!positionToClose) return;

    const currentPrice = goldPricePerGram;
    let profitLoss = 0;

    if (positionToClose.type === 'Buy') {
        profitLoss = (currentPrice - positionToClose.openPrice) * positionToClose.amountGrams;
    } else { // 'Sell'
        profitLoss = (positionToClose.openPrice - currentPrice) * positionToClose.amountGrams;
    }

    // Update wallet
    setWallets(prevWallets => prevWallets.map(wallet => 
        wallet.type === 'Trading' 
            ? { ...wallet, balanceUSD: wallet.balanceUSD + profitLoss } 
            : wallet
    ));

    // Add transaction record
    const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: profitLoss >= 0 ? 'Deposit' : 'Withdrawal',
        wallet: 'Trading',
        amountUSD: Math.abs(profitLoss),
        date: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
        status: 'Completed',
    };
    setRecentTransactions(prev => [newTransaction, ...prev]);

    // Remove position
    setOpenPositions(prev => prev.filter(p => p.id !== positionId));
  };

  const handleSaveRole = (updatedRole: Role) => {
    setRoles(prevRoles =>
      prevRoles.map(role => (role.id === updatedRole.id ? updatedRole : role))
    );
    // In a real app, you would show a success toast here.
  };

  const handleCreateUser = (newUser: Omit<AdminUser, 'id' | 'createdAt'>) => {
    setAdminUsers(prevUsers => [
      ...prevUsers,
      {
        ...newUser,
        id: `user_${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      },
    ]);
  };

  const handleUpdateUser = (updatedUser: AdminUser) => {
    setAdminUsers(prevUsers =>
      prevUsers.map(user => (user.id === updatedUser.id ? updatedUser : user))
    );
  };
  
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard 
                  wallets={wallets} 
                  recentTransactions={recentTransactions} 
                  goldPrice={goldPrice}
                  priceDirection={priceDirection}
                  priceChangePercent={priceChangePercent}
                  setActiveView={setActiveView}
                />;
      case 'physical':
        return <PhysicalGold goldPricePerGram={goldPricePerGram} />;
      case 'trading':
        return <TradingGold 
                  theme={theme}
                  chartData={activeChartData} 
                  activeTimeRange={timeRange}
                  setActiveTimeRange={setTimeRange}
                  goldPricePerGram={goldPricePerGram}
                  goldPricePerKg={goldPricePerKg}
                  openPositions={openPositions}
                  onOpenPosition={handleOpenPosition}
                  onClosePosition={handleClosePosition}
                />;
      case 'fund':
        return <Fund wallets={wallets} />;
      case 'profile':
        return <Profile user={mockIndividualUser} />;
      case 'admin':
        if (userType === 'company') {
          return <AdminLayout 
                    adminUsers={adminUsers} 
                    roles={roles} 
                    auditLogs={mockAuditLogs}
                    permissions={mockPermissions}
                    onSaveRole={handleSaveRole}
                    onCreateUser={handleCreateUser}
                    onUpdateUser={handleUpdateUser}
                  />;
        }
        // Fallback for non-admins
        return <Dashboard 
                  wallets={wallets} 
                  recentTransactions={recentTransactions} 
                  goldPrice={goldPrice}
                  priceDirection={priceDirection}
                  priceChangePercent={priceChangePercent}
                  setActiveView={setActiveView}
                />;
      default:
        return <Dashboard 
                  wallets={wallets} 
                  recentTransactions={recentTransactions} 
                  goldPrice={goldPrice}
                  priceDirection={priceDirection}
                  priceChangePercent={priceChangePercent}
                  setActiveView={setActiveView}
                />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="bg-brand-bg text-brand-text min-h-screen font-sans">
      <div className="max-w-md mx-auto bg-brand-bg flex flex-col" style={{ minHeight: '100vh' }}>
        <Header onLogout={handleLogout} theme={theme} onToggleTheme={handleToggleTheme} />
        <main className="flex-grow pb-20">
          {renderContent()}
        </main>
        <BottomNav activeView={activeView} setActiveView={setActiveView} userType={userType!} />
      </div>
    </div>
  );
};

export default App;