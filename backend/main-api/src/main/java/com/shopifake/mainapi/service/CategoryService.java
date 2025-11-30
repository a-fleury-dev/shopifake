package com.shopifake.mainapi.service;

import com.shopifake.mainapi.dto.*;
import com.shopifake.mainapi.exception.BadRequestException;
import com.shopifake.mainapi.exception.ResourceNotFoundException;
import com.shopifake.mainapi.mapper.CategoryMapper;
import com.shopifake.mainapi.model.Category;
import com.shopifake.mainapi.repository.CategoryRepository;
import com.shopifake.mainapi.repository.ShopRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ShopRepository shopRepository;
    private final CategoryMapper categoryMapper;

    private static final int MAX_DEPTH = 4;

    /**
     * Récupère toutes les catégories racines d'une boutique
     */
    public List<CategoryDto> getRootCategories(Long shopId) {
        validateShopExists(shopId);
        return categoryRepository.findByShopIdAndParentIdIsNullOrderByPosition(shopId)
                .stream()
                .map(categoryMapper::toDto)
                .toList();
    }

    /**
     * Récupère toutes les catégories d'une boutique
     */
    public List<CategoryDto> getAllCategories(Long shopId) {
        validateShopExists(shopId);
        return categoryRepository.findByShopIdOrderByPosition(shopId)
                .stream()
                .map(categoryMapper::toDto)
                .toList();
    }

    /**
     * Récupère l'arbre complet des catégories d'une boutique
     */
    public CategoryTreeDto getCategoryTree(Long shopId) {
        validateShopExists(shopId);
        List<Category> allCategories = categoryRepository.findByShopIdOrderByPosition(shopId);
        List<CategoryTreeNodeDto> rootNodes = buildTree(allCategories, null);
        return new CategoryTreeDto(rootNodes);
    }

    /**
     * Récupère une catégorie par son ID
     */
    public CategoryDto getCategoryById(Long shopId, Long categoryId) {
        Category category = findByIdAndShopId(categoryId, shopId);
        return categoryMapper.toDto(category);
    }

    /**
     * Récupère les enfants directs d'une catégorie
     */
    public List<CategoryDto> getChildren(Long shopId, Long categoryId) {
        validateShopExists(shopId);
        validateCategoryExists(categoryId, shopId);

        return categoryRepository.findByShopIdAndParentIdOrderByPosition(shopId, categoryId)
                .stream()
                .map(categoryMapper::toDto)
                .toList();
    }

    /**
     * Récupère le chemin de navigation (breadcrumb) d'une catégorie
     */
    public List<CategoryDto> getBreadcrumb(Long shopId, Long categoryId) {
        validateCategoryExists(categoryId, shopId);
        return categoryRepository.findAncestors(categoryId)
                .stream()
                .map(categoryMapper::toDto)
                .toList();
    }

    /**
     * Crée une nouvelle catégorie
     */
    @Transactional
    public CategoryDto create(Long shopId, CreateCategoryRequest request) {
        log.info("Creating category for shop {}: {}", shopId, request.label());

        validateShopExists(shopId);

        // Valider le parent si spécifié
        if (request.parentId() != null) {
            validateParentCategory(shopId, request.parentId());
            validateDepthLimit(request.parentId());
        }

        // Générer le slug unique
        String slug = generateUniqueSlug(shopId, request.label());

        // Créer la catégorie
        Category category = new Category();
        category.setShopId(shopId);
        category.setParentId(request.parentId());
        category.setLabel(request.label());
        category.setSlug(slug);
        category.setPosition(request.position() != null ? request.position() : 0);

        Category saved = categoryRepository.save(category);
        log.info("Category created with id: {}", saved.getId());

        return categoryMapper.toDto(saved);
    }

    /**
     * Met à jour une catégorie
     */
    @Transactional
    public CategoryDto update(Long shopId, Long categoryId, UpdateCategoryRequest request) {
        log.info("Updating category {} for shop {}", categoryId, shopId);

        Category category = findByIdAndShopId(categoryId, shopId);

        // Valider le nouveau parent si changé
        if (request.parentId() != null && !Objects.equals(category.getParentId(), request.parentId())) {
            validateParentCategory(shopId, request.parentId());
            validateNotMovingToDescendant(categoryId, request.parentId());
            validateDepthLimit(request.parentId());
        }

        // Mettre à jour le label et générer un nouveau slug si nécessaire
        if (!category.getLabel().equals(request.label())) {
            category.setLabel(request.label());
            String newSlug = generateUniqueSlug(shopId, request.label(), categoryId);
            category.setSlug(newSlug);
        }

        category.setParentId(request.parentId());

        if (request.position() != null) {
            category.setPosition(request.position());
        }

        Category updated = categoryRepository.save(category);
        log.info("Category {} updated successfully", categoryId);

        return categoryMapper.toDto(updated);
    }

    /**
     * Déplace une catégorie dans l'arbre
     */
    @Transactional
    public CategoryDto move(Long shopId, Long categoryId, MoveCategoryRequest request) {
        log.info("Moving category {} to parent {} for shop {}", categoryId, request.parentId(), shopId);

        Category category = findByIdAndShopId(categoryId, shopId);

        // Valider le nouveau parent
        if (request.parentId() != null) {
            validateParentCategory(shopId, request.parentId());
            validateNotMovingToDescendant(categoryId, request.parentId());
            validateDepthLimit(request.parentId());
        }

        category.setParentId(request.parentId());

        if (request.position() != null) {
            category.setPosition(request.position());
        }

        Category moved = categoryRepository.save(category);
        log.info("Category {} moved successfully", categoryId);

        return categoryMapper.toDto(moved);
    }

    /**
     * Supprime une catégorie
     */
    @Transactional
    public void delete(Long shopId, Long categoryId) {
        log.info("Deleting category {} from shop {}", categoryId, shopId);

        Category category = findByIdAndShopId(categoryId, shopId);

        // Vérifier qu'il n'y a pas d'enfants
        if (categoryRepository.existsByShopIdAndParentId(shopId, categoryId)) {
            throw new BadRequestException("Impossible de supprimer une catégorie qui a des sous-catégories");
        }

        // TODO: Vérifier qu'il n'y a pas de produits associés (à implémenter plus tard)

        categoryRepository.delete(category);
        log.info("Category {} deleted successfully", categoryId);
    }

    /**
     * Construit l'arbre des catégories de manière récursive
     */
    private List<CategoryTreeNodeDto> buildTree(List<Category> categories, Long parentId) {
        Map<Long, List<Category>> grouped = categories.stream()
                .collect(Collectors.groupingBy(
                        c -> c.getParentId() == null ? -1L : c.getParentId()
                ));

        long actualParentId = parentId == null ? -1L : parentId;

        return grouped.getOrDefault(actualParentId, Collections.emptyList())
                .stream()
                .map(cat -> categoryMapper.toTreeNodeDto(
                        cat,
                        buildTree(categories, cat.getId())
                ))
                .toList();
    }

    /**
     * Génère un slug unique pour une catégorie
     */
    private String generateUniqueSlug(Long shopId, String label) {
        return generateUniqueSlug(shopId, label, null);
    }

    /**
     * Génère un slug unique pour une catégorie (avec exclusion d'un ID pour les updates)
     */
    private String generateUniqueSlug(Long shopId, String label, Long excludeId) {
        String baseSlug = generateSlug(label);
        String slug = baseSlug;
        int counter = 1;

        while (slugExistsForOtherCategory(shopId, slug, excludeId)) {
            slug = baseSlug + "-" + counter++;
        }

        return slug;
    }

    /**
     * Génère un slug à partir d'un label
     */
    private String generateSlug(String label) {
        return Normalizer.normalize(label, Normalizer.Form.NFD)
                .replaceAll("[^\\p{ASCII}]", "")
                .toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
    }

    /**
     * Vérifie si un slug existe déjà pour une autre catégorie
     */
    private boolean slugExistsForOtherCategory(Long shopId, String slug, Long excludeId) {
        Optional<Category> existing = categoryRepository.findByShopIdAndSlug(shopId, slug);
        return existing.isPresent() && (excludeId == null || !existing.get().getId().equals(excludeId));
    }

    /**
     * Valide qu'une boutique existe
     */
    private void validateShopExists(Long shopId) {
        if (!shopRepository.existsById(shopId)) {
            throw new ResourceNotFoundException("Boutique", "id", shopId);
        }
    }

    /**
     * Valide qu'une catégorie existe
     */
    private void validateCategoryExists(Long categoryId, Long shopId) {
        if (!categoryRepository.findByIdAndShopId(categoryId, shopId).isPresent()) {
            throw new ResourceNotFoundException("Catégorie", "id", categoryId);
        }
    }

    /**
     * Trouve une catégorie par ID et shopId ou lève une exception
     */
    private Category findByIdAndShopId(Long categoryId, Long shopId) {
        return categoryRepository.findByIdAndShopId(categoryId, shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie", "id", categoryId));
    }

    /**
     * Valide qu'une catégorie parente existe et appartient au bon shop
     */
    private void validateParentCategory(Long shopId, Long parentId) {
        categoryRepository.findByIdAndShopId(parentId, shopId)
                .orElseThrow(() -> new BadRequestException(
                        "Catégorie parente non trouvée avec l'id: " + parentId
                ));
    }

    /**
     * Valide qu'on ne déplace pas une catégorie vers un de ses descendants
     */
    private void validateNotMovingToDescendant(Long categoryId, Long newParentId) {
        if (categoryId.equals(newParentId)) {
            throw new BadRequestException("Une catégorie ne peut pas être son propre parent");
        }

        List<Category> descendants = categoryRepository.findDescendants(categoryId);
        boolean isDescendant = descendants.stream()
                .anyMatch(d -> d.getId().equals(newParentId));

        if (isDescendant) {
            throw new BadRequestException(
                    "Une catégorie ne peut pas être déplacée vers un de ses descendants"
            );
        }
    }

    /**
     * Valide que la profondeur maximale n'est pas dépassée
     */
    private void validateDepthLimit(Long parentId) {
        List<Category> ancestors = categoryRepository.findAncestors(parentId);

        if (ancestors.size() >= MAX_DEPTH) {
            throw new BadRequestException(
                    "La profondeur maximale de " + MAX_DEPTH + " niveaux est atteinte"
            );
        }
    }
}

