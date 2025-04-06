
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  barcode?: string;
  cost?: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  discount: number;
  tax: number;
  finalTotal: number;
  paymentMethod: "cash" | "card" | "other";
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  discountReason?: string;
  isDebt?: boolean;
  debtorName?: string;
  isFrozen?: boolean; // Track frozen debt status
  createdAt: Date;
}

export interface AppState {
  products: Product[];
  cart: CartItem[];
  sales: Sale[];
}

export interface Category {
  id: string;
  name: string;
  color?: string;
}

// New interface for shift reports
export interface ShiftReport {
  id: string;
  date: Date;
  salesCount: number;
  totalSales: number;
  totalCashSales: number;
  totalCardSales: number;
  totalDebtSales: number;
  cashInDrawer: number;
  cashShortage: number;
  notes?: string;
  includeDebtInTotal: boolean;
}

// New interface for debtor
export interface Debtor {
  name: string;
  phone?: string;
  limit: number;
  notes?: string;
  currentDebt: number;
}
