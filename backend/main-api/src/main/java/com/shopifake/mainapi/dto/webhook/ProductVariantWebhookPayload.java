package com.shopifake.mainapi.dto.webhook;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantWebhookPayload {

    private String event; // "variant.created", "variant.updated", "variant.deleted"
    private String timestamp;
    private WebhookProductVariantDto data;

    public static ProductVariantWebhookPayload created(WebhookProductVariantDto data) {
        return ProductVariantWebhookPayload.builder()
                .event("variant.created")
                .timestamp(Instant.now().toString())
                .data(data)
                .build();
    }

    public static ProductVariantWebhookPayload updated(WebhookProductVariantDto data) {
        return ProductVariantWebhookPayload.builder()
                .event("variant.updated")
                .timestamp(Instant.now().toString())
                .data(data)
                .build();
    }

    public static ProductVariantWebhookPayload deleted(WebhookProductVariantDto data) {
        return ProductVariantWebhookPayload.builder()
                .event("variant.deleted")
                .timestamp(Instant.now().toString())
                .data(data)
                .build();
    }
}
