package com.shopifake.mainapi.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;

public record ProductVariantDto(
        Long id,
        Long productId,
        Long shopId,
        String sku,
        BigDecimal price,
        Integer stock,
        Boolean isActive,
        Instant createdAt,
        Instant updatedAt,
        Map<String, String> attributes // Map<attributeName, attributeValue>
) {
}

