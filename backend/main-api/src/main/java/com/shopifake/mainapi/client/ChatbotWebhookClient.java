package com.shopifake.mainapi.client;

import com.shopifake.mainapi.config.WebhookProperties;
import com.shopifake.mainapi.dto.webhook.ProductVariantWebhookPayload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Component
@RequiredArgsConstructor
@Slf4j
public class ChatbotWebhookClient {

    private final WebhookProperties webhookProperties;
    private final WebClient.Builder webClientBuilder;

    /**
     * Send product variant webhook to chatbot service
     * Non-blocking call that fails silently if configured
     */
    public void sendProductVariantWebhook(ProductVariantWebhookPayload payload) {
        if (!webhookProperties.isEnabled()) {
            log.debug("Webhooks disabled, skipping chatbot notification");
            return;
        }

        String url = webhookProperties.getChatbot().getUrl() + "/webhook/product-variant";
        int timeout = webhookProperties.getChatbot().getTimeout();

        webClientBuilder.build()
                .post()
                .uri(url)
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(Void.class)
                .timeout(Duration.ofMillis(timeout))
                .onErrorResume(error -> {
                    if (webhookProperties.getChatbot().isFailSilently()) {
                        log.error("Failed to send webhook to chatbot service: {}", error.getMessage());
                        return Mono.empty();
                    }
                    return Mono.error(error);
                })
                .subscribe(
                        result -> log.debug("Successfully sent {} webhook to chatbot service", payload.getEvent()),
                        error -> log.error("Webhook error: {}", error.getMessage())
                );
    }
}
