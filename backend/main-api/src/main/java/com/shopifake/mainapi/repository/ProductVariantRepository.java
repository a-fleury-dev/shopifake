package com.shopifake.mainapi.repository;

import com.shopifake.mainapi.model.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    List<ProductVariant> findByProductIdOrderById(Long productId);

    Optional<ProductVariant> findBySku(String sku);

    boolean existsBySku(String sku);

    boolean existsBySkuAndIdNot(String sku, Long id);

    @Query("""
        SELECT CASE WHEN COUNT(v) > 0 THEN true ELSE false END
        FROM ProductVariant v
        JOIN v.attributes va
        WHERE v.productId = :productId
        AND v.id != :excludeVariantId
        GROUP BY v.id
        HAVING COUNT(va) = :attributeCount
        AND SUM(CASE WHEN CONCAT(va.attributeDefinitionId, ':', va.attributeValue) IN :attributeCombination THEN 1 ELSE 0 END) = :attributeCount
    """)
    boolean existsByProductIdAndAttributeCombination(
            @Param("productId") Long productId,
            @Param("excludeVariantId") Long excludeVariantId,
            @Param("attributeCombination") List<String> attributeCombination,
            @Param("attributeCount") long attributeCount
    );

    @Query("SELECT COALESCE(SUM(pv.stock), 0) FROM ProductVariant pv WHERE pv.shopId = :shopId")
    Integer sumStockByShopId(@Param("shopId") Long shopId);

    @Query("SELECT COALESCE(SUM(pv.stock * pv.price), 0) FROM ProductVariant pv WHERE pv.shopId = :shopId")
    java.math.BigDecimal sumStockValueByShopId(@Param("shopId") Long shopId);

    @Query("SELECT pv FROM ProductVariant pv LEFT JOIN FETCH pv.attributes WHERE pv.id = :id")
    Optional<ProductVariant> findByIdWithAttributes(@Param("id") Long id);
}

