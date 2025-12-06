package com.shopifake.mainapi.repository;

import com.shopifake.mainapi.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * Trouve toutes les catégories racines d'une boutique (sans parent), triées par position
     */
    List<Category> findByShopIdAndParentIdIsNullOrderByPosition(Long shopId);

    /**
     * Trouve toutes les catégories enfants d'une catégorie parent, triées par position
     */
    List<Category> findByShopIdAndParentIdOrderByPosition(Long shopId, Long parentId);

    /**
     * Trouve toutes les catégories d'une boutique, triées par position
     */
    List<Category> findByShopIdOrderByPosition(Long shopId);

    /**
     * Trouve une catégorie par son ID et son shop_id
     */
    Optional<Category> findByIdAndShopId(Long id, Long shopId);

    /**
     * Vérifie si une catégorie a des enfants
     */
    boolean existsByShopIdAndParentId(Long shopId, Long parentId);

    /**
     * Vérifie si un slug existe déjà pour une boutique donnée
     */
    boolean existsByShopIdAndSlug(Long shopId, String slug);

    /**
     * Trouve une catégorie par shop_id et slug
     */
    Optional<Category> findByShopIdAndSlug(Long shopId, String slug);

    /**
     * Trouve tous les descendants d'une catégorie (requête récursive)
     */
    @Query(value = """
        WITH RECURSIVE category_tree AS (
            SELECT id, shop_id, parent_id, label, slug, position, created_at, updated_at, 0 as depth
            FROM categories
            WHERE id = :categoryId
            UNION ALL
            SELECT c.id, c.shop_id, c.parent_id, c.label, c.slug, c.position, c.created_at, c.updated_at, ct.depth + 1
            FROM categories c
            INNER JOIN category_tree ct ON c.parent_id = ct.id
        )
        SELECT id, shop_id, parent_id, label, slug, position, created_at, updated_at FROM category_tree ORDER BY depth, position
        """, nativeQuery = true)
    List<Category> findDescendants(@Param("categoryId") Long categoryId);

    /**
     * Trouve tous les ancêtres d'une catégorie (chemin vers la racine)
     */
    @Query(value = """
        WITH RECURSIVE category_path AS (
            SELECT id, shop_id, parent_id, label, slug, position, 0 as depth, created_at, updated_at
            FROM categories
            WHERE id = :categoryId
            UNION ALL
            SELECT c.id, c.shop_id, c.parent_id, c.label, c.slug, c.position, cp.depth + 1, c.created_at, c.updated_at
            FROM categories c
            INNER JOIN category_path cp ON c.id = cp.parent_id
        )
        SELECT * FROM category_path ORDER BY depth DESC
        """, nativeQuery = true)
    List<Category> findAncestors(@Param("categoryId") Long categoryId);

    /**
     * Compte le nombre d'enfants d'une catégorie
     */
    long countByShopIdAndParentId(Long shopId, Long parentId);
}

