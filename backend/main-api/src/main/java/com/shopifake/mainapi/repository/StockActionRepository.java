package com.shopifake.mainapi.repository;

import com.shopifake.mainapi.model.StockAction;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockActionRepository extends JpaRepository<StockAction, Long> {

    @Query("""
        SELECT sa FROM StockAction sa
        JOIN ProductVariant pv ON sa.variantId = pv.id
        WHERE pv.shopId = :shopId
        ORDER BY sa.createdAt DESC
    """)
    List<StockAction> findRecentByShopId(@Param("shopId") Long shopId, Pageable pageable);
}

