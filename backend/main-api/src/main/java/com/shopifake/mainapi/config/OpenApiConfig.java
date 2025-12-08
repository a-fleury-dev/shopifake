package com.shopifake.mainapi.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI mainApiOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:5001");
        devServer.setDescription("Serveur de développement");

        Contact contact = new Contact();
        contact.setName("Shopifake Team");
        contact.setEmail("contact@shopifake.com");

        License license = new License()
                .name("MIT License")
                .url("https://choosealicense.com/licenses/mit/");

        Info info = new Info()
                .title("Shopifake Main API")
                .version("1.0.0")
                .contact(contact)
                .description("API principale pour la gestion de la boutique en ligne Shopifake")
                .license(license);

        return new OpenAPI()
                .info(info)
                .servers(List.of(devServer));
    }
}

