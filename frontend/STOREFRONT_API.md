# Storefront API - Documentation d'Implémentation

## 📋 Vue d'Ensemble

Cette implémentation connecte le frontend (storefront) au backend (main-api) pour afficher les catégories, produits et variants.

## 🎯 Structure des Données

### Hiérarchie
```
Shop
  └─ Categories (hierarchical)
      └─ Products
          └─ Variants (ce qui s'affiche réellement)
```

### Affichage des Variants
- **Les variants sont affichés**, pas les produits directement
- **Le nom et la description** proviennent du **produit parent**
- **Les attributs** (couleur, taille, etc.) proviennent du **variant**
- **Prix, stock, SKU** proviennent du **variant**

## 🔌 Endpoints Disponibles

### 1. **Categories**

#### GET `/api/shops/{shopId}/categories`
Récupère les catégories racines (sans parent)
```typescript
Response: CategoryDTO[]
{
  id: number;
  shopId: number;
  parentId: number | null;
  label: string;
  slug: string;
  position: number;
}
```

#### GET `/api/shops/{shopId}/categories/{categoryId}`
Récupère une catégorie spécifique

#### GET `/api/shops/{shopId}/categories/{categoryId}/children`
Récupère les sous-catégories directes

#### GET `/api/shops/{shopId}/categories/{categoryId}/breadcrumb`
Récupère le fil d'Ariane (path from root to category)

---

### 2. **Products**

#### GET `/api/shops/{shopId}/products/by-category/{categoryId}`
Récupère tous les produits d'une catégorie
```typescript
Response: ProductDTO[]
{
  id: number;
  categoryId: number;
  shopId: number;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  attributeDefinitions: AttributeDefinitionDTO[];
}
```

#### GET `/api/shops/{shopId}/products/{productId}`
Récupère un produit spécifique avec ses définitions d'attributs

---

### 3. **Variants**

#### GET `/api/shops/{shopId}/variants/by-product/{productId}`
Récupère tous les variants d'un produit
```typescript
Response: ProductVariantDTO[]
{
  id: number;
  productId: number;
  shopId: number;
  sku: string;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  attributes: Record<string, string>; // ex: { "Couleur": "Rouge", "Taille": "L" }
}
```

#### GET `/api/shops/{shopId}/variants/{variantId}`
Récupère un variant spécifique

---

## 🛠️ Implémentation Frontend

### Fichiers Créés

1. **`app/lib/storefront/dto.ts`**
   - Définitions TypeScript des structures de données
   - `CategoryDTO`, `ProductDTO`, `ProductVariantDTO`
   - `ProductWithVariantsDTO` (combinaison pour l'affichage)

2. **`app/clients/storefrontApiClient.ts`**
   - Client API pour toutes les requêtes storefront
   - Fonctions pour categories, products, variants
   - Fonction combinée `fetchProductsWithVariantsByCategory()` pour récupérer tout d'un coup

3. **`app/config/api.ts`** (mis à jour)
   - Ajout des endpoints pour categories, products, variants

---

## 📦 Flux d'Utilisation Recommandé

### Page de Catégories

```typescript
// 1. Récupérer les catégories racines
const rootCategories = await fetchRootCategories(shopId);

// 2. Quand l'utilisateur clique sur une catégorie
const category = await fetchCategoryById(shopId, categoryId);
const children = await fetchCategoryChildren(shopId, categoryId);
const breadcrumb = await fetchCategoryBreadcrumb(shopId, categoryId);
```

### Page de Produits (d'une catégorie)

```typescript
// Option 1: Fonction combinée (recommandée)
const productsWithVariants = await fetchProductsWithVariantsByCategory(shopId, categoryId);

// Afficher les variants avec les infos du produit parent
productsWithVariants.forEach(({ product, variants }) => {
  variants.forEach(variant => {
    // Afficher:
    // - Nom: product.name
    // - Description: product.description
    // - Prix: variant.price
    // - Stock: variant.stock
    // - Attributs: variant.attributes (ex: { Couleur: "Rouge" })
  });
});

// Option 2: Appels séparés
const products = await fetchProductsByCategory(shopId, categoryId);
const variants = await fetchVariantsByProduct(shopId, productId);
```

---

## 🎨 Exemple d'Affichage

### Carte de Variant

```tsx
<ProductCard>
  <h3>{product.name}</h3>  {/* Du produit parent */}
  <p>{product.description}</p>  {/* Du produit parent */}
  
  <div>
    {Object.entries(variant.attributes).map(([key, value]) => (
      <Badge>{key}: {value}</Badge>  {/* Ex: Couleur: Rouge */}
    ))}
  </div>
  
  <Price>{variant.price} €</Price>  {/* Du variant */}
  <Stock>{variant.stock} en stock</Stock>  {/* Du variant */}
  <SKU>{variant.sku}</SKU>  {/* Du variant */}
</ProductCard>
```

---

## ⚠️ Points Importants

1. **Filtrage des variants actifs** : Utiliser `variant.isActive === true`
2. **Stock disponible** : Vérifier `variant.stock > 0`
3. **Prix** : Type `number` (BigDecimal côté Java)
4. **Attributs** : `Record<string, string>` - Map dynamique
5. **Breadcrumb** : Utile pour la navigation (Home > Category > Subcategory)

---

## 🚀 Prochaines Étapes

1. ✅ **Catégories** : Navigation hiérarchique
2. ✅ **Produits/Variants** : Affichage par catégorie
3. ⏳ **Recherche** : À implémenter plus tard
4. ⏳ **Images** : Intégration avec image-service
5. ⏳ **Panier** : Ajout de variants au panier
6. ⏳ **Filtres** : Par prix, attributs, stock

---

## 📝 Exemple Complet

```typescript
// Récupérer tout pour une catégorie donnée
async function loadCategoryPage(shopId: number, categoryId: number) {
  // Navigation
  const category = await fetchCategoryById(shopId, categoryId);
  const breadcrumb = await fetchCategoryBreadcrumb(shopId, categoryId);
  const children = await fetchCategoryChildren(shopId, categoryId);
  
  // Produits avec variants
  const productsWithVariants = await fetchProductsWithVariantsByCategory(shopId, categoryId);
  
  return {
    category,
    breadcrumb,
    children,
    items: productsWithVariants, // À afficher
  };
}
```

---

## 🔗 Liens Utiles

- **Backend Controllers** : `/backend/main-api/src/main/java/com/shopifake/mainapi/controller/`
- **DTOs** : `/backend/main-api/src/main/java/com/shopifake/mainapi/dto/`
- **Swagger** : `http://localhost:5001/swagger-ui.html`
