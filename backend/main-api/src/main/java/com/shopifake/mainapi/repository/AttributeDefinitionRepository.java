package com.shopifake.mainapi.repository;

import com.shopifake.mainapi.model.AttributeDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttributeDefinitionRepository extends JpaRepository<AttributeDefinition, Long> {

    List<AttributeDefinition> findByProductIdOrderByPosition(Long productId);

    boolean existsByProductIdAndAttributeName(Long productId, String attributeName);
}

