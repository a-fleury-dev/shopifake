package com.shopifake.mainapi.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO de réponse contenant les informations d'une boutique")
public class ShopResponse {

    @Schema(description = "ID de la boutique", example = "1")
    private Long id;

    @Schema(description = "ID de l'administrateur", example = "1")
    private UUID adminId;

    @Schema(description = "Nom de domaine", example = "sport-elite.shopifake.com")
    private String domainName;

    @Schema(description = "Nom de la boutique", example = "Sport Elite")
    private String name;

    @Schema(description = "Description", example = "Votre boutique de vêtements de sport")
    private String description;

    @Schema(description = "URL de la bannière", example = "https://images.unsplash.com/photo-1461896836934-ffe607ba8211")
    private String bannerUrl;

    @Schema(description = "Date de création", example = "2024-11-30T12:00:00")
    private LocalDateTime createdAt;

    @Schema(description = "Date de dernière mise à jour", example = "2024-11-30T12:00:00")
    private LocalDateTime updatedAt;
}

