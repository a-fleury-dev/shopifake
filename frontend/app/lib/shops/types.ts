// Shop types and interfaces

export type ShopRole = 'admin' | 'manager' | 'reader';

export interface Shop {
  id: string;
  name: string;
  domain: string;
  banner: string;
  description?: string;
  createdAt: string;
  userRole: ShopRole;
  collaborators?: ShopCollaborator[];
  settings?: {
    currency: string;
    timezone: string;
    language: string;
  };
}

export interface ShopCollaborator {
  email: string;
  role: ShopRole;
  name?: string;
  addedAt: string;
}

export interface CreateShopFormData {
  name: string;
  domain: string;
  description?: string;
  collaborators: ShopCollaborator[];
  currency: string;
  timezone: string;
  language: string;
}
