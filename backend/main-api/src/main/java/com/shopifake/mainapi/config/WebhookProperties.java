package com.shopifake.mainapi.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "webhook")
@Getter
@Setter
public class WebhookProperties {

    private boolean enabled = true;
    private ChatbotConfig chatbot = new ChatbotConfig();

    @Getter
    @Setter
    public static class ChatbotConfig {
        private String url = "http://localhost:8000";
        private int timeout = 5000; // 5 seconds timeout
        private boolean failSilently = true; // Don't throw exceptions on webhook failure
    }
}
