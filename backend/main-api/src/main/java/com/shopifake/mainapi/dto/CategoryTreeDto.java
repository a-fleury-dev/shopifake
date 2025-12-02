package com.shopifake.mainapi.dto;

import java.util.List;

public record CategoryTreeDto(
        List<CategoryTreeNodeDto> children
) {}

