package com.shopifake.mainapi.mapper;

import com.shopifake.mainapi.dto.AttributeDefinitionDto;
import com.shopifake.mainapi.dto.ProductDto;
import com.shopifake.mainapi.model.AttributeDefinition;
import com.shopifake.mainapi.model.Product;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductMapper {

    public ProductDto toDto(Product product) {
        List<AttributeDefinitionDto> attributeDefs = product.getAttributeDefinitions() != null
                ? product.getAttributeDefinitions().stream()
                    .map(this::toAttributeDefinitionDto)
                    .toList()
                : List.of();

        return new ProductDto(
                product.getId(),
                product.getCategoryId(),
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getIsActive(),
                product.getCreatedAt(),
                product.getUpdatedAt(),
                attributeDefs
        );
    }

    public AttributeDefinitionDto toAttributeDefinitionDto(AttributeDefinition attributeDefinition) {
        return new AttributeDefinitionDto(
                attributeDefinition.getId(),
                attributeDefinition.getAttributeName(),
                attributeDefinition.getPosition()
        );
    }

    public AttributeDefinition toAttributeDefinition(AttributeDefinitionDto dto, Long productId) {
        AttributeDefinition attributeDefinition = new AttributeDefinition();
        attributeDefinition.setProductId(productId);
        attributeDefinition.setAttributeName(dto.attributeName());
        attributeDefinition.setPosition(dto.position() != null ? dto.position() : 0);
        return attributeDefinition;
    }
}

