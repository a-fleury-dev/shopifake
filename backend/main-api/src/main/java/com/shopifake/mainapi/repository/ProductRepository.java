package com.shopifake.mainapi.repository;

import com.shopifake.mainapi.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryIdOrderByName(Long categoryId);

    @Query("SELECT p FROM Product p WHERE p.categoryId IN :categoryIds ORDER BY p.name")
    List<Product> findByCategoryIdInOrderByName(@Param("categoryIds") List<Long> categoryIds);

    Optional<Product> findByCategoryIdAndSlug(Long categoryId, String slug);

    boolean existsByCategoryIdAndSlug(Long categoryId, String slug);

    boolean existsByCategoryIdAndSlugAndIdNot(Long categoryId, String slug, Long id);
}

