package com.shopifake.mainapi.service;

import com.shopifake.mainapi.config.WebhookProperties;
import com.shopifake.mainapi.model.ProductVariant;
import com.shopifake.mainapi.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service responsible for seeding the chatbot service with existing product variants
 * when the application starts. This ensures the chatbot's vector database is populated
 * with all existing product data.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChatbotSeedingService {

    private final ProductVariantRepository productVariantRepository;
    private final ChatbotWebhookService chatbotWebhookService;
    private final WebhookProperties webhookProperties;

    /**
     * Seeds the chatbot service with all existing product variants.
     * This method is triggered when the application is fully started.
     * It sends a webhook for each existing variant to populate the chatbot's vector database.
     */
    @EventListener(ApplicationReadyEvent.class)
    public void seedChatbotOnStartup() {
        if (!webhookProperties.isEnabled()) {
            log.info("Webhook configuration is disabled. Skipping chatbot seeding.");
            return;
        }

        log.info("Starting chatbot seeding process...");
        
        try {
            List<ProductVariant> allVariants = productVariantRepository.findAll();
            log.info("Found {} product variants to seed", allVariants.size());

            int successCount = 0;
            int errorCount = 0;

            for (ProductVariant variant : allVariants) {
                try {
                    chatbotWebhookService.notifyVariantCreated(variant);
                    successCount++;
                    
                    if (successCount % 10 == 0) {
                        log.info("Seeded {} variants so far...", successCount);
                    }
                } catch (Exception e) {
                    errorCount++;
                    log.error("Failed to seed variant {}: {}", variant.getId(), e.getMessage());
                }
            }

            log.info("Chatbot seeding completed. Success: {}, Errors: {}", successCount, errorCount);
        } catch (Exception e) {
            log.error("Critical error during chatbot seeding: {}", e.getMessage(), e);
        }
    }
}
