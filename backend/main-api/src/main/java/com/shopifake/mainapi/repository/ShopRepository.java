package com.shopifake.mainapi.repository;

import com.shopifake.mainapi.model.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {

    /**
     * Trouver toutes les boutiques d'un administrateur
     */
    List<Shop> findByAdminId(Long adminId);

    /**
     * Trouver une boutique par son nom de domaine
     */
    Optional<Shop> findByDomainName(String domainName);

    /**
     * Vérifier si un nom de domaine existe déjà
     */
    boolean existsByDomainName(String domainName);

    /**
     * Vérifier si un nom de domaine existe pour une boutique différente
     */
    boolean existsByDomainNameAndIdNot(String domainName, Long id);
}

