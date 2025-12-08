package com.shopifake.mainapi.controller;

import com.shopifake.mainapi.dto.CreateShopRequest;
import com.shopifake.mainapi.dto.ShopResponse;
import com.shopifake.mainapi.dto.UpdateShopRequest;
import com.shopifake.mainapi.service.ShopService;
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
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/shops")
@RequiredArgsConstructor
@Tag(name = "Shops", description = "API de gestion des boutiques")
public class ShopController {

    private final ShopService shopService;

    @PostMapping
    @Operation(
            summary = "Créer une nouvelle boutique",
            description = "Crée une nouvelle boutique avec les informations fournies"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Boutique créée avec succès"),
            @ApiResponse(responseCode = "400", description = "Requête invalide"),
            @ApiResponse(responseCode = "409", description = "Nom de domaine déjà existant")
    })
    public ResponseEntity<ShopResponse> createShop(
            @Valid @RequestBody CreateShopRequest request) {
        ShopResponse response = shopService.createShop(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir une boutique par son ID",
            description = "Récupère les détails d'une boutique spécifique"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Boutique trouvée"),
            @ApiResponse(responseCode = "404", description = "Boutique non trouvée")
    })
    public ResponseEntity<ShopResponse> getShopById(
            @Parameter(description = "ID de la boutique", required = true)
            @PathVariable Long id) {
        ShopResponse response = shopService.getShopById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/domain/{domainName}")
    @Operation(
            summary = "Obtenir une boutique par son nom de domaine",
            description = "Récupère les détails d'une boutique spécifique à partir de son nom de domaine"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Boutique trouvée"),
            @ApiResponse(responseCode = "404", description = "Boutique non trouvée")
    })
    public ResponseEntity<ShopResponse> getShopByDomainName(
            @Parameter(description = "Nom de domaine de la boutique", required = true, example = "sport-elite")
            @PathVariable String domainName) {
        ShopResponse response = shopService.getShopByDomainName(domainName);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(
            summary = "Obtenir toutes les boutiques",
            description = "Récupère la liste de toutes les boutiques"
    )
    @ApiResponse(responseCode = "200", description = "Liste des boutiques récupérée")
    public ResponseEntity<List<ShopResponse>> getAllShops() {
        List<ShopResponse> shops = shopService.getAllShops();
        return ResponseEntity.ok(shops);
    }

    @GetMapping("/admin/{adminId}")
    @Operation(
            summary = "Obtenir les boutiques d'un administrateur",
            description = "Récupère toutes les boutiques gérées par un administrateur spécifique"
    )
    @ApiResponse(responseCode = "200", description = "Liste des boutiques de l'admin récupérée")
    public ResponseEntity<List<ShopResponse>> getShopsByAdminId(
            @Parameter(description = "ID de l'administrateur", required = true)
            @PathVariable UUID adminId) {
        List<ShopResponse> shops = shopService.getShopsByAdminId(adminId);
        return ResponseEntity.ok(shops);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour une boutique",
            description = "Met à jour les informations d'une boutique existante"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Boutique mise à jour avec succès"),
            @ApiResponse(responseCode = "400", description = "Requête invalide"),
            @ApiResponse(responseCode = "404", description = "Boutique non trouvée")
    })
    public ResponseEntity<ShopResponse> updateShop(
            @Parameter(description = "ID de la boutique", required = true)
            @PathVariable Long id,
            @Valid @RequestBody UpdateShopRequest request) {
        ShopResponse response = shopService.updateShop(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer une boutique",
            description = "Supprime une boutique existante"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Boutique supprimée avec succès"),
            @ApiResponse(responseCode = "404", description = "Boutique non trouvée")
    })
    public ResponseEntity<Void> deleteShop(
            @Parameter(description = "ID de la boutique", required = true)
            @PathVariable Long id) {
        shopService.deleteShop(id);
        return ResponseEntity.noContent().build();
    }
}

