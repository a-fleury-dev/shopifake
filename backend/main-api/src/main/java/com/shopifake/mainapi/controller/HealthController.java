package com.shopifake.mainapi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Health", description = "API de vérification de l'état du service")
public class HealthController {

    @GetMapping("/health")
    @Operation(
            summary = "Vérifier l'état du service",
            description = "Endpoint pour vérifier que le service est opérationnel"
    )
    @ApiResponse(responseCode = "200", description = "Service opérationnel")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "main-api");
        response.put("timestamp", LocalDateTime.now());
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ping")
    @Operation(
            summary = "Ping le service",
            description = "Endpoint simple pour vérifier la connectivité"
    )
    @ApiResponse(responseCode = "200", description = "Pong")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }
}

