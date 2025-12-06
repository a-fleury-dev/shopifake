package com.shopifake.mainapi.dto;

import java.util.List;

public record ProductWithVariantsDto(
        ProductDto product,
        List<ProductVariantDto> variants
) {}
