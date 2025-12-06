/**
 * Shop API Client
 * Handles all HTTP requests to the shop service
 */

import { API_CONFIG } from '../config/api';
import type { ShopDTO, CreateShopRequestDTO, UpdateShopRequestDTO } from '../lib/shops/dto';
import type {UUID} from "node:crypto";

/**
 * Fetch all shops for a specific admin
 */
export async function fetchShopsByAdminId(adminId: UUID): Promise<ShopDTO[]> {
  const response = await fetch(API_CONFIG.endpoints.shops.byAdmin(adminId), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch shops: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a single shop by ID
 */
export async function fetchShopById(shopId: number): Promise<ShopDTO> {
  const response = await fetch(API_CONFIG.endpoints.shops.byId(shopId), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch shop: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a single shop by domain name
 */
export async function fetchShopByDomain(domainName: string): Promise<ShopDTO> {
  const response = await fetch(API_CONFIG.endpoints.shops.byDomain(domainName), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch shop by domain: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Create a new shop
 */
export async function createShop(data: CreateShopRequestDTO): Promise<ShopDTO> {
  const response = await fetch(API_CONFIG.endpoints.shops.create(), {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create shop: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update an existing shop
 */
export async function updateShop(shopId: number, data: UpdateShopRequestDTO): Promise<ShopDTO> {
  const response = await fetch(API_CONFIG.endpoints.shops.update(shopId), {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update shop: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Delete a shop
 */
export async function deleteShop(shopId: number): Promise<void> {
  const response = await fetch(API_CONFIG.endpoints.shops.delete(shopId), {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete shop: ${response.status} ${response.statusText}`);
  }
}
