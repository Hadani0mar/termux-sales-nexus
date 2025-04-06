
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
  isFrozen?: boolean; // New field to track frozen debt status
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
