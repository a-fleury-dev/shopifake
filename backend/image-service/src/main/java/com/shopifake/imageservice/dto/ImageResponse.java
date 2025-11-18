package com.shopifake.imageservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageResponse {
    private UUID id;
    private String storeId;
    private String entityType;
    private String productId;
    private String variantId;
    private String bucketName;
    private String objectKey;
    private String fileName;
    private String contentType;
    private Long sizeBytes;
    private Integer displayOrder;
    private LocalDateTime uploadedAt;
    private LocalDateTime updatedAt;
    private String url;
}
