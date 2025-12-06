// Dashboard types and interfaces
import type { Shop } from '../../lib/shops/types';
import type {User} from "../../lib/types/auth";

export interface DashboardProps {
  language: 'en' | 'fr';
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  currentUser: User;
  onLogout: () => void;
  currentShop?: Shop;
  onBackToShops?: () => void;
}

export interface Product {
  id: string;
  title: string;
  sku: string;
  price: number;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  category: string;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  title: string;
  sku: string;
  price: number;
  stock: number;
  attributes: { size?: string; color?: string; material?: string };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  productsCount: number;
  status: 'active' | 'inactive';
}

export type CategoryType = 'audit' | 'cms' | 'backoffice' | 'settings';
export type AuditTab =
  | 'audit-sales'
  | 'audit-stock'
  | 'audit-chatbot'
  | 'audit-ab-testing'
  | 'audit-history';
