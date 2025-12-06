package com.shopifake.mainapi.controller;

import com.shopifake.mainapi.dto.AttributeDefinitionDto;
import com.shopifake.mainapi.dto.CreateProductRequest;
import com.shopifake.mainapi.dto.ProductDto;
import com.shopifake.mainapi.dto.ProductWithVariantsDto;
import com.shopifake.mainapi.dto.UpdateProductRequest;
import com.shopifake.mainapi.service.ProductService;
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
@RequestMapping("/api/shops/{shopId}/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "API de gestion des produits")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(
            summary = "Récupère tous les produits d'une boutique",
            description = "Récupère tous les produits de toutes les catégories d'une boutique"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Liste des produits récupérée avec succès"),
            @ApiResponse(responseCode = "404", description = "Boutique non trouvée")
    })
    public ResponseEntity<List<ProductDto>> getProductsByShop(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId
    ) {
        return ResponseEntity.ok(productService.getProductsByShop(shopId));
    }

    @GetMapping("/with-variants")
    @Operation(
            summary = "Récupère tous les produits avec variants d'une boutique",
            description = "Récupère tous les produits avec leurs variants de toutes les catégories d'une boutique"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Liste des produits avec variants récupérée avec succès"),
            @ApiResponse(responseCode = "404", description = "Boutique non trouvée")
    })
    public ResponseEntity<List<ProductWithVariantsDto>> getAllProductsWithVariants(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId
    ) {
        return ResponseEntity.ok(productService.getAllProductsWithVariants(shopId));
    }

    @GetMapping("/by-category/{categoryId}")
    @Operation(
            summary = "Récupère les produits d'une catégorie",
            description = "Récupère tous les produits d'une catégorie spécifique"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Liste des produits récupérée avec succès"),
            @ApiResponse(responseCode = "404", description = "Catégorie ou boutique non trouvée")
    })
    public ResponseEntity<List<ProductDto>> getProductsByCategory(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId,
            @Parameter(description = "ID de la catégorie") @PathVariable Long categoryId
    ) {
        return ResponseEntity.ok(productService.getProductsByCategory(shopId, categoryId));
    }

    @GetMapping("/by-category/{categoryId}/with-variants")
    @Operation(
            summary = "Récupère les produits avec variants d'une catégorie et ses sous-catégories",
            description = "Récupère tous les produits avec leurs variants d'une catégorie et toutes ses sous-catégories de manière récursive"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Liste des produits avec variants récupérée avec succès"),
            @ApiResponse(responseCode = "404", description = "Catégorie ou boutique non trouvée")
    })
    public ResponseEntity<List<ProductWithVariantsDto>> getProductsWithVariantsByCategory(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId,
            @Parameter(description = "ID de la catégorie") @PathVariable Long categoryId
    ) {
        return ResponseEntity.ok(productService.getProductsWithVariantsByCategory(shopId, categoryId));
    }

    @GetMapping("/{productId}")
    @Operation(
            summary = "Récupère un produit",
            description = "Récupère les détails d'un produit spécifique"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Produit récupéré avec succès"),
            @ApiResponse(responseCode = "404", description = "Produit ou boutique non trouvée")
    })
    public ResponseEntity<ProductDto> getProductById(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId,
            @Parameter(description = "ID du produit") @PathVariable Long productId
    ) {
        return ResponseEntity.ok(productService.getProductById(shopId, productId));
    }

    @GetMapping("/{productId}/attribute-definitions")
    @Operation(
            summary = "Récupère les définitions d'attributs d'un produit",
            description = "Récupère la liste des définitions d'attributs (ex: Couleur, Taille) d'un produit"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Définitions d'attributs récupérées avec succès"),
            @ApiResponse(responseCode = "404", description = "Produit ou boutique non trouvée")
    })
    public ResponseEntity<List<AttributeDefinitionDto>> getAttributeDefinitions(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId,
            @Parameter(description = "ID du produit") @PathVariable Long productId
    ) {
        return ResponseEntity.ok(productService.getAttributeDefinitions(shopId, productId));
    }

    @PostMapping
    @Operation(
            summary = "Crée un nouveau produit",
            description = "Crée un nouveau produit dans une catégorie avec ses définitions d'attributs"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Produit créé avec succès"),
            @ApiResponse(responseCode = "400", description = "Requête invalide"),
            @ApiResponse(responseCode = "404", description = "Catégorie ou boutique non trouvée")
    })
    public ResponseEntity<ProductDto> createProduct(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId,
            @Valid @RequestBody CreateProductRequest request
    ) {
        ProductDto created = productService.createProduct(shopId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{productId}")
    @Operation(
            summary = "Met à jour un produit",
            description = "Met à jour les informations d'un produit (nom, description, statut). Les définitions d'attributs ne peuvent pas être modifiées."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Produit mis à jour avec succès"),
            @ApiResponse(responseCode = "400", description = "Requête invalide"),
            @ApiResponse(responseCode = "404", description = "Produit ou boutique non trouvée")
    })
    public ResponseEntity<ProductDto> updateProduct(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId,
            @Parameter(description = "ID du produit") @PathVariable Long productId,
            @Valid @RequestBody UpdateProductRequest request
    ) {
        return ResponseEntity.ok(productService.updateProduct(shopId, productId, request));
    }

    @DeleteMapping("/{productId}")
    @Operation(
            summary = "Supprime un produit",
            description = "Supprime un produit et tous ses variants (cascade)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Produit supprimé avec succès"),
            @ApiResponse(responseCode = "404", description = "Produit ou boutique non trouvée")
    })
    public ResponseEntity<Void> deleteProduct(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId,
            @Parameter(description = "ID du produit") @PathVariable Long productId
    ) {
        productService.deleteProduct(shopId, productId);
        return ResponseEntity.noContent().build();
    }
}

