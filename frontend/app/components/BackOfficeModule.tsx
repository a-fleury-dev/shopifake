import { useState } from 'react';
import {
  Package,
  Tags,
  Archive,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Download,
  Upload,
  FileText,
  History,
  Shield,
  Layers,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';

// Types
interface CategoryAttribute {
  id: string;
  name: string;
  values: string[];
}

interface CategoryHierarchy {
  id: string;
  name: string;
  description: string;
  gender?: 'homme' | 'femme' | 'enfant' | 'neutre';
  productsCount: number;
  attributes?: CategoryAttribute[];
  subCategories?: SubCategory[];
}

interface SubCategory {
  id: string;
  parentId: string;
  name: string;
  description: string;
  attributes?: CategoryAttribute[];
  availableFilters: string[];
  subSubCategories?: SubSubCategory[];
}

interface SubSubCategory {
  id: string;
  parentId: string;
  name: string;
  description: string;
  attributes?: CategoryAttribute[];
  filters: Filter[];
  productsCount: number;
}

interface Filter {
  id: string;
  name: string;
  values: string[];
}

interface ProductAttribute {
  id: string;
  name: string;
  values: string[];
}

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  categoryId: string;
  collection?: string;
  attributes: ProductAttribute[]; // Attributs définis pour ce produit spécifique
  variants: ProductVariant[];
  stockTracking: boolean;
  allowNegativeStock: boolean;
}

interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>; // Les valeurs d'attributs de cette variante
  lowStockThreshold: number;
  lastUpdated: string;
  updatedBy: string;
}

interface StockHistory {
  id: string;
  variantId: string;
  action: 'add' | 'remove' | 'set';
  previousStock: number;
  newStock: number;
  quantity: number;
  reason: string;
  date: string;
  author: string;
}

interface Role {
  id: string;
  name: 'admin' | 'manager' | 'reader';
  permissions: {
    categories: { create: boolean; read: boolean; update: boolean; delete: boolean };
    products: { create: boolean; read: boolean; update: boolean; delete: boolean };
    variants: { create: boolean; read: boolean; update: boolean; delete: boolean };
    stock: { read: boolean; update: boolean };
    filters: { create: boolean; read: boolean; update: boolean; delete: boolean };
    roles: { manage: boolean };
  };
}

interface BackOfficeModuleProps {
  language: 'en' | 'fr';
  currentUser: {
    email: string;
    name: string;
    role: 'admin' | 'manager' | 'reader';
  };
  section: 'categories' | 'products' | 'stock';
}

// Mock Data
const mockCategories: CategoryHierarchy[] = [
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

const mockProducts: Product[] = [
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

const mockStockHistory: StockHistory[] = [
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

const roles: Role[] = [
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

export function BackOfficeModule({ language, currentUser, section }: BackOfficeModuleProps) {
  // Categories state
  const [categories, setCategories] = useState<CategoryHierarchy[]>(mockCategories);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [categorySearch, setCategorySearch] = useState('');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    parentId: 'none',
    gender: 'neutre' as 'homme' | 'femme' | 'enfant' | 'neutre',
    attributes: [] as CategoryAttribute[],
  });
  const [newCategoryAttribute, setNewCategoryAttribute] = useState({ name: '', values: '' });

  // Products state
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    sku: '',
    collection: '',
    attributes: [] as ProductAttribute[],
  });
  const [newProductAttribute, setNewProductAttribute] = useState({ name: '', values: '' });

  // Variant state
  const [showAddVariantModal, setShowAddVariantModal] = useState(false);
  const [showEditVariantModal, setShowEditVariantModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<{
    product: Product;
    variant: ProductVariant;
  } | null>(null);
  const [deleteConfirmVariant, setDeleteConfirmVariant] = useState<{
    productId: string;
    variantId: string;
  } | null>(null);
  const [addingVariantProduct, setAddingVariantProduct] = useState<Product | null>(null);
  const [newVariant, setNewVariant] = useState<{
    name: string;
    sku: string;
    price: string;
    attributes: Record<string, string>;
    lowStockThreshold: string;
  }>({
    name: '',
    sku: '',
    price: '',
    attributes: {},
    lowStockThreshold: '5',
  });

  // Stock state
  const [stockHistory, setStockHistory] = useState<StockHistory[]>(mockStockHistory);
  const [stockSearch, setStockSearch] = useState('');
  const [showStockHistory, setShowStockHistory] = useState<string | null>(null);
  const [showAdjustStockModal, setShowAdjustStockModal] = useState(false);
  const [stockAdjustment, setStockAdjustment] = useState({
    productId: '',
    variantId: '',
    action: 'add' as 'add' | 'remove' | 'set',
    quantity: '',
    reason: '',
  });

  // User permissions
  const userRole = roles.find((r) => r.name === currentUser.role);
  const canEdit = userRole?.permissions.products.update || false;
  const canCreate = userRole?.permissions.products.create || false;
  const canDelete = userRole?.permissions.products.delete || false;

  const t = {
    en: {
      categories: 'Categories Management',
      products: 'Products & Variants',
      stockManagement: 'Stock Management',
      search: 'Search...',
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      name: 'Name',
      description: 'Description',
      gender: 'Gender/Age',
      actions: 'Actions',
      productsCount: '# Products',
      subCategories: 'Sub-Categories',
      filters: 'Filters',
      variants: 'Variants',
      price: 'Price',
      sku: 'SKU',
      stock: 'Stock',
      currentStock: 'Current Stock',
      lowStock: 'Low Stock',
      outOfStock: 'Out of Stock',
      lastUpdated: 'Last Updated',
      updatedBy: 'Updated By',
      history: 'History',
      reason: 'Reason',
      import: 'Import',
      export: 'Export',
      bulkUpdate: 'Bulk Update',
      homme: 'Men',
      femme: 'Women',
      enfant: 'Kids',
      neutre: 'Neutral',
      addCategory: 'Add Category',
      editCategory: 'Edit Category',
      deleteCategory: 'Delete Category',
      deleteCategoryConfirm:
        'Are you sure you want to delete this category? This action cannot be undone.',
      addProduct: 'Add Product',
      editProduct: 'Edit Product',
      deleteProduct: 'Delete Product',
      deleteProductConfirm:
        'Are you sure you want to delete this product and all its variants? This action cannot be undone.',
      editVariant: 'Edit Variant',
      addVariant: 'Add Variant',
      deleteVariant: 'Delete Variant',
      deleteVariantConfirm:
        'Are you sure you want to delete this variant? This action cannot be undone.',
      variantAdded: 'Variant added successfully',
      adjustStock: 'Adjust Stock',
      parentCategory: 'Parent Category',
      noParent: 'No Parent (Root Level)',
      category: 'Category',
      selectCategory: 'Select Category',
      product: 'Product',
      selectProduct: 'Select Product',
      variant: 'Variant',
      selectVariant: 'Select Variant',
      action: 'Action',
      addStock: 'Add Stock',
      removeStock: 'Remove Stock',
      setStock: 'Set Stock',
      quantity: 'Quantity',
      attributes: 'Attributes',
      attributeName: 'Attribute Name',
      attributeValues: 'Values (comma separated)',
      addAttribute: 'Add Attribute',
      removeAttribute: 'Remove',
      collection: 'Collection',
      lowStockThreshold: 'Low Stock Threshold',
      categoryDeleted: 'Category deleted successfully',
      categoryUpdated: 'Category updated successfully',
      productDeleted: 'Product deleted successfully',
      productUpdated: 'Product updated successfully',
      productCreated: 'Product created successfully',
      variantDeleted: 'Variant deleted successfully',
      variantUpdated: 'Variant updated successfully',
      stockUpdated: 'Stock updated successfully',
      productAttributes: 'Product Attributes',
      productAttributesDesc:
        'Define the attributes for this product. These will be used to create variants.',
      variantAttributes: 'Variant Attributes',
      selectAttributeValue: 'Select a value',
      createVariant: 'Create Variant',
      availableAttributes: 'Available Attributes from Category',
    },
    fr: {
      categories: 'Gestion des Catégories',
      products: 'Produits & Variantes',
      stockManagement: 'Gestion des Stocks',
      search: 'Rechercher...',
      add: 'Ajouter',
      edit: 'Modifier',
      delete: 'Supprimer',
      save: 'Enregistrer',
      cancel: 'Annuler',
      name: 'Nom',
      description: 'Description',
      gender: 'Genre/Âge',
      actions: 'Actions',
      productsCount: '# Produits',
      subCategories: 'Sous-Catégories',
      filters: 'Filtres',
      variants: 'Variantes',
      price: 'Prix',
      sku: 'SKU',
      stock: 'Stock',
      currentStock: 'Stock Actuel',
      lowStock: 'Stock Faible',
      outOfStock: 'Rupture de Stock',
      lastUpdated: 'Dernière MAJ',
      updatedBy: 'Modifié Par',
      history: 'Historique',
      reason: 'Raison',
      import: 'Importer',
      export: 'Exporter',
      bulkUpdate: 'Mise à Jour Masse',
      homme: 'Homme',
      femme: 'Femme',
      enfant: 'Enfant',
      neutre: 'Neutre',
      addCategory: 'Ajouter une Catégorie',
      editCategory: 'Modifier la Catégorie',
      deleteCategory: 'Supprimer la Catégorie',
      deleteCategoryConfirm:
        'Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.',
      addProduct: 'Ajouter un Produit',
      editProduct: 'Modifier le Produit',
      deleteProduct: 'Supprimer le Produit',
      deleteProductConfirm:
        'Êtes-vous sûr de vouloir supprimer ce produit et toutes ses variantes ? Cette action est irréversible.',
      editVariant: 'Modifier la Variante',
      addVariant: 'Ajouter une Variante',
      deleteVariant: 'Supprimer la Variante',
      deleteVariantConfirm:
        'Êtes-vous sûr de vouloir supprimer cette variante ? Cette action est irréversible.',
      variantAdded: 'Variante ajoutée avec succès',
      adjustStock: 'Ajuster le Stock',
      parentCategory: 'Catégorie Parente',
      noParent: 'Aucune (Niveau Racine)',
      category: 'Catégorie',
      selectCategory: 'Sélectionner une Catégorie',
      product: 'Produit',
      selectProduct: 'Sélectionner un Produit',
      variant: 'Variante',
      selectVariant: 'Sélectionner une Variante',
      action: 'Action',
      addStock: 'Ajouter du Stock',
      removeStock: 'Retirer du Stock',
      setStock: 'Définir le Stock',
      quantity: 'Quantité',
      attributes: 'Attributs',
      attributeName: "Nom de l'Attribut",
      attributeValues: 'Valeurs (séparées par virgule)',
      addAttribute: 'Ajouter un Attribut',
      removeAttribute: 'Supprimer',
      collection: 'Collection',
      lowStockThreshold: 'Seuil de Stock Faible',
      categoryDeleted: 'Catégorie supprimée avec succès',
      categoryUpdated: 'Catégorie mise à jour avec succès',
      productDeleted: 'Produit supprimé avec succès',
      productUpdated: 'Produit mis à jour avec succès',
      productCreated: 'Produit créé avec succès',
      variantDeleted: 'Variante supprimée avec succès',
      variantUpdated: 'Variante mise à jour avec succès',
      stockUpdated: 'Stock mis à jour avec succès',
      productAttributes: 'Attributs du Produit',
      productAttributesDesc:
        'Définissez les attributs pour ce produit. Ils seront utilisés pour créer les variantes.',
      variantAttributes: 'Attributs de la Variante',
      selectAttributeValue: 'Sélectionner une valeur',
      createVariant: 'Créer la Variante',
      availableAttributes: 'Attributs Disponibles de la Catégorie',
    },
  };

  const text = t[language];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Get category attributes (templates from category)
  const getCategoryAttributes = (categoryId: string): CategoryAttribute[] => {
    const findCategory = (cats: any[], id: string): CategoryAttribute[] => {
      for (const cat of cats) {
        if (cat.id === id && cat.attributes) return cat.attributes;
        if (cat.subCategories) {
          const found = findCategory(cat.subCategories, id);
          if (found.length > 0) return found;
        }
        if ('subSubCategories' in cat && cat.subSubCategories) {
          const found = findCategory(cat.subSubCategories, id);
          if (found.length > 0) return found;
        }
      }
      return [];
    };
    return findCategory(categories, categoryId);
  };

  // ========== PRODUCT HANDLERS ==========

  // Handler for adding a product attribute
  const handleAddProductAttribute = () => {
    if (!newProductAttribute.name || !newProductAttribute.values) return;

    const values = newProductAttribute.values
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v);
    const attribute: ProductAttribute = {
      id: `pattr-${Date.now()}`,
      name: newProductAttribute.name,
      values,
    };

    setNewProduct({
      ...newProduct,
      attributes: [...newProduct.attributes, attribute],
    });
    setNewProductAttribute({ name: '', values: '' });
  };

  // Handler for removing a product attribute
  const handleRemoveProductAttribute = (attrId: string) => {
    setNewProduct({
      ...newProduct,
      attributes: newProduct.attributes.filter((a) => a.id !== attrId),
    });
  };

  // Handler for adding a product
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.categoryId || !newProduct.price || !newProduct.sku) {
      toast.error('Please fill in all required fields');
      return;
    }

    const product: Product = {
      id: `prod-${Date.now()}`,
      name: newProduct.name,
      sku: newProduct.sku,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      categoryId: newProduct.categoryId,
      collection: newProduct.collection,
      attributes: newProduct.attributes,
      variants: [],
      stockTracking: true,
      allowNegativeStock: false,
    };

    setProducts([...products, product]);
    setNewProduct({
      name: '',
      description: '',
      categoryId: '',
      price: '',
      sku: '',
      collection: '',
      attributes: [],
    });
    setShowAddProductModal(false);
    toast.success(text.productCreated);
  };

  // Handler for editing a product
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowEditProductModal(true);
  };

  // Handler for adding attribute to editing product
  const handleAddEditProductAttribute = () => {
    if (!editingProduct || !newProductAttribute.name || !newProductAttribute.values) return;

    const values = newProductAttribute.values
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v);
    const attribute: ProductAttribute = {
      id: `pattr-${Date.now()}`,
      name: newProductAttribute.name,
      values,
    };

    setEditingProduct({
      ...editingProduct,
      attributes: [...editingProduct.attributes, attribute],
    });
    setNewProductAttribute({ name: '', values: '' });
  };

  // Handler for removing attribute from editing product
  const handleRemoveEditProductAttribute = (attrId: string) => {
    if (!editingProduct) return;

    setEditingProduct({
      ...editingProduct,
      attributes: editingProduct.attributes.filter((a) => a.id !== attrId),
    });
  };

  // Handler for saving edited product
  const handleSaveEditProduct = () => {
    if (!editingProduct) return;

    setProducts(products.map((p) => (p.id === editingProduct.id ? editingProduct : p)));
    setShowEditProductModal(false);
    setEditingProduct(null);
    toast.success(text.productUpdated);
  };

  // Handler for deleting a product
  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
    setDeleteConfirmProduct(null);
    toast.success(text.productDeleted);
  };

  // ========== VARIANT HANDLERS ==========

  // Handler for opening add variant modal
  const handleOpenAddVariant = (product: Product) => {
    setAddingVariantProduct(product);
    // Initialize attributes from product
    const initialAttrs: Record<string, string> = {};
    product.attributes.forEach((attr) => {
      initialAttrs[attr.name] = '';
    });
    setNewVariant({
      name: '',
      sku: '',
      price: product.price.toString(),
      attributes: initialAttrs,
      lowStockThreshold: '5',
    });
    setShowAddVariantModal(true);
  };

  // Handler for adding a variant
  const handleAddVariant = () => {
    if (!addingVariantProduct) return;

    const variant: ProductVariant = {
      id: `var-${Date.now()}`,
      productId: addingVariantProduct.id,
      name:
        newVariant.name || generateVariantName(addingVariantProduct.name, newVariant.attributes),
      sku: newVariant.sku || generateVariantSku(addingVariantProduct.sku, newVariant.attributes),
      price: parseFloat(newVariant.price) || addingVariantProduct.price,
      stock: 0,
      attributes: Object.fromEntries(
        Object.entries(newVariant.attributes).filter(([_, value]) => value),
      ),
      lowStockThreshold: parseInt(newVariant.lowStockThreshold) || 5,
      lastUpdated: new Date().toISOString(),
      updatedBy: currentUser.name,
    };

    setProducts(
      products.map((p) => {
        if (p.id === addingVariantProduct.id) {
          return {
            ...p,
            variants: [...p.variants, variant],
          };
        }
        return p;
      }),
    );

    setShowAddVariantModal(false);
    setAddingVariantProduct(null);
    setNewVariant({
      name: '',
      sku: '',
      price: '',
      attributes: {},
      lowStockThreshold: '5',
    });
    toast.success(text.variantAdded);
  };

  // Helper to generate variant name
  const generateVariantName = (productName: string, attributes: Record<string, string>): string => {
    const attrString = Object.entries(attributes)
      .filter(([_, value]) => value)
      .map(([_, value]) => value)
      .join(' / ');
    return `${productName}${attrString ? ' - ' + attrString : ''}`;
  };

  // Helper to generate variant SKU
  const generateVariantSku = (productSku: string, attributes: Record<string, string>): string => {
    const attrString = Object.entries(attributes)
      .filter(([_, value]) => value)
      .map(([_, value]) => value.toUpperCase().replace(/\s+/g, '').substring(0, 3))
      .join('-');
    return `${productSku}${attrString ? '-' + attrString : '-DEFAULT'}`;
  };

  // Handler for editing a variant
  const handleEditVariant = (product: Product, variant: ProductVariant) => {
    setEditingVariant({ product, variant });
    setShowEditVariantModal(true);
  };

  // Handler for saving edited variant
  const handleSaveEditVariant = () => {
    if (!editingVariant) return;

    setProducts(
      products.map((p) => {
        if (p.id === editingVariant.product.id) {
          return {
            ...p,
            variants: p.variants.map((v) =>
              v.id === editingVariant.variant.id
                ? {
                    ...editingVariant.variant,
                    lastUpdated: new Date().toISOString(),
                    updatedBy: currentUser.name,
                  }
                : v,
            ),
          };
        }
        return p;
      }),
    );

    setShowEditVariantModal(false);
    setEditingVariant(null);
    toast.success(text.variantUpdated);
  };

  // Handler for deleting a variant
  const handleDeleteVariant = (productId: string, variantId: string) => {
    setProducts(
      products.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            variants: p.variants.filter((v) => v.id !== variantId),
          };
        }
        return p;
      }),
    );
    setDeleteConfirmVariant(null);
    toast.success(text.variantDeleted);
  };

  // ========== STOCK HANDLERS ==========

  // Handler for adjusting stock
  const handleAdjustStock = () => {
    const product = products.find((p) => p.id === stockAdjustment.productId);
    const variant = product?.variants.find((v) => v.id === stockAdjustment.variantId);

    if (!product || !variant) return;

    const quantity = parseInt(stockAdjustment.quantity);
    let newStock = variant.stock;

    if (stockAdjustment.action === 'add') {
      newStock += quantity;
    } else if (stockAdjustment.action === 'remove') {
      newStock -= quantity;
    } else if (stockAdjustment.action === 'set') {
      newStock = quantity;
    }

    setProducts(
      products.map((p) => {
        if (p.id === product.id) {
          return {
            ...p,
            variants: p.variants.map((v) =>
              v.id === variant.id
                ? {
                    ...v,
                    stock: Math.max(0, newStock),
                    lastUpdated: new Date().toISOString(),
                    updatedBy: currentUser.name,
                  }
                : v,
            ),
          };
        }
        return p;
      }),
    );

    const historyEntry: StockHistory = {
      id: `hist-${Date.now()}`,
      variantId: variant.id,
      action: stockAdjustment.action,
      previousStock: variant.stock,
      newStock: Math.max(0, newStock),
      quantity,
      reason: stockAdjustment.reason,
      date: new Date().toISOString(),
      author: currentUser.name,
    };

    setStockHistory([historyEntry, ...stockHistory]);
    setStockAdjustment({ productId: '', variantId: '', action: 'add', quantity: '', reason: '' });
    setShowAdjustStockModal(false);
    toast.success(text.stockUpdated);
  };

  // Get all categories flattened for select options
  const getAllCategories = (
    cats: CategoryHierarchy[],
    prefix = '',
  ): Array<{ id: string; name: string }> => {
    const result: Array<{ id: string; name: string }> = [];
    cats.forEach((cat) => {
      result.push({ id: cat.id, name: prefix + cat.name });
      if (cat.subCategories && cat.subCategories.length > 0) {
        result.push(...getAllCategories(cat.subCategories as any, prefix + cat.name + ' > '));
      }
    });
    return result;
  };

  // ========== CATEGORY HANDLERS ==========

  // Handler for adding a category attribute
  const handleAddCategoryAttribute = () => {
    if (!newCategoryAttribute.name || !newCategoryAttribute.values) return;

    const values = newCategoryAttribute.values
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v);
    const attribute: CategoryAttribute = {
      id: `cattr-${Date.now()}`,
      name: newCategoryAttribute.name,
      values,
    };

    setNewCategory({
      ...newCategory,
      attributes: [...newCategory.attributes, attribute],
    });
    setNewCategoryAttribute({ name: '', values: '' });
  };

  // Handler for removing a category attribute
  const handleRemoveCategoryAttribute = (attrId: string) => {
    setNewCategory({
      ...newCategory,
      attributes: newCategory.attributes.filter((a) => a.id !== attrId),
    });
  };

  // Handler for adding a category
  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newCat: any = {
      id: `cat-${Date.now()}`,
      name: newCategory.name,
      description: newCategory.description,
      gender: newCategory.gender,
      attributes: newCategory.attributes,
      productsCount: 0,
    };

    // Determine where to add the category based on parentId
    if (!newCategory.parentId || newCategory.parentId === 'none') {
      // Add as root category
      setCategories([...categories, { ...newCat, subCategories: [] }]);
    } else {
      // Add as subcategory
      const updateCategories = (cats: CategoryHierarchy[]): CategoryHierarchy[] => {
        return cats.map((cat) => {
          if (cat.id === newCategory.parentId) {
            // Add to subCategories
            return {
              ...cat,
              subCategories: [
                ...(cat.subCategories || []),
                { ...newCat, parentId: cat.id, availableFilters: [], subSubCategories: [] },
              ],
            };
          }
          if (cat.subCategories) {
            // Check in sub-subcategories
            const updatedSubs = cat.subCategories.map((sub: SubCategory) => {
              if (sub.id === newCategory.parentId) {
                return {
                  ...sub,
                  subSubCategories: [
                    ...(sub.subSubCategories || []),
                    { ...newCat, parentId: sub.id, filters: [] },
                  ],
                };
              }
              return sub;
            });
            return { ...cat, subCategories: updatedSubs };
          }
          return cat;
        });
      };
      setCategories(updateCategories(categories));
    }

    setNewCategory({ name: '', description: '', parentId: '', gender: 'neutre', attributes: [] });
    setShowAddCategoryModal(false);
    toast.success(
      language === 'fr' ? 'Catégorie ajoutée avec succès' : 'Category added successfully',
    );
  };

  // Handler for editing a category
  const handleEditCategory = (category: any, level: 'root' | 'sub' | 'subsub') => {
    setEditingCategory({ ...category, level });
    setShowEditCategoryModal(true);
  };

  // Handler for adding attribute to editing category
  const handleAddEditCategoryAttribute = () => {
    if (!editingCategory || !newCategoryAttribute.name || !newCategoryAttribute.values) return;

    const values = newCategoryAttribute.values
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v);
    const attribute: CategoryAttribute = {
      id: `cattr-${Date.now()}`,
      name: newCategoryAttribute.name,
      values,
    };

    setEditingCategory({
      ...editingCategory,
      attributes: [...(editingCategory.attributes || []), attribute],
    });
    setNewCategoryAttribute({ name: '', values: '' });
  };

  // Handler for removing attribute from editing category
  const handleRemoveEditCategoryAttribute = (attrId: string) => {
    if (!editingCategory) return;

    setEditingCategory({
      ...editingCategory,
      attributes: (editingCategory.attributes || []).filter(
        (a: CategoryAttribute) => a.id !== attrId,
      ),
    });
  };

  // Handler for saving edited category
  const handleSaveEditCategory = () => {
    if (!editingCategory) return;

    const updateCategoriesRecursive = (cats: CategoryHierarchy[]): CategoryHierarchy[] => {
      return cats.map((cat) => {
        if (cat.id === editingCategory.id) {
          return { ...cat, ...editingCategory };
        }
        if (cat.subCategories) {
          const updatedSubs = cat.subCategories.map((sub: SubCategory) => {
            if (sub.id === editingCategory.id) {
              return { ...sub, ...editingCategory };
            }
            if (sub.subSubCategories) {
              const updatedSubSubs = sub.subSubCategories.map((subsub: SubSubCategory) => {
                if (subsub.id === editingCategory.id) {
                  return { ...subsub, ...editingCategory };
                }
                return subsub;
              });
              return { ...sub, subSubCategories: updatedSubSubs };
            }
            return sub;
          });
          return { ...cat, subCategories: updatedSubs };
        }
        return cat;
      });
    };

    setCategories(updateCategoriesRecursive(categories));
    setShowEditCategoryModal(false);
    setEditingCategory(null);
    toast.success(text.categoryUpdated);
  };

  // Handler for deleting a category
  const handleDeleteCategory = (categoryId: string) => {
    const deleteCategoryRecursive = (cats: CategoryHierarchy[]): CategoryHierarchy[] => {
      return cats.filter((cat) => {
        if (cat.id === categoryId) return false;
        if (cat.subCategories) {
          cat.subCategories = cat.subCategories.filter((sub: SubCategory) => {
            if (sub.id === categoryId) return false;
            if (sub.subSubCategories) {
              sub.subSubCategories = sub.subSubCategories.filter(
                (subsub: SubSubCategory) => subsub.id !== categoryId,
              );
            }
            return true;
          });
        }
        return true;
      });
    };

    setCategories(deleteCategoryRecursive(categories));
    setDeleteConfirmCategory(null);
    toast.success(text.categoryDeleted);
  };

  // Render Categories Section
  const renderCategoriesSection = () => {
    const filteredCategories = categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
        cat.description.toLowerCase().includes(categorySearch.toLowerCase()),
    );

    const renderCategoryTree = (
      cat: CategoryHierarchy | SubCategory | SubSubCategory,
      level: number = 0,
    ) => {
      const isExpanded = expandedCategories[cat.id];
      const hasChildren =
        'subCategories' in cat && cat.subCategories && cat.subCategories.length > 0;
      const hasSubSubChildren =
        'subSubCategories' in cat && cat.subSubCategories && cat.subSubCategories.length > 0;

      return (
        <div key={cat.id} className={level > 0 ? 'ml-6 border-l-2 border-muted pl-4' : ''}>
          <Card className="liquid-card no-hover border-0 mb-3">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {(hasChildren || hasSubSubChildren) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCategory(cat.id)}
                        className="h-6 w-6 p-0"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                    <Tags className="w-5 h-5 text-primary" />
                    <h3 className="font-medium">{cat.name}</h3>
                    {'gender' in cat && cat.gender && (
                      <Badge variant="secondary">{text[cat.gender]}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 ml-8">{cat.description}</p>
                  <div className="flex gap-2 mt-2 ml-8 flex-wrap">
                    {'productsCount' in cat && (
                      <Badge variant="outline">
                        <Package className="w-3 h-3 mr-1" />
                        {cat.productsCount} {text.productsCount}
                      </Badge>
                    )}
                    {cat.attributes && cat.attributes.length > 0 && (
                      <Badge variant="secondary">
                        <Layers className="w-3 h-3 mr-1" />
                        {cat.attributes.length} {text.attributes}
                      </Badge>
                    )}
                  </div>
                  {cat.attributes && cat.attributes.length > 0 && (
                    <div className="mt-2 ml-8 p-2 bg-muted/50 rounded">
                      <p className="text-xs font-medium mb-1">{text.attributes}:</p>
                      {cat.attributes.map((attr: CategoryAttribute) => (
                        <div key={attr.id} className="text-xs text-muted-foreground">
                          <span className="font-medium">{attr.name}:</span> {attr.values.join(', ')}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {canEdit && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleEditCategory(
                          cat,
                          level === 0 ? 'root' : level === 1 ? 'sub' : 'subsub',
                        )
                      }
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirmCategory(cat.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {isExpanded && hasChildren && 'subCategories' in cat && (
            <div className="mt-2">
              {cat.subCategories!.map((sub: SubCategory) => renderCategoryTree(sub, level + 1))}
            </div>
          )}

          {isExpanded && hasSubSubChildren && 'subSubCategories' in cat && (
            <div className="mt-2">
              {cat.subSubCategories!.map((subsub: SubSubCategory) =>
                renderCategoryTree(subsub, level + 1),
              )}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <Card className="liquid-card no-hover border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">{text.categories}</CardTitle>
              {canCreate && (
                <Dialog open={showAddCategoryModal} onOpenChange={setShowAddCategoryModal}>
                  <DialogTrigger asChild>
                    <Button className="liquid-button">
                      <Plus className="w-4 h-4 mr-2" />
                      {text.add}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="liquid-card max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{text.addCategory}</DialogTitle>
                      <DialogDescription>
                        {language === 'fr'
                          ? 'Créez une nouvelle catégorie et définissez des attributs templates pour les produits.'
                          : 'Create a new category and define template attributes for products.'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>{text.name} *</Label>
                        <Input
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                          placeholder="Ex: T-Shirts"
                        />
                      </div>
                      <div>
                        <Label>{text.description} *</Label>
                        <Textarea
                          value={newCategory.description}
                          onChange={(e) =>
                            setNewCategory({ ...newCategory, description: e.target.value })
                          }
                          placeholder="Description de la catégorie"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>{text.parentCategory}</Label>
                          <Select
                            value={newCategory.parentId}
                            onValueChange={(value) =>
                              setNewCategory({ ...newCategory, parentId: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={text.noParent} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">{text.noParent}</SelectItem>
                              {getAllCategories(categories).map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>{text.gender}</Label>
                          <Select
                            value={newCategory.gender}
                            onValueChange={(value: any) =>
                              setNewCategory({ ...newCategory, gender: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="neutre">{text.neutre}</SelectItem>
                              <SelectItem value="homme">{text.homme}</SelectItem>
                              <SelectItem value="femme">{text.femme}</SelectItem>
                              <SelectItem value="enfant">{text.enfant}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Category Attributes (Templates) */}
                      <div className="border-t pt-4 mt-4">
                        <h3 className="font-medium mb-2">{text.attributes} (Templates)</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {language === 'fr'
                            ? 'Ces attributs servent de templates pour les produits de cette catégorie.'
                            : 'These attributes serve as templates for products in this category.'}
                        </p>

                        {/* Add attribute form */}
                        <div className="flex gap-2 mb-3">
                          <Input
                            placeholder={text.attributeName}
                            value={newCategoryAttribute.name}
                            onChange={(e) =>
                              setNewCategoryAttribute({
                                ...newCategoryAttribute,
                                name: e.target.value,
                              })
                            }
                            className="flex-1"
                          />
                          <Input
                            placeholder={text.attributeValues}
                            value={newCategoryAttribute.values}
                            onChange={(e) =>
                              setNewCategoryAttribute({
                                ...newCategoryAttribute,
                                values: e.target.value,
                              })
                            }
                            className="flex-1"
                          />
                          <Button onClick={handleAddCategoryAttribute} variant="outline" size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Display added attributes */}
                        {newCategory.attributes.length > 0 && (
                          <div className="space-y-2">
                            {newCategory.attributes.map((attr) => (
                              <div
                                key={attr.id}
                                className="flex items-center justify-between p-2 bg-muted rounded"
                              >
                                <div>
                                  <span className="font-medium">{attr.name}:</span>
                                  <span className="text-sm text-muted-foreground ml-2">
                                    {attr.values.join(', ')}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveCategoryAttribute(attr.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleAddCategory} className="flex-1">
                          {text.save}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowAddCategoryModal(false)}
                          className="flex-1"
                        >
                          {text.cancel}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder={text.search}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredCategories.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  {language === 'fr' ? 'Aucune catégorie trouvée' : 'No categories found'}
                </div>
              ) : (
                filteredCategories.map((cat) => renderCategoryTree(cat))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Category Modal */}
        <Dialog open={showEditCategoryModal} onOpenChange={setShowEditCategoryModal}>
          <DialogContent className="liquid-card max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{text.editCategory}</DialogTitle>
              <DialogDescription>
                {language === 'fr'
                  ? 'Modifiez les informations de cette catégorie et ses attributs templates.'
                  : 'Edit this category information and its template attributes.'}
              </DialogDescription>
            </DialogHeader>
            {editingCategory && (
              <div className="space-y-4">
                <div>
                  <Label>{text.name} *</Label>
                  <Input
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>{text.description} *</Label>
                  <Textarea
                    value={editingCategory.description}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, description: e.target.value })
                    }
                  />
                </div>
                {editingCategory.level === 'root' && (
                  <div>
                    <Label>{text.gender}</Label>
                    <Select
                      value={editingCategory.gender || 'neutre'}
                      onValueChange={(value: any) =>
                        setEditingCategory({ ...editingCategory, gender: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="neutre">{text.neutre}</SelectItem>
                        <SelectItem value="homme">{text.homme}</SelectItem>
                        <SelectItem value="femme">{text.femme}</SelectItem>
                        <SelectItem value="enfant">{text.enfant}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Category Attributes (Templates) */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium mb-2">{text.attributes} (Templates)</h3>

                  {/* Add attribute form */}
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder={text.attributeName}
                      value={newCategoryAttribute.name}
                      onChange={(e) =>
                        setNewCategoryAttribute({ ...newCategoryAttribute, name: e.target.value })
                      }
                      className="flex-1"
                    />
                    <Input
                      placeholder={text.attributeValues}
                      value={newCategoryAttribute.values}
                      onChange={(e) =>
                        setNewCategoryAttribute({ ...newCategoryAttribute, values: e.target.value })
                      }
                      className="flex-1"
                    />
                    <Button onClick={handleAddEditCategoryAttribute} variant="outline" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Display added attributes */}
                  {editingCategory.attributes && editingCategory.attributes.length > 0 && (
                    <div className="space-y-2">
                      {editingCategory.attributes.map((attr: CategoryAttribute) => (
                        <div
                          key={attr.id}
                          className="flex items-center justify-between p-2 bg-muted rounded"
                        >
                          <div>
                            <span className="font-medium">{attr.name}:</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {attr.values.join(', ')}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveEditCategoryAttribute(attr.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveEditCategory} className="flex-1">
                    {text.save}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowEditCategoryModal(false)}
                    className="flex-1"
                  >
                    {text.cancel}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Category Confirmation */}
        <AlertDialog
          open={!!deleteConfirmCategory}
          onOpenChange={() => setDeleteConfirmCategory(null)}
        >
          <AlertDialogContent className="liquid-card">
            <AlertDialogHeader>
              <AlertDialogTitle>{text.deleteCategory}</AlertDialogTitle>
              <AlertDialogDescription>{text.deleteCategoryConfirm}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{text.cancel}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteConfirmCategory && handleDeleteCategory(deleteConfirmCategory)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {text.delete}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

  // Render Products Section
  const renderProductsSection = () => {
    const filteredProducts = products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return (
      <div className="space-y-6">
        <Card className="liquid-card no-hover border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">{text.products}</CardTitle>
              {canCreate && (
                <Dialog open={showAddProductModal} onOpenChange={setShowAddProductModal}>
                  <DialogTrigger asChild>
                    <Button className="liquid-button">
                      <Plus className="w-4 h-4 mr-2" />
                      {text.add}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="liquid-card max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{text.addProduct}</DialogTitle>
                      <DialogDescription>
                        {language === 'fr'
                          ? 'Créez un nouveau produit et définissez ses attributs. Vous pourrez ajouter des variantes ensuite.'
                          : 'Create a new product and define its attributes. You can add variants afterwards.'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>{text.name} *</Label>
                        <Input
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          placeholder="Ex: T-Shirt Premium"
                        />
                      </div>
                      <div>
                        <Label>{text.description}</Label>
                        <Textarea
                          value={newProduct.description}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, description: e.target.value })
                          }
                          placeholder="Description du produit"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>SKU *</Label>
                          <Input
                            value={newProduct.sku}
                            onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                            placeholder="Ex: TSH-001"
                          />
                        </div>
                        <div>
                          <Label>{text.price} *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={newProduct.price}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, price: e.target.value })
                            }
                            placeholder="29.99"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>{text.category} *</Label>
                          <Select
                            value={newProduct.categoryId}
                            onValueChange={(value) =>
                              setNewProduct({ ...newProduct, categoryId: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={text.selectCategory} />
                            </SelectTrigger>
                            <SelectContent>
                              {getAllCategories(categories).map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>{text.collection}</Label>
                          <Input
                            value={newProduct.collection}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, collection: e.target.value })
                            }
                            placeholder="Ex: Été 2025"
                          />
                        </div>
                      </div>

                      {/* Product Attributes Section */}
                      <div className="border-t pt-4 mt-4">
                        <h3 className="font-medium mb-2">{text.productAttributes}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {text.productAttributesDesc}
                        </p>

                        {/* Show available attributes from category */}
                        {newProduct.categoryId &&
                          getCategoryAttributes(newProduct.categoryId).length > 0 && (
                            <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm mb-2">{text.availableAttributes}:</p>
                              <div className="flex flex-wrap gap-2">
                                {getCategoryAttributes(newProduct.categoryId).map((attr) => (
                                  <Badge key={attr.id} variant="secondary" className="text-xs">
                                    {attr.name}: {attr.values.join(', ')}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Add attribute form */}
                        <div className="flex gap-2 mb-3">
                          <Input
                            placeholder={text.attributeName}
                            value={newProductAttribute.name}
                            onChange={(e) =>
                              setNewProductAttribute({
                                ...newProductAttribute,
                                name: e.target.value,
                              })
                            }
                            className="flex-1"
                          />
                          <Input
                            placeholder={text.attributeValues}
                            value={newProductAttribute.values}
                            onChange={(e) =>
                              setNewProductAttribute({
                                ...newProductAttribute,
                                values: e.target.value,
                              })
                            }
                            className="flex-1"
                          />
                          <Button onClick={handleAddProductAttribute} variant="outline" size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Display added attributes */}
                        {newProduct.attributes.length > 0 && (
                          <div className="space-y-2">
                            {newProduct.attributes.map((attr) => (
                              <div
                                key={attr.id}
                                className="flex items-center justify-between p-2 bg-muted rounded"
                              >
                                <div>
                                  <span className="font-medium">{attr.name}:</span>
                                  <span className="text-sm text-muted-foreground ml-2">
                                    {attr.values.join(', ')}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveProductAttribute(attr.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleAddProduct} className="flex-1">
                          {text.save}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowAddProductModal(false)}
                          className="flex-1"
                        >
                          {text.cancel}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <div className="flex gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder={text.search}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {getAllCategories(categories).map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="liquid-card border-0">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-primary" />
                          {product.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline">SKU: {product.sku}</Badge>
                          <Badge variant="secondary">${product.price.toFixed(2)}</Badge>
                          {product.collection && <Badge>{product.collection}</Badge>}
                          {product.attributes.length > 0 && (
                            <Badge variant="secondary">
                              <Layers className="w-3 h-3 mr-1" />
                              {product.attributes.length} {text.attributes}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {canEdit && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirmProduct(product.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{text.variants}</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>{text.price}</TableHead>
                          <TableHead>{text.stock}</TableHead>
                          {canEdit && <TableHead>{text.actions}</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {product.variants.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center text-muted-foreground py-8"
                            >
                              {language === 'fr'
                                ? 'Aucune variante. Cliquez sur "Ajouter une Variante" ci-dessous.'
                                : 'No variants. Click "Add Variant" below.'}
                            </TableCell>
                          </TableRow>
                        ) : (
                          product.variants.map((variant) => (
                            <TableRow key={variant.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{variant.name}</p>
                                  {Object.keys(variant.attributes).length > 0 && (
                                    <div className="flex gap-1 mt-1 flex-wrap">
                                      {Object.entries(variant.attributes).map(([key, value]) => (
                                        <Badge key={key} variant="outline" className="text-xs">
                                          {key}: {value}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-muted-foreground">{variant.sku}</TableCell>
                              <TableCell>${variant.price.toFixed(2)}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    variant.stock === 0
                                      ? 'destructive'
                                      : variant.stock <= variant.lowStockThreshold
                                        ? 'outline'
                                        : 'default'
                                  }
                                >
                                  {variant.stock === 0 ? (
                                    <XCircle className="w-3 h-3 mr-1" />
                                  ) : variant.stock <= variant.lowStockThreshold ? (
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                  ) : (
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                  )}
                                  {variant.stock}
                                </Badge>
                              </TableCell>
                              {canEdit && (
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditVariant(product, variant)}
                                    >
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                    {canDelete && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          setDeleteConfirmVariant({
                                            productId: product.id,
                                            variantId: variant.id,
                                          })
                                        }
                                      >
                                        <Trash2 className="w-3 h-3 text-destructive" />
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              )}
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                    {canCreate && (
                      <div className="mt-4 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenAddVariant(product)}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {text.addVariant}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Product Modal */}
        <Dialog open={showEditProductModal} onOpenChange={setShowEditProductModal}>
          <DialogContent className="liquid-card max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{text.editProduct}</DialogTitle>
              <DialogDescription>
                {language === 'fr'
                  ? 'Modifiez les informations du produit et ses attributs.'
                  : 'Edit product information and its attributes.'}
              </DialogDescription>
            </DialogHeader>
            {editingProduct && (
              <div className="space-y-4">
                <div>
                  <Label>{text.name} *</Label>
                  <Input
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{text.description}</Label>
                  <Textarea
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>SKU *</Label>
                    <Input
                      value={editingProduct.sku}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, sku: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>{text.price} *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{text.category} *</Label>
                    <Select
                      value={editingProduct.categoryId}
                      onValueChange={(value) =>
                        setEditingProduct({ ...editingProduct, categoryId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getAllCategories(categories).map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{text.collection}</Label>
                    <Input
                      value={editingProduct.collection || ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, collection: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Product Attributes Section */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium mb-2">{text.productAttributes}</h3>

                  {/* Add attribute form */}
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder={text.attributeName}
                      value={newProductAttribute.name}
                      onChange={(e) =>
                        setNewProductAttribute({ ...newProductAttribute, name: e.target.value })
                      }
                      className="flex-1"
                    />
                    <Input
                      placeholder={text.attributeValues}
                      value={newProductAttribute.values}
                      onChange={(e) =>
                        setNewProductAttribute({ ...newProductAttribute, values: e.target.value })
                      }
                      className="flex-1"
                    />
                    <Button onClick={handleAddEditProductAttribute} variant="outline" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Display added attributes */}
                  {editingProduct.attributes.length > 0 && (
                    <div className="space-y-2">
                      {editingProduct.attributes.map((attr) => (
                        <div
                          key={attr.id}
                          className="flex items-center justify-between p-2 bg-muted rounded"
                        >
                          <div>
                            <span className="font-medium">{attr.name}:</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {attr.values.join(', ')}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveEditProductAttribute(attr.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveEditProduct} className="flex-1">
                    {text.save}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowEditProductModal(false)}
                    className="flex-1"
                  >
                    {text.cancel}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Variant Modal */}
        <Dialog open={showAddVariantModal} onOpenChange={setShowAddVariantModal}>
          <DialogContent className="liquid-card max-w-lg">
            <DialogHeader>
              <DialogTitle>{text.addVariant}</DialogTitle>
              <DialogDescription>
                {addingVariantProduct
                  ? `${text.product}: ${addingVariantProduct.name}`
                  : language === 'fr'
                    ? 'Créez une nouvelle variante pour ce produit.'
                    : 'Create a new variant for this product.'}
              </DialogDescription>
            </DialogHeader>
            {addingVariantProduct && (
              <div className="space-y-4">
                {/* Variant Attributes */}
                <div>
                  <h3 className="font-medium mb-3">{text.variantAttributes}</h3>
                  <div className="space-y-3">
                    {addingVariantProduct.attributes.map((attr) => (
                      <div key={attr.id}>
                        <Label>{attr.name}</Label>
                        <Select
                          value={newVariant.attributes[attr.name] || ''}
                          onValueChange={(value) =>
                            setNewVariant({
                              ...newVariant,
                              attributes: { ...newVariant.attributes, [attr.name]: value },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={text.selectAttributeValue} />
                          </SelectTrigger>
                          <SelectContent>
                            {attr.values.map((value) => (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optional fields */}
                <div>
                  <Label>
                    {text.name} ({language === 'fr' ? 'optionnel' : 'optional'})
                  </Label>
                  <Input
                    value={newVariant.name}
                    onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                    placeholder={generateVariantName(
                      addingVariantProduct.name,
                      newVariant.attributes,
                    )}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === 'fr'
                      ? 'Laissez vide pour générer automatiquement'
                      : 'Leave empty to auto-generate'}
                  </p>
                </div>

                <div>
                  <Label>SKU ({language === 'fr' ? 'optionnel' : 'optional'})</Label>
                  <Input
                    value={newVariant.sku}
                    onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                    placeholder={generateVariantSku(
                      addingVariantProduct.sku,
                      newVariant.attributes,
                    )}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === 'fr'
                      ? 'Laissez vide pour générer automatiquement'
                      : 'Leave empty to auto-generate'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{text.price}</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newVariant.price}
                      onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>{text.lowStockThreshold}</Label>
                    <Input
                      type="number"
                      value={newVariant.lowStockThreshold}
                      onChange={(e) =>
                        setNewVariant({ ...newVariant, lowStockThreshold: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddVariant} className="flex-1">
                    {text.createVariant}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddVariantModal(false)}
                    className="flex-1"
                  >
                    {text.cancel}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Variant Modal */}
        <Dialog open={showEditVariantModal} onOpenChange={setShowEditVariantModal}>
          <DialogContent className="liquid-card max-w-lg">
            <DialogHeader>
              <DialogTitle>{text.editVariant}</DialogTitle>
              <DialogDescription>
                {language === 'fr'
                  ? 'Modifiez les informations de cette variante.'
                  : 'Edit this variant information.'}
              </DialogDescription>
            </DialogHeader>
            {editingVariant && (
              <div className="space-y-4">
                <div>
                  <Label>{text.name}</Label>
                  <Input
                    value={editingVariant.variant.name}
                    onChange={(e) =>
                      setEditingVariant({
                        ...editingVariant,
                        variant: { ...editingVariant.variant, name: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>SKU</Label>
                  <Input
                    value={editingVariant.variant.sku}
                    onChange={(e) =>
                      setEditingVariant({
                        ...editingVariant,
                        variant: { ...editingVariant.variant, sku: e.target.value },
                      })
                    }
                  />
                </div>

                {/* Variant Attributes */}
                <div>
                  <h3 className="font-medium mb-3">{text.variantAttributes}</h3>
                  <div className="space-y-3">
                    {editingVariant.product.attributes.map((attr) => (
                      <div key={attr.id}>
                        <Label>{attr.name}</Label>
                        <Select
                          value={editingVariant.variant.attributes[attr.name] || ''}
                          onValueChange={(value) =>
                            setEditingVariant({
                              ...editingVariant,
                              variant: {
                                ...editingVariant.variant,
                                attributes: {
                                  ...editingVariant.variant.attributes,
                                  [attr.name]: value,
                                },
                              },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={text.selectAttributeValue} />
                          </SelectTrigger>
                          <SelectContent>
                            {attr.values.map((value) => (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{text.price}</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingVariant.variant.price}
                      onChange={(e) =>
                        setEditingVariant({
                          ...editingVariant,
                          variant: {
                            ...editingVariant.variant,
                            price: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>{text.lowStockThreshold}</Label>
                    <Input
                      type="number"
                      value={editingVariant.variant.lowStockThreshold}
                      onChange={(e) =>
                        setEditingVariant({
                          ...editingVariant,
                          variant: {
                            ...editingVariant.variant,
                            lowStockThreshold: parseInt(e.target.value) || 5,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveEditVariant} className="flex-1">
                    {text.save}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowEditVariantModal(false)}
                    className="flex-1"
                  >
                    {text.cancel}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Product Confirmation */}
        <AlertDialog
          open={!!deleteConfirmProduct}
          onOpenChange={() => setDeleteConfirmProduct(null)}
        >
          <AlertDialogContent className="liquid-card">
            <AlertDialogHeader>
              <AlertDialogTitle>{text.deleteProduct}</AlertDialogTitle>
              <AlertDialogDescription>{text.deleteProductConfirm}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{text.cancel}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteConfirmProduct && handleDeleteProduct(deleteConfirmProduct)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {text.delete}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Variant Confirmation */}
        <AlertDialog
          open={!!deleteConfirmVariant}
          onOpenChange={() => setDeleteConfirmVariant(null)}
        >
          <AlertDialogContent className="liquid-card">
            <AlertDialogHeader>
              <AlertDialogTitle>{text.deleteVariant}</AlertDialogTitle>
              <AlertDialogDescription>{text.deleteVariantConfirm}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{text.cancel}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  deleteConfirmVariant &&
                  handleDeleteVariant(
                    deleteConfirmVariant.productId,
                    deleteConfirmVariant.variantId,
                  )
                }
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {text.delete}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

  // Render Stock Section
  const renderStockSection = () => {
    const allVariants = products.flatMap((p) =>
      p.variants.map((v) => ({
        ...v,
        productName: p.name,
      })),
    );
    const filteredVariants = allVariants.filter(
      (v) =>
        v.name.toLowerCase().includes(stockSearch.toLowerCase()) ||
        v.sku.toLowerCase().includes(stockSearch.toLowerCase()),
    );

    const lowStockCount = allVariants.filter(
      (v) => v.stock > 0 && v.stock <= v.lowStockThreshold,
    ).length;
    const outOfStockCount = allVariants.filter((v) => v.stock === 0).length;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="liquid-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Total Variantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-foreground">{allVariants.length}</p>
            </CardContent>
          </Card>
          <Card className="liquid-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                {text.lowStock}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-foreground">{lowStockCount}</p>
            </CardContent>
          </Card>
          <Card className="liquid-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-destructive" />
                {text.outOfStock}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-foreground">{outOfStockCount}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="liquid-card no-hover border-0">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={stockSearch}
                onChange={(e) => setStockSearch(e.target.value)}
                placeholder={text.search}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{text.variants}</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>{text.currentStock}</TableHead>
                  <TableHead>Seuil</TableHead>
                  <TableHead>{text.lastUpdated}</TableHead>
                  <TableHead>{text.updatedBy}</TableHead>
                  <TableHead>{text.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVariants.map((variant) => (
                  <TableRow key={variant.id}>
                    <TableCell className="font-medium">{variant.name}</TableCell>
                    <TableCell className="text-muted-foreground">{variant.sku}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          variant.stock === 0
                            ? 'destructive'
                            : variant.stock <= variant.lowStockThreshold
                              ? 'outline'
                              : 'default'
                        }
                      >
                        {variant.stock === 0 ? (
                          <XCircle className="w-3 h-3 mr-1" />
                        ) : variant.stock <= variant.lowStockThreshold ? (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        ) : (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        )}
                        {variant.stock}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {variant.lowStockThreshold}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {variant.lastUpdated}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {variant.updatedBy}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setShowStockHistory(showStockHistory === variant.id ? null : variant.id)
                          }
                        >
                          <History className="w-3 h-3" />
                        </Button>
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const product = products.find((p) => p.id === variant.productId);
                              if (product) {
                                setStockAdjustment({
                                  ...stockAdjustment,
                                  productId: product.id,
                                  variantId: variant.id,
                                });
                                setShowAdjustStockModal(true);
                              }
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Adjust Stock Modal */}
        <Dialog open={showAdjustStockModal} onOpenChange={setShowAdjustStockModal}>
          <DialogContent className="liquid-card">
            <DialogHeader>
              <DialogTitle>{text.adjustStock}</DialogTitle>
              <DialogDescription>
                {language === 'fr'
                  ? 'Ajustez le stock de cette variante et indiquez la raison.'
                  : 'Adjust the stock for this variant and provide a reason.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{text.action}</Label>
                <Select
                  value={stockAdjustment.action}
                  onValueChange={(value: any) =>
                    setStockAdjustment({ ...stockAdjustment, action: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">{text.addStock}</SelectItem>
                    <SelectItem value="remove">{text.removeStock}</SelectItem>
                    <SelectItem value="set">{text.setStock}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{text.quantity}</Label>
                <Input
                  type="number"
                  value={stockAdjustment.quantity}
                  onChange={(e) =>
                    setStockAdjustment({ ...stockAdjustment, quantity: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>{text.reason}</Label>
                <Textarea
                  value={stockAdjustment.reason}
                  onChange={(e) =>
                    setStockAdjustment({ ...stockAdjustment, reason: e.target.value })
                  }
                  placeholder="Ex: Réapprovisionnement fournisseur"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAdjustStock} className="flex-1">
                  {text.save}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAdjustStockModal(false)}
                  className="flex-1"
                >
                  {text.cancel}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  return (
    <div className="p-6">
      {section === 'categories' && renderCategoriesSection()}
      {section === 'products' && renderProductsSection()}
      {section === 'stock' && renderStockSection()}
    </div>
  );
}
