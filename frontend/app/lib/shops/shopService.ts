import type { Shop, CreateShopFormData } from './types';
import { mockShops } from './mockData';

const STORAGE_KEY = 'shopifake_shops';

// Initialize localStorage with mock data if empty
function initializeShops(): Shop[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockShops));
    return mockShops;
  }
  return JSON.parse(stored);
}

export function getAllShops(): Shop[] {
  return initializeShops();
}

export function getShopById(id: string): Shop | undefined {
  const shops = getAllShops();
  return shops.find(shop => shop.id === id);
}

export function createShop(formData: CreateShopFormData): Shop {
  const shops = getAllShops();
  
  const newShop: Shop = {
    id: `shop-${Date.now()}`,
    name: formData.name,
    domain: formData.domain,
    banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    description: formData.description,
    createdAt: new Date().toISOString().split('T')[0],
    userRole: 'admin',
    collaborators: formData.collaborators.map(c => ({
      ...c,
      name: c.email.split('@')[0]
    })),
    settings: {
      currency: formData.currency,
      timezone: formData.timezone,
      language: formData.language
    }
  };

  const updatedShops = [...shops, newShop];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedShops));
  
  return newShop;
}

export function updateShop(id: string, updates: Partial<Shop>): Shop | null {
  const shops = getAllShops();
  const index = shops.findIndex(shop => shop.id === id);
  
  if (index === -1) return null;
  
  shops[index] = { ...shops[index], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(shops));
  
  return shops[index];
}

export function deleteShop(id: string): boolean {
  const shops = getAllShops();
  const filtered = shops.filter(shop => shop.id !== id);
  
  if (filtered.length === shops.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}
