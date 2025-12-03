# Storefront Implementation - Shopifake Frontend

## Overview

Ce document décrit l'implémentation des interfaces de boutique publiques (storefronts) pour Shopifake. Les boutiques publiques sont accessibles via des URLs de type `/:domainName` et permettent aux visiteurs non connectés de naviguer dans les produits et d'ajouter des articles au panier.

## Architecture

### Routes

Les routes suivantes ont été ajoutées dans `app/routes.ts` :

- `/:domainName` - Page principale de la boutique avec liste des produits
- `/:domainName/products/:slug` - Page de détail d'un produit

Ces routes sont définies en dernier pour éviter les conflits avec les routes existantes.

### Structure des fichiers

```
frontend/app/
├── lib/
│   ├── types/
│   │   └── storefront.ts           # Types TypeScript pour Shop, Category, Product, etc.
│   ├── mock/
│   │   └── storefront-data.ts      # Données mock pour développement
│   └── translations/
│       └── storefront.ts            # Traductions EN/FR
├── contexts/
│   └── CartContext.tsx              # Gestion du panier d'achat
├── components/
│   ├── storefront/
│   │   ├── VariantCard.tsx          # Carte produit/variant
│   │   └── CategorySidebar.tsx      # Navigation dans les catégories
│   └── ui/
│       └── sheet.tsx                # Composant Sheet (modal latéral)
└── routes/
    ├── $domainName.tsx              # Page principale boutique
    └── $domainName.products.$slug.tsx  # Page détail produit
```

## Fonctionnalités implémentées

### 1. Page principale de la boutique (`/:domainName`)

**Fonctionnalités :**
- Bannière de la boutique avec image et description
- Barre de recherche pour filtrer les produits
- Navigation par catégories (sidebar avec hiérarchie)
- Grille de produits/variants avec images et prix
- Panier d'achat accessible via un Sheet (modal latéral)
- Responsive design (mobile/tablet/desktop)

**Composants utilisés :**
- `CategorySidebar` : Navigation hiérarchique dans les catégories
- `VariantCard` : Affichage d'un produit/variant avec image, prix, stock
- `Sheet` : Modal latéral pour le panier
- `ImageWithFallback` : Gestion des images avec fallback

### 2. Page de détail produit (`/:domainName/products/:slug`)

**Fonctionnalités :**
- Grande image du produit
- Informations détaillées (nom, prix, description)
- Sélection des variantes (couleur, taille, etc.)
- Sélecteur de quantité
- Ajout au panier
- Gestion du stock (affichage si rupture ou stock faible)
- Navigation retour vers la boutique

### 3. Gestion du panier (CartContext)

**Fonctionnalités :**
- Ajout de produits au panier
- Suppression de produits
- Calcul automatique du total
- Affichage du nombre d'articles
- Notifications toast pour les actions (ajout/suppression)

### 4. Lien depuis le back-office

Un bouton "View Storefront" a été ajouté dans la sidebar du dashboard (pour chaque boutique) permettant d'ouvrir la boutique publique dans un nouvel onglet.

## Modèle de données

### Shop
```typescript
interface Shop {
  id: number;
  adminId: number;
  domainName: string;      // Identifiant unique pour l'URL
  name: string;
  description?: string;
  bannerUrl?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Category
```typescript
interface Category {
  id: number;
  shopId: number;
  parentId?: number;        // Pour hiérarchie
  label: string;
  slug: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}
```

### Product
```typescript
interface Product {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  attributeDefinitions: AttributeDefinition[];
  variants: ProductVariant[];
}
```

### ProductVariant
```typescript
interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  attributes: VariantAttribute[];
}
```

## Design System

L'implémentation utilise le design system "liquid glass" existant avec :

- **liquid-card** : Cartes avec effet de verre liquide
- **ios-surface** : Surface iOS-style
- **glass-strong-transparent** : Fond semi-transparent avec blur
- **liquid-button** : Boutons avec effet liquide

Les composants respectent les principes **KISS** (Keep It Simple, Stupid) et **DRY** (Don't Repeat Yourself).

## Données Mock

Pour le développement, des données mock sont disponibles dans `lib/mock/storefront-data.ts` :

- 1 boutique exemple
- 26 catégories avec hiérarchie (jusqu'à 3 niveaux)
- 5 produits avec variantes
- 15 variantes de produits au total

**Helpers disponibles :**
- `getAllVariantsWithProductInfo()` : Récupère toutes les variantes enrichies
- `getProductBySlug(slug)` : Trouve un produit par son slug
- `getProductByVariantId(id)` : Trouve un produit à partir d'une variante
- `getVariantById(id)` : Trouve une variante par ID

## Connexion au backend (TODO)

Actuellement, l'application utilise des données mock. Pour connecter au backend :

1. **Dans `$domainName.tsx` :**
   - Remplacer `mockStorefrontShop`, `mockCategories`, `getAllVariantsWithProductInfo()` par des appels API basés sur le paramètre `domainName`

2. **Dans `$domainName.products.$slug.tsx` :**
   - Remplacer `getProductBySlug()` par un appel API

3. **Créer un service API** :
   ```typescript
   // lib/api/storefront.ts
   export async function getShopByDomain(domainName: string): Promise<Shop>
   export async function getShopCategories(shopId: number): Promise<Category[]>
   export async function getShopProducts(shopId: number): Promise<Product[]>
   export async function getProductBySlug(shopId: number, slug: string): Promise<Product>
   ```

## Accessibilité

- Routes publiques accessibles sans authentification
- Support du clavier pour la navigation
- Labels ARIA sur les boutons et contrôles
- Images avec alt text approprié

## Performance

- Utilisation de `useMemo` pour optimiser les filtres
- Lazy loading possible pour les images
- Structure modulaire pour le code-splitting

## Améliorations futures

1. **Internationalisation** : Sélection de langue dynamique (actuellement hardcodé en EN)
2. **SEO** : Meta tags dynamiques basés sur les données de la boutique
3. **Checkout** : Implémentation du processus de paiement
4. **Wishlist** : Ajout d'une liste de souhaits
5. **Filtres avancés** : Prix, couleurs, tailles, etc.
6. **Tri** : Par prix, popularité, nouveautés
7. **Infinite scroll** : Pagination des produits
8. **Recommandations** : Produits suggérés basés sur l'IA
