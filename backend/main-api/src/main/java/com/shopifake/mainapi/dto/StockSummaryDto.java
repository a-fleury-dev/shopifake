package com.shopifake.mainapi.dto;

import java.math.BigDecimal;
import java.util.List;

public record StockSummaryDto(
        Integer totalUnits,
        BigDecimal totalValue,
        List<StockActionDto> recentActions
) {
}

