import { useState, useMemo } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Folder,
  FolderOpen,
} from 'lucide-react';
import {
  mockCategories,
  getCategoryChildren,
  getCategoryById,
  hasProductsInCategory,
} from '../../../lib/mock/backoffice-data';
import type { Category } from '../../../lib/types/backoffice';

interface CategoriesViewProps {
  language: 'en' | 'fr';
  currentUser: any;
}

export function CategoriesView({ language }: CategoriesViewProps) {
  // Navigation state (like storefront sidebar)
  const [navigationStack, setNavigationStack] = useState<(number | null)[]>([null]);
  const currentParentId = navigationStack[navigationStack.length - 1];

  // CRUD state
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryLabel, setNewCategoryLabel] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState('');

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
      delete: 'Delete',
      cannotDelete: 'Cannot delete: category contains products',
      rootLevel: 'Root Categories',
      empty: 'No categories at this level. Click "Add Category" to create one.',
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
      delete: 'Supprimer',
      cannotDelete: 'Impossible de supprimer : la catégorie contient des produits',
      rootLevel: 'Catégories Racines',
      empty: 'Aucune catégorie à ce niveau. Cliquez sur "Ajouter une Catégorie" pour en créer une.',
    },
  };

  const t = text[language];

  // Get current level categories
  const currentCategories = useMemo(
    () => getCategoryChildren(currentParentId),
    [currentParentId],
  );

  // Get breadcrumb path
  const breadcrumb = useMemo(() => {
    const path: Category[] = [];
    for (let i = 1; i < navigationStack.length; i++) {
      const cat = getCategoryById(navigationStack[i] as number);
      if (cat) path.push(cat);
    }
    return path;
  }, [navigationStack]);

  const handleNavigate = (categoryId: number) => {
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

  const handleAddCategory = () => {
    if (!newCategoryLabel.trim()) return;

    // TODO: Call API to create category
    console.log('Creating category:', {
      label: newCategoryLabel,
      parentId: currentParentId,
    });

    setNewCategoryLabel('');
    setIsAdding(false);
  };

  const handleEditCategory = (category: Category) => {
    setEditingId(category.id);
    setEditLabel(category.label);
  };

  const handleSaveEdit = () => {
    if (!editLabel.trim() || editingId === null) return;

    // TODO: Call API to update category
    console.log('Updating category:', {
      id: editingId,
      label: editLabel,
    });

    setEditingId(null);
    setEditLabel('');
  };

  const handleDeleteCategory = (category: Category) => {
    if (hasProductsInCategory(category.id)) {
      alert(t.cannotDelete);
      return;
    }

    // TODO: Call API to delete category
    console.log('Deleting category:', category.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-foreground">{t.title}</h1>
        <Button onClick={() => setIsAdding(true)} className="liquid-button">
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
          {/* Add new category form */}
          {isAdding && (
            <div className="p-4 bg-muted/30 rounded-lg space-y-3">
              <Label htmlFor="newCategory">{t.newCategory}</Label>
              <div className="flex gap-2">
                <Input
                  id="newCategory"
                  value={newCategoryLabel}
                  onChange={(e) => setNewCategoryLabel(e.target.value)}
                  placeholder={t.categoryName}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddCategory();
                    if (e.key === 'Escape') setIsAdding(false);
                  }}
                />
                <Button onClick={handleAddCategory} size="sm">
                  <Save className="w-4 h-4 mr-1" />
                  {t.save}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsAdding(false)}>
                  <X className="w-4 h-4 mr-1" />
                  {t.cancel}
                </Button>
              </div>
            </div>
          )}

          {/* Categories list */}
          {currentCategories.length === 0 && !isAdding && (
            <div className="text-center py-8 text-muted-foreground">{t.empty}</div>
          )}

          {currentCategories.map((category) => (
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
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                  />
                  <Button onClick={handleSaveEdit} size="sm">
                    <Save className="w-4 h-4 mr-1" />
                    {t.save}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                    <X className="w-4 h-4 mr-1" />
                    {t.cancel}
                  </Button>
                </div>
              ) : (
                // Display mode
                <>
                  <div className="flex items-center gap-3 flex-1">
                    {getCategoryChildren(category.id).length > 0 ? (
                      <FolderOpen className="w-5 h-5 text-primary" />
                    ) : (
                      <Folder className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div>
                      <div className="font-medium">{category.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {category.slug} • Position: {category.position}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getCategoryChildren(category.id).length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleNavigate(category.id)}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(category)}
                      disabled={hasProductsInCategory(category.id)}
                    >
                      <Trash2
                        className={`w-4 h-4 ${
                          hasProductsInCategory(category.id)
                            ? 'text-muted-foreground'
                            : 'text-destructive'
                        }`}
                      />
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
