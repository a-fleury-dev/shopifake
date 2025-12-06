package com.shopifake.mainapi.service;

import com.shopifake.mainapi.dto.CreateShopRequest;
import com.shopifake.mainapi.dto.ShopResponse;
import com.shopifake.mainapi.dto.UpdateShopRequest;
import com.shopifake.mainapi.exception.BadRequestException;
import com.shopifake.mainapi.exception.ResourceNotFoundException;
import com.shopifake.mainapi.mapper.ShopMapper;
import com.shopifake.mainapi.model.Shop;
import com.shopifake.mainapi.repository.ShopRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShopService {

    private final ShopRepository shopRepository;
    private final ShopMapper shopMapper;

    /**
     * Créer une nouvelle boutique
     */
    @Transactional
    public ShopResponse createShop(CreateShopRequest request) {
        log.info("Création d'une nouvelle boutique: {}", request.getName());

        // Vérifier si le nom de domaine existe déjà
        if (shopRepository.existsByDomainName(request.getDomainName())) {
            throw new BadRequestException("Une boutique avec ce nom de domaine existe déjà: " + request.getDomainName());
        }

        Shop shop = shopMapper.toEntity(request);
        Shop savedShop = shopRepository.save(shop);

        log.info("Boutique créée avec succès, ID: {}", savedShop.getId());
        return shopMapper.toResponse(savedShop);
    }

    /**
     * Obtenir une boutique par son ID
     */
    @Transactional(readOnly = true)
    public ShopResponse getShopById(Long id) {
        log.info("Récupération de la boutique avec l'ID: {}", id);

        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Boutique", "id", id));

        return shopMapper.toResponse(shop);
    }

    /**
     * Obtenir une boutique par son nom de domaine
     */
    @Transactional(readOnly = true)
    public ShopResponse getShopByDomainName(String domainName) {
        log.info("Récupération de la boutique avec le nom de domaine: {}", domainName);

        Shop shop = shopRepository.findByDomainName(domainName)
                .orElseThrow(() -> new ResourceNotFoundException("Boutique", "domain_name", domainName));

        return shopMapper.toResponse(shop);
    }

    /**
     * Obtenir toutes les boutiques
     */
    @Transactional(readOnly = true)
    public List<ShopResponse> getAllShops() {
        log.info("Récupération de toutes les boutiques");

        return shopRepository.findAll().stream()
                .map(shopMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtenir toutes les boutiques d'un administrateur
     */
    @Transactional(readOnly = true)
    public List<ShopResponse> getShopsByAdminId(Long adminId) {
        log.info("Récupération des boutiques de l'admin: {}", adminId);

        return shopRepository.findByAdminId(adminId).stream()
                .map(shopMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Mettre à jour une boutique
     */
    @Transactional
    public ShopResponse updateShop(Long id, UpdateShopRequest request) {
        log.info("Mise à jour de la boutique ID: {}", id);

        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Boutique", "id", id));

        // Vérifier si le nouveau nom de domaine existe déjà (pour une autre boutique)
        if (request.getDomainName() != null && !request.getDomainName().equals(shop.getDomainName())) {
            if (shopRepository.existsByDomainNameAndIdNot(request.getDomainName(), id)) {
                throw new BadRequestException("Une autre boutique avec ce nom de domaine existe déjà: " + request.getDomainName());
            }
            shop.setDomainName(request.getDomainName());
        }

        // Mettre à jour les champs non nuls
        if (request.getName() != null) {
            shop.setName(request.getName());
        }
        if (request.getDescription() != null) {
            shop.setDescription(request.getDescription());
        }
        if (request.getBannerUrl() != null) {
            shop.setBannerUrl(request.getBannerUrl());
        }

        Shop updatedShop = shopRepository.save(shop);
        log.info("Boutique mise à jour avec succès, ID: {}", updatedShop.getId());

        return shopMapper.toResponse(updatedShop);
    }

    /**
     * Supprimer une boutique
     */
    @Transactional
    public void deleteShop(Long id) {
        log.info("Suppression de la boutique ID: {}", id);

        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Boutique", "id", id));

        shopRepository.delete(shop);
        log.info("Boutique supprimée avec succès, ID: {}", id);
    }
}

