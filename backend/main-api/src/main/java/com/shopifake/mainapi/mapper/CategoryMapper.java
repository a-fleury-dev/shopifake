package com.shopifake.mainapi.mapper;

import com.shopifake.mainapi.dto.CategoryDto;
import com.shopifake.mainapi.dto.CategoryTreeNodeDto;
import com.shopifake.mainapi.model.Category;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CategoryMapper {

    public CategoryDto toDto(Category category) {
        if (category == null) {
            return null;
        }

        return new CategoryDto(
                category.getId(),
                category.getShopId(),
                category.getParentId(),
                category.getLabel(),
                category.getSlug(),
                category.getPosition()
        );
    }

    public List<CategoryDto> toDtoList(List<Category> categories) {
        return categories.stream()
                .map(this::toDto)
                .toList();
    }

    public CategoryTreeNodeDto toTreeNodeDto(Category category, List<CategoryTreeNodeDto> children) {
        if (category == null) {
            return null;
        }

        return new CategoryTreeNodeDto(
                category.getId(),
                category.getLabel(),
                category.getSlug(),
                category.getPosition(),
                children
        );
    }
}

