import { useState, useMemo, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit2,
  Save,
  X,
  Folder,
  FolderOpen,
  Loader2,
} from 'lucide-react';
import {
  fetchRootCategories,
  fetchCategoryChildren,
  fetchCategoryById,
  createCategory,
  updateCategory,
} from '../../../clients/storefrontApiClient';
import type { CategoryDTO } from '../../../lib/storefront/dto';

interface CategoriesViewProps {
  language: 'en' | 'fr';
  currentUser: any;
  shopId?: number;
}

export function CategoriesView({ language, shopId }: CategoriesViewProps) {
  // Navigation state (like storefront sidebar)
  const [navigationStack, setNavigationStack] = useState<(number | null)[]>([null]);
  const currentParentId = navigationStack[navigationStack.length - 1];

  // Data state
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [childrenCache, setChildrenCache] = useState<Record<number, CategoryDTO[]>>({});

  // CRUD state
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryLabel, setNewCategoryLabel] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const text = {
    en: {
      title: 'Categories',
      back: 'Back',
      addCategory: 'Add Category',
      newCategory: 'New Category',
      categoryName: 'Category Name',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      rootLevel: 'Root Categories',
      empty: 'No categories at this level. Click "Add Category" to create one.',
      loading: 'Loading categories...',
      error: 'Error loading categories',
      noShop: 'No shop selected',
      hasChildren: 'Has subcategories',
    },
    fr: {
      title: 'Catégories',
      back: 'Retour',
      addCategory: 'Ajouter une Catégorie',
      newCategory: 'Nouvelle Catégorie',
      categoryName: 'Nom de la Catégorie',
      save: 'Enregistrer',
      cancel: 'Annuler',
      edit: 'Modifier',
      rootLevel: 'Catégories Racines',
      empty: 'Aucune catégorie à ce niveau. Cliquez sur "Ajouter une Catégorie" pour en créer une.',
      loading: 'Chargement des catégories...',
      error: 'Erreur lors du chargement des catégories',
      noShop: 'Aucune boutique sélectionnée',
      hasChildren: 'A des sous-catégories',
    },
  };

  const t = text[language];

  // Load categories for current level
  useEffect(() => {
    const loadCategories = async () => {
      if (!shopId) {
        setError('No shop selected');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        if (currentParentId === null) {
          // Load root categories
          const rootCategories = await fetchRootCategories(shopId);
          setCategories(rootCategories);
        } else {
          // Check cache first
          if (childrenCache[currentParentId]) {
            setCategories(childrenCache[currentParentId]);
            setIsLoading(false);
          } else {
            // Load children from API
            const children = await fetchCategoryChildren(shopId, currentParentId);
            setCategories(children);
            setChildrenCache(prev => ({ ...prev, [currentParentId]: children }));
          }
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
        setError(err instanceof Error ? err.message : 'Error loading categories');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId, currentParentId]);

  // Get breadcrumb path
  const breadcrumb = useMemo(() => {
    const path: CategoryDTO[] = [];
    for (let i = 1; i < navigationStack.length; i++) {
      const categoryId = navigationStack[i] as number;
      // Find category in cache or current categories
      const cat = categories.find(c => c.id === categoryId) || 
                  Object.values(childrenCache).flat().find(c => c.id === categoryId);
      if (cat) path.push(cat);
    }
    return path;
  }, [navigationStack, categories, childrenCache]);

  const handleNavigate = async (categoryId: number) => {
    setNavigationStack([...navigationStack, categoryId]);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleBack = () => {
    if (navigationStack.length > 1) {
      setNavigationStack(navigationStack.slice(0, -1));
      setIsAdding(false);
      setEditingId(null);
    }
  };

  const refreshCurrentLevel = async () => {
    if (!shopId) return;

    try {
      if (currentParentId === null) {
        const rootCategories = await fetchRootCategories(shopId);
        setCategories(rootCategories);
      } else {
        const children = await fetchCategoryChildren(shopId, currentParentId);
        setCategories(children);
        setChildrenCache(prev => ({ ...prev, [currentParentId]: children }));
      }
    } catch (err) {
      console.error('Failed to refresh categories:', err);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryLabel.trim() || !shopId || isSaving) return;

    setIsSaving(true);
    try {
      await createCategory(shopId, {
        label: newCategoryLabel,
        parentId: currentParentId,
      });

      setNewCategoryLabel('');
      setIsAdding(false);
      
      // Refresh the current level
      await refreshCurrentLevel();
    } catch (err) {
      console.error('Failed to create category:', err);
      alert(err instanceof Error ? err.message : 'Failed to create category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditCategory = (category: CategoryDTO) => {
    setEditingId(category.id);
    setEditLabel(category.label);
  };

  const handleSaveEdit = async () => {
    if (!editLabel.trim() || editingId === null || !shopId || isSaving) return;

    setIsSaving(true);
    try {
      // Find the category being edited to preserve its parentId and position
      const categoryToEdit = categories.find(c => c.id === editingId);
      if (!categoryToEdit) {
        throw new Error('Category not found');
      }

      await updateCategory(shopId, editingId, {
        label: editLabel,
        parentId: categoryToEdit.parentId,
        position: categoryToEdit.position,
      });

      setEditingId(null);
      setEditLabel('');
      
      // Refresh the current level
      await refreshCurrentLevel();
    } catch (err) {
      console.error('Failed to update category:', err);
      alert(err instanceof Error ? err.message : 'Failed to update category');
    } finally {
      setIsSaving(false);
    }
  };

  // Check if a category has children (for display purposes)
  const hasChildren = (categoryId: number): boolean => {
    return childrenCache[categoryId]?.length > 0;
  };

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-foreground">{t.title}</h1>
        <Card className="liquid-card">
          <CardContent className="p-6">
            <div className="text-center text-red-500">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-foreground">{t.title}</h1>
        <Button 
          onClick={() => setIsAdding(true)} 
          className="liquid-button"
          disabled={isLoading || !shopId}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t.addCategory}
        </Button>
      </div>

      <Card className="liquid-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {navigationStack.length > 1 && (
                <Button variant="outline" size="sm" onClick={handleBack}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  {t.back}
                </Button>
              )}
              <CardTitle className="flex items-center gap-2">
                {breadcrumb.length === 0 ? (
                  <span>{t.rootLevel}</span>
                ) : (
                  breadcrumb.map((cat, idx) => (
                    <span key={cat.id} className="flex items-center gap-2">
                      {idx > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                      <span>{cat.label}</span>
                    </span>
                  ))
                )}
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
              <span className="text-muted-foreground">{t.loading}</span>
            </div>
          )}

          {/* Add new category form */}
          {!isLoading && isAdding && (
            <div className="p-4 bg-muted/30 rounded-lg space-y-3">
              <Label htmlFor="newCategory">{t.newCategory}</Label>
              <div className="flex gap-2">
                <Input
                  id="newCategory"
                  value={newCategoryLabel}
                  onChange={(e) => setNewCategoryLabel(e.target.value)}
                  placeholder={t.categoryName}
                  disabled={isSaving}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddCategory();
                    if (e.key === 'Escape') setIsAdding(false);
                  }}
                />
                <Button onClick={handleAddCategory} size="sm" disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-1" />
                  )}
                  {t.save}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsAdding(false)}
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-1" />
                  {t.cancel}
                </Button>
              </div>
            </div>
          )}

          {/* Categories list */}
          {!isLoading && categories.length === 0 && !isAdding && (
            <div className="text-center py-8 text-muted-foreground">{t.empty}</div>
          )}

          {!isLoading && categories.map((category: CategoryDTO) => (
            <div
              key={category.id}
              className="ios-surface p-4 rounded-lg flex items-center justify-between"
            >
              {editingId === category.id ? (
                // Edit mode
                <div className="flex-1 flex gap-2">
                  <Input
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    disabled={isSaving}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                  />
                  <Button onClick={handleSaveEdit} size="sm" disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-1" />
                    )}
                    {t.save}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEditingId(null)}
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4 mr-1" />
                    {t.cancel}
                  </Button>
                </div>
              ) : (
                // Display mode
                <>
                  <div className="flex items-center gap-3 flex-1">
                    {hasChildren(category.id) ? (
                      <FolderOpen className="w-5 h-5 text-primary" />
                    ) : (
                      <Folder className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div>
                      <div className="font-medium">{category.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {category.slug}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleNavigate(category.id)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCategory(category)}
                      disabled={isSaving}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
