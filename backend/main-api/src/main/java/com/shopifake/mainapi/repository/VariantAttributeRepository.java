package com.shopifake.mainapi.repository;

import com.shopifake.mainapi.model.VariantAttribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VariantAttributeRepository extends JpaRepository<VariantAttribute, Long> {

    List<VariantAttribute> findByVariantId(Long variantId);

    void deleteByVariantId(Long variantId);
}

