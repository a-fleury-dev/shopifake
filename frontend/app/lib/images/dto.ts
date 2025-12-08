/**
 * Data Transfer Objects for Image Service API
 */

/**
 * Image Upload Response DTO
 */
export interface ImageUploadResponseDTO {
  imageId: string;
  storeId: string;
  entityType: string;
  fileName: string;
  bucketName: string;
  objectKey: string;
  url: string;
  sizeBytes: number;
  displayOrder: number;
  message: string;
}
