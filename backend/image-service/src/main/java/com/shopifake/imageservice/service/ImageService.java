package com.shopifake.imageservice.service;

import com.shopifake.imageservice.dto.ImageResponse;
import com.shopifake.imageservice.dto.UploadResponse;
import com.shopifake.imageservice.model.Image;
import com.shopifake.imageservice.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageService {

    private final ImageRepository imageRepository;
    private final MinioService minioService;

    @Transactional
    public UploadResponse uploadImage(
            MultipartFile file,
            Image.EntityType entityType,
            String storeId,
            String productId,
            String variantId,
            Integer displayOrder
    ) throws IOException {

        validateImageFile(file);
        validateEntityTypeReferences(entityType, productId, variantId);

        String fileName = generateFileName(file.getOriginalFilename());
        String bucketName = getBucketName(entityType);
        String objectKey = buildObjectKey(storeId, entityType, productId, variantId, fileName);

        minioService.ensureBucketExists(bucketName);
        minioService.uploadFile(file, bucketName, objectKey);

        Image image = Image.builder()
                .storeId(storeId)
                .entityType(entityType)
                .productId(productId)
                .variantId(variantId)
                .bucketName(bucketName)
                .objectKey(objectKey)
                .fileName(fileName)
                .contentType(file.getContentType())
                .sizeBytes(file.getSize())
                .displayOrder(displayOrder != null ? displayOrder : 0)
                .build();

        image = imageRepository.save(image);

        log.info("Image uploaded successfully: {} for store {} with type {}", fileName, storeId, entityType);

        return UploadResponse.builder()
                .imageId(image.getId().toString())
                .storeId(storeId)
                .entityType(entityType.name())
                .fileName(fileName)
                .bucketName(bucketName)
                .objectKey(objectKey)
                .url(minioService.getPublicUrl(bucketName, objectKey))
                .sizeBytes(file.getSize())
                .displayOrder(image.getDisplayOrder())
                .message("Image uploaded successfully")
                .build();
    }

    public ImageResponse getImageById(UUID id) {
        Image image = imageRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Image not found: " + id));

        return toImageResponse(image);
    }

    public ImageResponse getStoreBanner(String storeId) {
        List<Image> images = imageRepository.findByStoreIdAndEntityTypeAndDeletedAtIsNull(
                storeId, Image.EntityType.STORE_BANNER);
        if (images.isEmpty()) {
            return null;
        }
        return toImageResponse(images.get(0));
    }

    public List<ImageResponse> getBlogImages(String storeId) {
        return imageRepository.findByStoreIdAndEntityTypeAndDeletedAtIsNull(
                        storeId, Image.EntityType.BLOG_IMAGE)
                .stream()
                .map(this::toImageResponse)
                .collect(Collectors.toList());
    }

    public List<ImageResponse> getProductImages(String productId) {
        return imageRepository.findByProductIdAndDeletedAtIsNull(productId)
                .stream()
                .map(this::toImageResponse)
                .collect(Collectors.toList());
    }

    public List<ImageResponse> getVariantImages(String variantId) {
        return imageRepository.findByVariantIdAndDeletedAtIsNullOrderByDisplayOrderAsc(variantId)
                .stream()
                .map(this::toImageResponse)
                .collect(Collectors.toList());
    }

    public ImageResponse getPrimaryVariantImage(String variantId) {
        return imageRepository.findByVariantIdAndDisplayOrderAndDeletedAtIsNull(variantId, 0)
                .map(this::toImageResponse)
                .orElse(null);
    }

    public List<ImageResponse> getAllImages() {
        return imageRepository.findByDeletedAtIsNull()
                .stream()
                .map(this::toImageResponse)
                .collect(Collectors.toList());
    }

    public List<ImageResponse> getStoreImages(String storeId) {
        return imageRepository.findByStoreIdAndDeletedAtIsNull(storeId)
                .stream()
                .map(this::toImageResponse)
                .collect(Collectors.toList());
    }

    public InputStream downloadImage(UUID id) throws IOException {
        Image image = imageRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Image not found: " + id));

        return minioService.downloadFile(image.getBucketName(), image.getObjectKey());
    }

    @Transactional
    public void deleteImage(UUID id) throws IOException {
        Image image = imageRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Image not found: " + id));

        image.setDeletedAt(LocalDateTime.now());
        imageRepository.save(image);

        try {
            minioService.deleteFile(image.getBucketName(), image.getObjectKey());
            log.info("Image deleted: {}", id);
        } catch (IOException e) {
            log.error("Error deleting file from MinIO, but marked as deleted in DB", e);
        }
    }

    @Transactional
    public void deleteProductImages(String productId) throws IOException {
        List<Image> images = imageRepository.findByProductIdAndDeletedAtIsNull(productId);

        for (Image image : images) {
            image.setDeletedAt(LocalDateTime.now());
            imageRepository.save(image);

            try {
                minioService.deleteFile(image.getBucketName(), image.getObjectKey());
                log.info("Product image deleted: {}", image.getId());
            } catch (IOException e) {
                log.error("Error deleting product image {} from MinIO", image.getObjectKey(), e);
            }
        }
    }

    @Transactional
    public void deleteVariantImages(String variantId) throws IOException {
        List<Image> images = imageRepository.findByVariantIdAndDeletedAtIsNullOrderByDisplayOrderAsc(variantId);

        for (Image image : images) {
            image.setDeletedAt(LocalDateTime.now());
            imageRepository.save(image);

            try {
                minioService.deleteFile(image.getBucketName(), image.getObjectKey());
                log.info("Variant image deleted: {}", image.getId());
            } catch (IOException e) {
                log.error("Error deleting variant image {} from MinIO", image.getObjectKey(), e);
            }
        }
    }

    @Transactional
    public void deleteAllStoreImages(String storeId) throws IOException {
        List<Image> images = imageRepository.findByStoreIdAndDeletedAtIsNull(storeId);

        for (Image image : images) {
            image.setDeletedAt(LocalDateTime.now());
        }
        imageRepository.saveAll(images);

        try {
            minioService.deleteFolder("store-banners", storeId + "/");
            minioService.deleteFolder("blog-images", storeId + "/");
            minioService.deleteFolder("product-variants", storeId + "/");

            log.info("All images deleted for store: {}", storeId);
        } catch (Exception e) {
            log.error("Error deleting store images from MinIO: {}", storeId, e);
            throw new IOException("Store images deletion failed", e);
        }
    }

    private void validateImageFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File must be an image");
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File size must not exceed 10 MB");
        }
    }

    private void validateEntityTypeReferences(Image.EntityType entityType, String productId, String variantId) {
        switch (entityType) {
            case STORE_BANNER:
            case BLOG_IMAGE:
                if (productId != null || variantId != null) {
                    throw new IllegalArgumentException(
                            entityType + " should not have productId or variantId");
                }
                break;
            case VARIANT_IMAGE:
                if (productId == null || variantId == null) {
                    throw new IllegalArgumentException(
                            "VARIANT_IMAGE requires both productId and variantId");
                }
                break;
        }
    }

    private String generateFileName(String originalFilename) {
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        return UUID.randomUUID().toString() + extension;
    }

    private String getBucketName(Image.EntityType entityType) {
        return switch (entityType) {
            case STORE_BANNER -> "store-banners";
            case BLOG_IMAGE -> "blog-images";
            case VARIANT_IMAGE -> "product-variants";
        };
    }

    private String buildObjectKey(String storeId, Image.EntityType entityType,
                                   String productId, String variantId, String fileName) {
        return switch (entityType) {
            case STORE_BANNER -> String.format("%s/banner%s", storeId, getExtension(fileName));
            case BLOG_IMAGE -> String.format("%s/%s", storeId, fileName);
            case VARIANT_IMAGE -> String.format("%s/%s/%s/%s", storeId, productId, variantId, fileName);
        };
    }

    private String getExtension(String fileName) {
        if (fileName != null && fileName.contains(".")) {
            return fileName.substring(fileName.lastIndexOf("."));
        }
        return ".jpg";
    }

    private ImageResponse toImageResponse(Image image) {
        return ImageResponse.builder()
                .id(image.getId())
                .storeId(image.getStoreId())
                .entityType(image.getEntityType().name())
                .productId(image.getProductId())
                .variantId(image.getVariantId())
                .bucketName(image.getBucketName())
                .objectKey(image.getObjectKey())
                .fileName(image.getFileName())
                .contentType(image.getContentType())
                .sizeBytes(image.getSizeBytes())
                .displayOrder(image.getDisplayOrder())
                .uploadedAt(image.getUploadedAt())
                .updatedAt(image.getUpdatedAt())
                .url(minioService.getPublicUrl(image.getBucketName(), image.getObjectKey()))
                .build();
    }
}

