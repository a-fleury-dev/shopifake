package com.shopifake.mainapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateProductRequest(
        @NotNull(message = "L'ID de catégorie est obligatoire")
        Long categoryId,

        @NotNull(message = "L'ID de boutique est obligatoire")
        Long shopId,

        @NotBlank(message = "Le nom du produit est obligatoire")
        @Size(max = 255, message = "Le nom ne peut pas dépasser 255 caractères")
        String name,

        @Size(max = 5000, message = "La description ne peut pas dépasser 5000 caractères")
        String description,

        Boolean isActive,

        List<AttributeDefinitionDto> attributeDefinitions
) {
}

