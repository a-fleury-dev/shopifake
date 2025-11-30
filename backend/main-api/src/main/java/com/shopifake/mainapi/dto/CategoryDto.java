package com.shopifake.mainapi.dto;

public record CategoryDto(
        Long id,
        Long shopId,
        Long parentId,
        String label,
        String slug,
        Integer position
) {}

