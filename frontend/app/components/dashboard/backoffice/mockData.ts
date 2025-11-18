import type { CategoryHierarchy, Product, StockHistory, Role } from './types';

export const mockCategories: CategoryHierarchy[] = [
  {
    id: '1',
    name: 'Vêtements',
    description: 'Collection complète de vêtements',
    gender: 'neutre',
    productsCount: 145,
    subCategories: [
      {
        id: '1-1',
        parentId: '1',
        name: 'Hauts',
        description: 'T-shirts, chemises, pulls',
        attributes: [
          { id: 'attr1', name: 'Taille', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
          {
            id: 'attr2',
            name: 'Couleur',
            values: ['Blanc', 'Noir', 'Gris', 'Bleu', 'Rouge', 'Rose'],
          },
          { id: 'attr3', name: 'Matière', values: ['Coton', 'Polyester', 'Lin', 'Soie'] },
        ],
        availableFilters: ['Taille', 'Couleur', 'Matière'],
        subSubCategories: [
          {
            id: '1-1-1',
            parentId: '1-1',
            name: 'T-Shirts',
            description: 'T-shirts casual et sport',
            productsCount: 45,
            attributes: [
              { id: 'attr4', name: 'Taille', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
              { id: 'attr5', name: 'Couleur', values: ['Blanc', 'Noir', 'Gris', 'Bleu', 'Rouge'] },
              { id: 'attr6', name: 'Matière', values: ['Coton', 'Coton Bio', 'Polyester'] },
            ],
            filters: [
              { id: 'f1', name: 'Coupe', values: ['Slim', 'Regular', 'Oversize'] },
              { id: 'f2', name: 'Matière', values: ['Coton', 'Polyester', 'Mix'] },
            ],
          },
        ],
      },
      {
        id: '1-2',
        parentId: '1',
        name: 'Bas',
        description: 'Pantalons, jeans, shorts',
        attributes: [
          { id: 'attr7', name: 'Taille', values: ['36', '38', '40', '42', '44', '46'] },
          { id: 'attr8', name: 'Couleur', values: ['Bleu', 'Noir', 'Gris', 'Beige'] },
          { id: 'attr9', name: 'Coupe', values: ['Slim', 'Regular', 'Relaxed', 'Skinny'] },
        ],
        availableFilters: ['Taille', 'Couleur', 'Coupe'],
        subSubCategories: [
          {
            id: '1-2-1',
            parentId: '1-2',
            name: 'Jeans',
            description: 'Jeans pour tous les styles',
            productsCount: 35,
            attributes: [
              { id: 'attr10', name: 'Taille', values: ['36', '38', '40', '42', '44', '46'] },
              { id: 'attr11', name: 'Couleur', values: ['Bleu Délavé', 'Bleu Brut', 'Noir'] },
              { id: 'attr12', name: 'Coupe', values: ['Droite', 'Évasée', 'Slim', 'Skinny'] },
            ],
            filters: [{ id: 'f3', name: 'Lavage', values: ['Stone Wash', 'Raw', 'Vintage'] }],
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Chaussures',
    description: 'Toutes les chaussures',
    gender: 'neutre',
    productsCount: 78,
    subCategories: [],
  },
];

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'T-Shirt Premium',
    sku: 'TSH-001',
    description: 'T-shirt en coton bio de qualité supérieure',
    price: 29.99,
    categoryId: '1-1-1',
    collection: 'Été 2025',
    attributes: [
      { id: 'pa1', name: 'Taille', values: ['S', 'M', 'L', 'XL'] },
      { id: 'pa2', name: 'Couleur', values: ['Blanc', 'Noir', 'Bleu'] },
    ],
    variants: [
      {
        id: 'v1',
        productId: 'p1',
        name: 'T-Shirt Premium - S / Blanc',
        sku: 'TSH-001-S-WHT',
        price: 29.99,
        stock: 15,
        attributes: { Taille: 'S', Couleur: 'Blanc' },
        lowStockThreshold: 5,
        lastUpdated: '2025-10-28 10:30',
        updatedBy: 'John Admin',
      },
      {
        id: 'v2',
        productId: 'p1',
        name: 'T-Shirt Premium - M / Noir',
        sku: 'TSH-001-M-BLK',
        price: 29.99,
        stock: 8,
        attributes: { Taille: 'M', Couleur: 'Noir' },
        lowStockThreshold: 5,
        lastUpdated: '2025-10-27 14:20',
        updatedBy: 'Sarah Manager',
      },
      {
        id: 'v3',
        productId: 'p1',
        name: 'T-Shirt Premium - L / Bleu',
        sku: 'TSH-001-L-BLU',
        price: 29.99,
        stock: 22,
        attributes: { Taille: 'L', Couleur: 'Bleu' },
        lowStockThreshold: 5,
        lastUpdated: '2025-10-26 09:15',
        updatedBy: 'John Admin',
      },
    ],
    stockTracking: true,
    allowNegativeStock: false,
  },
  {
    id: 'p2',
    name: 'Jean Slim Fit',
    sku: 'JNS-002',
    description: 'Jean slim moderne et confortable',
    price: 79.99,
    categoryId: '1-2-1',
    collection: 'Automne 2025',
    attributes: [
      { id: 'pa3', name: 'Taille', values: ['38', '40', '42'] },
      { id: 'pa4', name: 'Couleur', values: ['Bleu Brut', 'Noir'] },
    ],
    variants: [
      {
        id: 'v4',
        productId: 'p2',
        name: 'Jean Slim Fit - 40 / Bleu Brut',
        sku: 'JNS-002-40-BLU',
        price: 79.99,
        stock: 12,
        attributes: { Taille: '40', Couleur: 'Bleu Brut' },
        lowStockThreshold: 3,
        lastUpdated: '2025-10-25 16:45',
        updatedBy: 'Sarah Manager',
      },
    ],
    stockTracking: true,
    allowNegativeStock: false,
  },
];

export const mockStockHistory: StockHistory[] = [
  {
    id: 'h1',
    variantId: 'v1',
    action: 'add',
    previousStock: 10,
    newStock: 15,
    quantity: 5,
    reason: 'Réapprovisionnement fournisseur',
    date: '2025-10-28 14:30',
    author: 'John Admin',
  },
  {
    id: 'h2',
    variantId: 'v2',
    action: 'remove',
    previousStock: 8,
    newStock: 3,
    quantity: 5,
    reason: 'Ventes en magasin',
    date: '2025-10-27 16:20',
    author: 'Sarah Manager',
  },
];

export const roles: Role[] = [
  {
    id: 'r1',
    name: 'admin',
    permissions: {
      categories: { create: true, read: true, update: true, delete: true },
      products: { create: true, read: true, update: true, delete: true },
      variants: { create: true, read: true, update: true, delete: true },
      stock: { read: true, update: true },
      filters: { create: true, read: true, update: true, delete: true },
      roles: { manage: true },
    },
  },
  {
    id: 'r2',
    name: 'manager',
    permissions: {
      categories: { create: true, read: true, update: true, delete: true },
      products: { create: true, read: true, update: true, delete: true },
      variants: { create: true, read: true, update: true, delete: true },
      stock: { read: true, update: true },
      filters: { create: true, read: true, update: true, delete: true },
      roles: { manage: false },
    },
  },
  {
    id: 'r3',
    name: 'reader',
    permissions: {
      categories: { create: false, read: true, update: false, delete: false },
      products: { create: false, read: true, update: false, delete: false },
      variants: { create: false, read: true, update: false, delete: false },
      stock: { read: true, update: false },
      filters: { create: false, read: true, update: false, delete: false },
      roles: { manage: false },
    },
  },
];
