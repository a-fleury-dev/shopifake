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

    private boolean enabled;
    private ChatbotConfig chatbot = new ChatbotConfig();

    @Getter
    @Setter
    public static class ChatbotConfig {
        private String url;
        private int timeout;
        private boolean failSilently;
    }
}
