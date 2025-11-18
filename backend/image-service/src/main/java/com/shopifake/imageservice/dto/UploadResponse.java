package com.shopifake.imageservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UploadResponse {

    private String imageId;
    private String storeId;
    private String entityType;
    private String fileName;
    private String bucketName;
    private String objectKey;
    private String url;
    private Long sizeBytes;
    private Integer displayOrder;
    private String message;
}


