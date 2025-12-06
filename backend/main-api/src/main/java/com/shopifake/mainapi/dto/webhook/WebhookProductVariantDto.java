package com.shopifake.mainapi.dto.webhook;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
public class WebhookProductVariantDto {

    private Long id;

    @JsonProperty("product_id")
    private Long productId;

    @JsonProperty("shop_id")
    private Long shopId;

    private String sku;
    private BigDecimal price;
    private Integer stock;

    @JsonProperty("is_active")
    private Boolean isActive;

    // Product fields
    @JsonProperty("product_name")
    private String productName;

    @JsonProperty("product_slug")
    private String productSlug;

    @JsonProperty("product_description")
    private String productDescription;

    @JsonProperty("category_id")
    private Long categoryId;

    // Variant attributes as map
    private Map<String, String> attributes;
}
