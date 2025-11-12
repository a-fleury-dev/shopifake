package com.shopifake.gateway.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtTimestampValidator;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;



@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Value("${app.cors.allowed-origins}")
    private String[] allowedOrigins;

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeExchange(exchange -> exchange
                .pathMatchers("/api/v1/auth/**").permitAll()  // Auth libre
                .anyExchange().authenticated()                // Tout le reste -> token obligatoire
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                    .jwt()
                );

        return http.build();
    }

    @Bean
    public WebFilter addUserIdHeaderFilter() {
        return (exchange, chain) -> exchange.getPrincipal()
            .flatMap(principal -> {
                if (principal instanceof JwtAuthenticationToken jwtAuth) {
                    String userId = jwtAuth.getToken().getClaimAsString("sub");
                    ServerWebExchange mutated = exchange.mutate()
                        .request(builder -> builder.header("X-User-Id", userId))
                        .build();
                    return chain.filter(mutated);
                }
                return chain.filter(exchange);
            });
    }

    @Bean
    public NimbusReactiveJwtDecoder jwtDecoder(
            @org.springframework.beans.factory.annotation.Value("${KEYCLOAK_JWK_SET_URI:http://localhost:8090/realms/shopifake/protocol/openid-connect/certs}") String jwkSetUri,
            @org.springframework.beans.factory.annotation.Value("${KEYCLOAK_ISSUER_URI:http://localhost:8090/realms/shopifake}") String expectedIssuer
    ) {
        if (jwkSetUri != null && jwkSetUri.contains("localhost")) {
            jwkSetUri = "http://keycloak:8080/realms/shopifake/protocol/openid-connect/certs";
        }

        NimbusReactiveJwtDecoder decoder = NimbusReactiveJwtDecoder.withJwkSetUri(jwkSetUri).build();

        OAuth2TokenValidator<Jwt> issuerValidator = JwtValidators.createDefaultWithIssuer(expectedIssuer);
        OAuth2TokenValidator<Jwt> timestampValidator = new JwtTimestampValidator();
        OAuth2TokenValidator<Jwt> delegating = new DelegatingOAuth2TokenValidator<>(issuerValidator, timestampValidator);
        decoder.setJwtValidator(delegating);

        return decoder;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(allowedOrigins));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.addExposedHeader(HttpHeaders.AUTHORIZATION);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
