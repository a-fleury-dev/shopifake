package com.shopifake.mainapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProductRequest(
        @NotBlank(message = "Le nom du produit est obligatoire")
        @Size(max = 255, message = "Le nom ne peut pas dépasser 255 caractères")
        String name,

        @Size(max = 5000, message = "La description ne peut pas dépasser 5000 caractères")
        String description,

        Boolean isActive
) {
}

