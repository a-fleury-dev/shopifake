package com.shopifake.mainapi.dto;

import java.time.Instant;
import java.util.List;

public record ProductDto(
        Long id,
        Long categoryId,
        Long shopId,
        String name,
        String slug,
        String description,
        Boolean isActive,
        Instant createdAt,
        Instant updatedAt,
        List<AttributeDefinitionDto> attributeDefinitions
) {
}

