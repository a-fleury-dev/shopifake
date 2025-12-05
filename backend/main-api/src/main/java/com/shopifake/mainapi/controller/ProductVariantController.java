package com.shopifake.mainapi.controller;

import com.shopifake.mainapi.dto.CreateProductVariantRequest;
import com.shopifake.mainapi.dto.ProductVariantDto;
import com.shopifake.mainapi.dto.UpdateProductVariantRequest;
import com.shopifake.mainapi.service.ProductVariantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shops/{shopId}/variants")
@RequiredArgsConstructor
@Tag(name = "Product Variants", description = "API de gestion des variants de produits")
public class ProductVariantController {

    private final ProductVariantService productVariantService;

    @GetMapping("/by-product/{productId}")
    @Operation(
            summary = "Récupère les variants d'un produit",
            description = "Récupère tous les variants d'un produit spécifique"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Liste des variants récupérée avec succès"),
            @ApiResponse(responseCode = "404", description = "Produit ou boutique non trouvée")
    })
    public ResponseEntity<List<ProductVariantDto>> getVariantsByProduct(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId,
            @Parameter(description = "ID du produit") @PathVariable Long productId
    ) {
        return ResponseEntity.ok(productVariantService.getVariantsByProduct(shopId, productId));
    }

    @GetMapping("/{variantId}")
    @Operation(
            summary = "Récupère un variant",
            description = "Récupère les détails d'un variant spécifique"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Variant récupéré avec succès"),
            @ApiResponse(responseCode = "404", description = "Variant ou boutique non trouvée")
    })
    public ResponseEntity<ProductVariantDto> getVariantById(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId,
            @Parameter(description = "ID du variant") @PathVariable Long variantId
    ) {
        return ResponseEntity.ok(productVariantService.getVariantById(shopId, variantId));
    }

    @PostMapping
    @Operation(
            summary = "Crée un nouveau variant",
            description = "Crée un nouveau variant pour un produit avec ses attributs (ex: Couleur=Rouge, Taille=L)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Variant créé avec succès"),
            @ApiResponse(responseCode = "400", description = "Requête invalide (SKU dupliqué ou combinaison d'attributs existante)"),
            @ApiResponse(responseCode = "404", description = "Produit ou boutique non trouvée")
    })
    public ResponseEntity<ProductVariantDto> createVariant(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId,
            @Valid @RequestBody CreateProductVariantRequest request
    ) {
        ProductVariantDto created = productVariantService.createVariant(shopId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{variantId}")
    @Operation(
            summary = "Met à jour un variant",
            description = "Met à jour les informations d'un variant (SKU, prix, stock, statut). Les attributs ne peuvent pas être modifiés."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Variant mis à jour avec succès"),
            @ApiResponse(responseCode = "400", description = "Requête invalide (SKU dupliqué)"),
            @ApiResponse(responseCode = "404", description = "Variant ou boutique non trouvée")
    })
    public ResponseEntity<ProductVariantDto> updateVariant(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId,
            @Parameter(description = "ID du variant") @PathVariable Long variantId,
            @Valid @RequestBody UpdateProductVariantRequest request
    ) {
        return ResponseEntity.ok(productVariantService.updateVariant(shopId, variantId, request));
    }

    @DeleteMapping("/{variantId}")
    @Operation(
            summary = "Supprime un variant",
            description = "Supprime un variant de produit"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Variant supprimé avec succès"),
            @ApiResponse(responseCode = "404", description = "Variant ou boutique non trouvée")
    })
    public ResponseEntity<Void> deleteVariant(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId,
            @Parameter(description = "ID du variant") @PathVariable Long variantId
    ) {
        productVariantService.deleteVariant(shopId, variantId);
        return ResponseEntity.noContent().build();
    }
}

