package com.shopifake.imageservice.repository;

import com.shopifake.imageservice.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ImageRepository extends JpaRepository<Image, UUID> {

    Optional<Image> findByIdAndDeletedAtIsNull(UUID id);

    List<Image> findByDeletedAtIsNull();

    List<Image> findByStoreIdAndEntityTypeAndDeletedAtIsNull(String storeId, Image.EntityType entityType);

    List<Image> findByStoreIdAndDeletedAtIsNull(String storeId);

    List<Image> findByProductIdAndDeletedAtIsNull(String productId);

    List<Image> findByVariantIdAndDeletedAtIsNullOrderByDisplayOrderAsc(String variantId);

    Optional<Image> findByVariantIdAndDisplayOrderAndDeletedAtIsNull(String variantId, Integer displayOrder);
}

