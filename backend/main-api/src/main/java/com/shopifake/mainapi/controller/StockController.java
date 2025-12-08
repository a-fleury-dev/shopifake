package com.shopifake.mainapi.controller;

import com.shopifake.mainapi.dto.StockActionDto;
import com.shopifake.mainapi.dto.StockActionRequest;
import com.shopifake.mainapi.dto.StockSummaryDto;
import com.shopifake.mainapi.service.StockService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shops/{shopId}/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @GetMapping("/summary")
    public ResponseEntity<StockSummaryDto> getStockSummary(@PathVariable Long shopId) {
        StockSummaryDto summary = stockService.getStockSummary(shopId);
        return ResponseEntity.ok(summary);
    }

    @PostMapping("/action")
    public ResponseEntity<StockActionDto> performStockAction(
            @PathVariable Long shopId,
            @Valid @RequestBody StockActionRequest request) {
        StockActionDto result = stockService.performStockAction(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
}

