package com.shopifake.mainapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCategoryRequest(
        @NotBlank(message = "Le label est obligatoire")
        @Size(max = 100, message = "Le label ne peut pas dépasser 100 caractères")
        String label,

        Long parentId,

        Integer position
) {}

