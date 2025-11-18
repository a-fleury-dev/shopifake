import type { Product, Category } from './types';

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Classic T-Shirt',
    sku: 'TSH-001',
    price: 29.99,
    stock: 145,
    status: 'active',
    category: 'Clothing',
  },
  {
    id: '2',
    title: 'Denim Jeans',
    sku: 'JNS-002',
    price: 79.99,
    stock: 23,
    status: 'active',
    category: 'Clothing',
  },
  {
    id: '3',
    title: 'Summer Dress',
    sku: 'DRS-003',
    price: 59.99,
    stock: 0,
    status: 'draft',
    category: 'Clothing',
  },
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Clothing',
    description: 'All clothing items',
    productsCount: 145,
    status: 'active',
  },
  {
    id: '2',
    name: 'Shoes',
    description: 'Footwear collection',
    productsCount: 78,
    status: 'active',
  },
  {
    id: '3',
    name: 'Accessories',
    description: 'Fashion accessories',
    productsCount: 56,
    status: 'active',
  },
];
