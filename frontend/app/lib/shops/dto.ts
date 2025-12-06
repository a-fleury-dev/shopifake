/**
 * Data Transfer Objects for Shop API
 * Based on main-api response structure
 */

/**
 * Shop DTO - matches the backend response
 */
export interface ShopDTO {
  id: number;
  adminId: number;
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
  adminId: number;
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
