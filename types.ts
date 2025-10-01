export interface Wallet {
  type: 'Physical' | 'Trading';
  balanceGrams: number;
  balanceUSD: number;
}

export interface Transaction {
  id: string;
  type: 'Buy' | 'Sell' | 'Deposit' | 'Withdrawal';
  wallet: 'Physical' | 'Trading';
  amountGrams?: number;
  amountUSD: number;
  date: string;
  status: 'Completed' | 'Pending';
}

export interface ChartDataPoint {
  date: string;
  price: number;
}

export interface NewsArticle {
  title: string;
  summary: string;
  url: string;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export type TimeRange = '5M' | '1H' | '4H';

export interface Position {
  id: string;
  type: 'Buy' | 'Sell';
  amountGrams: number;
  openPrice: number; // Price per gram
  openDate: string;
}

export type Theme = 'light' | 'dark';

export interface IndividualUser {
  name: string;
  email: string;
  phone: string;
}

// --- Admin Panel Types ---

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string; 
  createdAt: string;
}

export type Permission =
  | 'users:create'
  | 'users:read'
  | 'users:update'
  | 'users:delete'
  | 'roles:manage'
  | 'transactions:view'
  | 'logs:view';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  date: string;
}