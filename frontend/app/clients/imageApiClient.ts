/**
 * Image Service API Client
 * Handles image upload requests
 */

import { API_CONFIG } from '../config/api';
import type { ImageUploadResponseDTO } from '../lib/images/dto';

/**
 * Upload a store banner image
 */
export async function uploadStoreBanner(
  storeId: string,
  file: File
): Promise<ImageUploadResponseDTO> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(API_CONFIG.endpoints.images.uploadStoreBanner(storeId), {
    method: 'POST',
    body: formData,
    // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
  });

  if (!response.ok) {
    throw new Error(`Failed to upload image: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
