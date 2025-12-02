package com.shopifake.mainapi.controller;

import com.shopifake.mainapi.dto.*;
import com.shopifake.mainapi.service.CategoryService;
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
@RequestMapping("/api/shops/{shopId}/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "API de gestion des catégories de produits")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(
            summary = "Récupère les catégories racines",
            description = "Récupère toutes les catégories racines (sans parent) d'une boutique, triées par position"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Liste des catégories racines récupérée avec succès"),
            @ApiResponse(responseCode = "404", description = "Boutique non trouvée")
    })
    public ResponseEntity<List<CategoryDto>> getRootCategories(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId
    ) {
        return ResponseEntity.ok(categoryService.getRootCategories(shopId));
    }

    @GetMapping("/all")
    @Operation(
            summary = "Récupère toutes les catégories",
            description = "Récupère toutes les catégories d'une boutique (à plat), triées par position"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Liste des catégories récupérée avec succès"),
            @ApiResponse(responseCode = "404", description = "Boutique non trouvée")
    })
    public ResponseEntity<List<CategoryDto>> getAllCategories(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId
    ) {
        return ResponseEntity.ok(categoryService.getAllCategories(shopId));
    }

    @GetMapping("/tree")
    @Operation(
            summary = "Récupère l'arbre des catégories",
            description = "Récupère l'arbre hiérarchique complet des catégories d'une boutique"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Arbre des catégories récupéré avec succès"),
            @ApiResponse(responseCode = "404", description = "Boutique non trouvée")
    })
    public ResponseEntity<CategoryTreeDto> getCategoryTree(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId
    ) {
        return ResponseEntity.ok(categoryService.getCategoryTree(shopId));
    }

    @GetMapping("/{categoryId}")
    @Operation(
            summary = "Récupère une catégorie",
            description = "Récupère les détails d'une catégorie spécifique"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Catégorie récupérée avec succès"),
            @ApiResponse(responseCode = "404", description = "Catégorie ou boutique non trouvée")
    })
    public ResponseEntity<CategoryDto> getCategoryById(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId,
            @Parameter(description = "ID de la catégorie") @PathVariable Long categoryId
    ) {
        return ResponseEntity.ok(categoryService.getCategoryById(shopId, categoryId));
    }

    @GetMapping("/{categoryId}/children")
    @Operation(
            summary = "Récupère les enfants d'une catégorie",
            description = "Récupère les sous-catégories directes d'une catégorie, triées par position"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Enfants récupérés avec succès"),
            @ApiResponse(responseCode = "404", description = "Catégorie ou boutique non trouvée")
    })
    public ResponseEntity<List<CategoryDto>> getChildren(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId,
            @Parameter(description = "ID de la catégorie parente") @PathVariable Long categoryId
    ) {
        return ResponseEntity.ok(categoryService.getChildren(shopId, categoryId));
    }

    @GetMapping("/{categoryId}/breadcrumb")
    @Operation(
            summary = "Récupère le fil d'Ariane",
            description = "Récupère le chemin de navigation (breadcrumb) d'une catégorie jusqu'à la racine"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Fil d'Ariane récupéré avec succès"),
            @ApiResponse(responseCode = "404", description = "Catégorie ou boutique non trouvée")
    })
    public ResponseEntity<List<CategoryDto>> getBreadcrumb(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId,
            @Parameter(description = "ID de la catégorie") @PathVariable Long categoryId
    ) {
        return ResponseEntity.ok(categoryService.getBreadcrumb(shopId, categoryId));
    }

    @PostMapping
    @Operation(
            summary = "Crée une catégorie",
            description = "Crée une nouvelle catégorie pour une boutique. Le slug est généré automatiquement à partir du label."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Catégorie créée avec succès"),
            @ApiResponse(responseCode = "400", description = "Requête invalide"),
            @ApiResponse(responseCode = "404", description = "Boutique ou catégorie parente non trouvée")
    })
    public ResponseEntity<CategoryDto> create(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId,
            @Valid @RequestBody CreateCategoryRequest request
    ) {
        CategoryDto created = categoryService.create(shopId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{categoryId}")
    @Operation(
            summary = "Met à jour une catégorie",
            description = "Met à jour les informations d'une catégorie existante"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Catégorie mise à jour avec succès"),
            @ApiResponse(responseCode = "400", description = "Requête invalide"),
            @ApiResponse(responseCode = "404", description = "Catégorie ou boutique non trouvée")
    })
    public ResponseEntity<CategoryDto> update(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId,
            @Parameter(description = "ID de la catégorie") @PathVariable Long categoryId,
            @Valid @RequestBody UpdateCategoryRequest request
    ) {
        CategoryDto updated = categoryService.update(shopId, categoryId, request);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{categoryId}/move")
    @Operation(
            summary = "Déplace une catégorie",
            description = "Déplace une catégorie vers un nouveau parent dans l'arbre hiérarchique"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Catégorie déplacée avec succès"),
            @ApiResponse(responseCode = "400", description = "Requête invalide (ex: déplacement vers un descendant)"),
            @ApiResponse(responseCode = "404", description = "Catégorie ou boutique non trouvée")
    })
    public ResponseEntity<CategoryDto> move(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId,
            @Parameter(description = "ID de la catégorie") @PathVariable Long categoryId,
            @Valid @RequestBody MoveCategoryRequest request
    ) {
        CategoryDto moved = categoryService.move(shopId, categoryId, request);
        return ResponseEntity.ok(moved);
    }

    @DeleteMapping("/{categoryId}")
    @Operation(
            summary = "Supprime une catégorie",
            description = "Supprime une catégorie. La catégorie ne doit pas avoir de sous-catégories ni de produits associés."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Catégorie supprimée avec succès"),
            @ApiResponse(responseCode = "400", description = "Impossible de supprimer (sous-catégories ou produits existants)"),
            @ApiResponse(responseCode = "404", description = "Catégorie ou boutique non trouvée")
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID de la boutique") @PathVariable Long shopId,
            @Parameter(description = "ID de la catégorie") @PathVariable Long categoryId
    ) {
        categoryService.delete(shopId, categoryId);
        return ResponseEntity.noContent().build();
    }
}

