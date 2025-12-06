/**
 * Data Transfer Objects for Shop API
 * Based on main-api response structure
 */

import type {UUID} from "node:crypto";

/**
 * Shop DTO - matches the backend response
 */
export interface ShopDTO {
  id: number;
  adminId: UUID;
  domainName: string;
  name: string;
  description: string | null;
  bannerUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Shop Create Request DTO
 */
export interface CreateShopRequestDTO {
  adminId: UUID;
  name: string;
  domainName: string;
  description?: string;
  bannerUrl?: string;
}

/**
 * Shop Update Request DTO
 */
export interface UpdateShopRequestDTO {
  name?: string;
  domainName?: string;
  description?: string;
  bannerUrl?: string;
}
