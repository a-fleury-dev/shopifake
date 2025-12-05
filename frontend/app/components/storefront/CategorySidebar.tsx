import { useState } from 'react';
import type { Category } from '../../lib/types/storefront';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
  allCategoriesLabel: string;
  language?: 'en' | 'fr';
}

export function CategorySidebar({ 
  categories, 
  selectedCategoryId, 
  onSelectCategory, 
  allCategoriesLabel,
  language = 'en'
}: CategorySidebarProps) {
  const [navigationStack, setNavigationStack] = useState<number[]>([]);

  const currentParentId = navigationStack.length > 0 ? navigationStack[navigationStack.length - 1] : null;

  const getCurrentCategories = (): Category[] => {
    if (currentParentId === null) {
      return categories
        .filter(cat => !cat.parentId)
        .sort((a, b) => a.position - b.position);
    } else {
      return categories
        .filter(cat => cat.parentId === currentParentId)
        .sort((a, b) => a.position - b.position);
    }
  };

  const getAllSubcategoryIds = (parentId: number): number[] => {
    const ids: number[] = [];
    const subcats = categories.filter(cat => cat.parentId === parentId);
    subcats.forEach(subcat => {
      ids.push(subcat.id);
      ids.push(...getAllSubcategoryIds(subcat.id));
    });
    return ids;
  };

  const hasSubcategories = (categoryId: number): boolean => {
    return categories.some(cat => cat.parentId === categoryId);
  };

  const navigateInto = (categoryId: number) => {
    setNavigationStack([...navigationStack, categoryId]);
  };

  const navigateBack = () => {
    setNavigationStack(navigationStack.slice(0, -1));
  };

  const handleCategoryClick = (category: Category) => {
    onSelectCategory(category.id);
    
    if (hasSubcategories(category.id)) {
      navigateInto(category.id);
    }
  };

  const currentParentCategory = currentParentId 
    ? categories.find(cat => cat.id === currentParentId)
    : null;

  const isCategoryOrDescendantSelected = (categoryId: number): boolean => {
    if (selectedCategoryId === categoryId) return true;
    const descendantIds = getAllSubcategoryIds(categoryId);
    return selectedCategoryId !== null && descendantIds.includes(selectedCategoryId);
  };

  const currentCategories = getCurrentCategories();

  return (
    <div className="h-full flex flex-col">
      {/* Header with back button */}
      <div className="p-4 border-b border-border/30">
        {currentParentCategory ? (
          <button
            onClick={navigateBack}
            className="flex items-center gap-3 w-full text-left hover:bg-muted/50 p-3 rounded-xl transition-colors ios-surface"
          >
            <ChevronLeft className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                {language === 'fr' ? 'Retour' : 'Back'}
              </div>
              <div className="font-semibold truncate text-foreground">{currentParentCategory.label}</div>
            </div>
          </button>
        ) : (
          <h2 className="font-semibold">
            {language === 'fr' ? 'Catégories' : 'Categories'}
          </h2>
        )}
      </div>

      {/* Categories list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {navigationStack.length === 0 && (
          <button
            onClick={() => {
              onSelectCategory(null);
              setNavigationStack([]);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between ${
              selectedCategoryId === null
                ? 'liquid-button text-primary-foreground'
                : 'ios-surface hover:bg-muted'
            }`}
          >
            <span className="font-medium">{allCategoriesLabel}</span>
          </button>
        )}

        {currentCategories.map(category => {
          const hasSubs = hasSubcategories(category.id);
          const isSelected = selectedCategoryId === category.id;
          const hasSelectedDescendant = isCategoryOrDescendantSelected(category.id);

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between ${
                isSelected
                  ? 'liquid-button text-primary-foreground'
                  : hasSelectedDescendant
                  ? 'bg-muted font-medium'
                  : 'ios-surface hover:bg-muted'
              }`}
            >
              <span>{category.label}</span>
              {hasSubs && (
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              )}
            </button>
          );
        })}

        {currentCategories.length === 0 && navigationStack.length > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">
              {language === 'fr' ? 'Aucune sous-catégorie' : 'No subcategories'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
