package com.shopifake.imageservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI imageServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Shopifake Image Service API")
                        .description("Image management service for Shopifake - MinIO & PostgreSQL backend")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Shopifake Team")
                                .email("support@shopifake.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("http://www.apache.org/licenses/LICENSE-2.0.html")));
    }
}