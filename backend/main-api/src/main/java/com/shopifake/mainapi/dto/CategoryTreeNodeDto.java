package com.shopifake.mainapi.dto;

import java.util.List;

public record CategoryTreeNodeDto(
        Long id,
        String label,
        String slug,
        Integer position,
        List<CategoryTreeNodeDto> children
) {}

