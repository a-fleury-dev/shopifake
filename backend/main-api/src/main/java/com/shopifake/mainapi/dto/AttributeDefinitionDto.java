package com.shopifake.mainapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AttributeDefinitionDto(
        Long id,

        @NotBlank(message = "Le nom de l'attribut est obligatoire")
        @Size(max = 100, message = "Le nom de l'attribut ne peut pas dépasser 100 caractères")
        String attributeName,

        Integer position
) {
}

