package com.shopifake.mainapi.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO pour créer une nouvelle boutique")
public class CreateShopRequest {

    @NotNull(message = "L'ID de l'administrateur est obligatoire")
    @Schema(description = "ID de l'administrateur de la boutique", example = "1")
    private Long adminId;

    @NotBlank(message = "Le nom de domaine est obligatoire")
    @Size(max = 255, message = "Le nom de domaine ne peut pas dépasser 255 caractères")
    @Schema(description = "Nom de domaine unique de la boutique", example = "sport-elite.shopifake.com")
    private String domainName;

    @NotBlank(message = "Le nom de la boutique est obligatoire")
    @Size(max = 255, message = "Le nom ne peut pas dépasser 255 caractères")
    @Schema(description = "Nom de la boutique", example = "Sport Elite")
    private String name;

    @Schema(description = "Description de la boutique", example = "Votre boutique de vêtements de sport et d'équipements sportifs")
    private String description;

    @Size(max = 500, message = "L'URL de la bannière ne peut pas dépasser 500 caractères")
    @Schema(description = "URL de l'image de bannière", example = "https://images.unsplash.com/photo-1461896836934-ffe607ba8211")
    private String bannerUrl;
}

