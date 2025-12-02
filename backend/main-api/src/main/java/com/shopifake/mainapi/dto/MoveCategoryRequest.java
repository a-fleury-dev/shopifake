package com.shopifake.mainapi.dto;

public record MoveCategoryRequest(
        Long parentId,
        Integer position
) {}

