package com.shopifake.mainapi.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.Map;

public record CreateProductVariantRequest(
        @NotNull(message = "L'ID du produit est obligatoire")
        Long productId,

        @NotNull(message = "L'ID de boutique est obligatoire")
        Long shopId,

        @NotBlank(message = "Le SKU est obligatoire")
        @Size(max = 100, message = "Le SKU ne peut pas dépasser 100 caractères")
        String sku,

        @NotNull(message = "Le prix est obligatoire")
        @DecimalMin(value = "0.0", inclusive = true, message = "Le prix doit être positif")
        BigDecimal price,

        @NotNull(message = "Le stock est obligatoire")
        @Min(value = 0, message = "Le stock doit être positif ou nul")
        Integer stock,

        Boolean isActive,

        @NotNull(message = "Les attributs sont obligatoires")
        Map<Long, String> attributes // Map<attributeDefinitionId, attributeValue>
) {
}

