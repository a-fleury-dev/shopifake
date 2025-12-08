package com.shopifake.mainapi.dto;

import com.shopifake.mainapi.model.ActionType;

import java.time.Instant;

public record StockActionDto(
        Long id,
        String sku,
        ActionType actionType,
        Integer quantity,
        Instant createdAt
) {
}

