package com.shopifake.mainapi.mapper;

import com.shopifake.mainapi.dto.CreateShopRequest;
import com.shopifake.mainapi.dto.ShopResponse;
import com.shopifake.mainapi.model.Shop;
import org.springframework.stereotype.Component;

@Component
public class ShopMapper {

    public ShopResponse toResponse(Shop shop) {
        if (shop == null) {
            return null;
        }

        ShopResponse response = new ShopResponse();
        response.setId(shop.getId());
        response.setAdminId(shop.getAdminId());
        response.setDomainName(shop.getDomainName());
        response.setName(shop.getName());
        response.setDescription(shop.getDescription());
        response.setBannerUrl(shop.getBannerUrl());
        response.setCreatedAt(shop.getCreatedAt());
        response.setUpdatedAt(shop.getUpdatedAt());

        return response;
    }

    public Shop toEntity(CreateShopRequest request) {
        if (request == null) {
            return null;
        }

        Shop shop = new Shop();
        shop.setAdminId(request.getAdminId());
        shop.setDomainName(request.getDomainName());
        shop.setName(request.getName());
        shop.setDescription(request.getDescription());
        shop.setBannerUrl(request.getBannerUrl());

        return shop;
    }
}

