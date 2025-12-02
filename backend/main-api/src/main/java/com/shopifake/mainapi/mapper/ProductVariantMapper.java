package com.shopifake.mainapi.mapper;

import com.shopifake.mainapi.dto.ProductVariantDto;
import com.shopifake.mainapi.model.AttributeDefinition;
import com.shopifake.mainapi.model.ProductVariant;
import com.shopifake.mainapi.model.VariantAttribute;
import com.shopifake.mainapi.repository.AttributeDefinitionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class ProductVariantMapper {

    private final AttributeDefinitionRepository attributeDefinitionRepository;

    public ProductVariantDto toDto(ProductVariant variant) {
        Map<String, String> attributes = new HashMap<>();

        if (variant.getAttributes() != null) {
            for (VariantAttribute va : variant.getAttributes()) {
                AttributeDefinition def = attributeDefinitionRepository
                        .findById(va.getAttributeDefinitionId())
                        .orElse(null);
                if (def != null) {
                    attributes.put(def.getAttributeName(), va.getAttributeValue());
                }
            }
        }

        return new ProductVariantDto(
                variant.getId(),
                variant.getProductId(),
                variant.getSku(),
                variant.getPrice(),
                variant.getStock(),
                variant.getIsActive(),
                variant.getCreatedAt(),
                variant.getUpdatedAt(),
                attributes
        );
    }
}

