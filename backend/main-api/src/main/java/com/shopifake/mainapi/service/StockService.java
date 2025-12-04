package com.shopifake.mainapi.service;

import com.shopifake.mainapi.dto.StockActionDto;
import com.shopifake.mainapi.dto.StockActionRequest;
import com.shopifake.mainapi.dto.StockSummaryDto;
import com.shopifake.mainapi.exception.BadRequestException;
import com.shopifake.mainapi.exception.ResourceNotFoundException;
import com.shopifake.mainapi.model.ActionType;
import com.shopifake.mainapi.model.ProductVariant;
import com.shopifake.mainapi.model.StockAction;
import com.shopifake.mainapi.repository.ProductVariantRepository;
import com.shopifake.mainapi.repository.StockActionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StockService {

    private final ProductVariantRepository variantRepository;
    private final StockActionRepository stockActionRepository;

    @Transactional
    public StockActionDto performStockAction(StockActionRequest request) {
        // Récupérer le variant par SKU
        ProductVariant variant = variantRepository.findBySku(request.sku())
                .orElseThrow(() -> new ResourceNotFoundException("ProductVariant", "sku", request.sku()));

        // Valider l'action
        if (request.actionType() == ActionType.REMOVE) {
            if (variant.getStock() < request.quantity()) {
                throw new BadRequestException(
                        "Stock insuffisant pour le SKU " + request.sku() +
                        ". Stock actuel : " + variant.getStock() +
                        ", quantité demandée : " + request.quantity()
                );
            }
            variant.setStock(variant.getStock() - request.quantity());
        } else {
            variant.setStock(variant.getStock() + request.quantity());
        }

        // Sauvegarder le variant mis à jour
        variantRepository.save(variant);

        // Créer l'action de stock
        StockAction stockAction = new StockAction();
        stockAction.setVariantId(variant.getId());
        stockAction.setSku(request.sku());
        stockAction.setActionType(request.actionType());
        stockAction.setQuantity(request.quantity());
        stockAction = stockActionRepository.save(stockAction);

        return toDto(stockAction);
    }

    @Transactional(readOnly = true)
    public StockSummaryDto getStockSummary(Long shopId) {
        // Calculer le nombre total d'unités
        Integer totalUnits = variantRepository.sumStockByShopId(shopId);
        if (totalUnits == null) {
            totalUnits = 0;
        }

        // Calculer la valeur totale du stock
        BigDecimal totalValue = variantRepository.sumStockValueByShopId(shopId);
        if (totalValue == null) {
            totalValue = BigDecimal.ZERO;
        }

        // Récupérer les dernières actions (20 dernières)
        List<StockAction> recentActions = stockActionRepository.findRecentByShopId(shopId, PageRequest.of(0, 20));
        List<StockActionDto> recentActionsDto = recentActions.stream()
                .map(this::toDto)
                .toList();

        return new StockSummaryDto(totalUnits, totalValue, recentActionsDto);
    }

    private StockActionDto toDto(StockAction stockAction) {
        return new StockActionDto(
                stockAction.getId(),
                stockAction.getSku(),
                stockAction.getActionType(),
                stockAction.getQuantity(),
                stockAction.getCreatedAt()
        );
    }
}

