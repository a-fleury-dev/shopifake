package com.shopifake.mainapi.dto;

import com.shopifake.mainapi.model.ActionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record StockActionRequest(
        @NotNull(message = "Le SKU est obligatoire")
        String sku,

        @NotNull(message = "Le type d'action est obligatoire")
        ActionType actionType,

        @NotNull(message = "La quantité est obligatoire")
        @Positive(message = "La quantité doit être positive")
        Integer quantity
) {
}

