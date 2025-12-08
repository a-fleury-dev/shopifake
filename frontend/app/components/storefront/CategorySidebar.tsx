import type { Category } from '../../lib/types/storefront';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface CategorySidebarProps {
  categories: Category[];
  breadcrumb: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
  onNavigateToCategory: (categoryId: number | null) => void;
  allCategoriesLabel: string;
  language?: 'en' | 'fr';
}

export function CategorySidebar({ 
  categories, 
  breadcrumb,
  selectedCategoryId, 
  onSelectCategory,
  onNavigateToCategory,
  allCategoriesLabel,
  language = 'en'
}: CategorySidebarProps) {
  const currentParentCategory = breadcrumb.length > 0 ? breadcrumb[breadcrumb.length - 1] : null;

  const handleCategoryClick = (category: Category) => {
    // Select the category for product filtering
    onSelectCategory(category.id);
    // Navigate into the category to show its children
    onNavigateToCategory(category.id);
  };

  const handleBackClick = () => {
    // Navigate back to parent level
    if (breadcrumb.length > 1) {
      // Go to parent of current category
      onNavigateToCategory(breadcrumb[breadcrumb.length - 2].id);
    } else {
      // Go to root
      onNavigateToCategory(null);
    }
  };

  const sortedCategories = [...categories].sort((a, b) => a.position - b.position);

  return (
    <div className="h-full flex flex-col">
      {/* Header with back button */}
      <div className="p-4 border-b border-border/30">
        {currentParentCategory ? (
          <button
            onClick={handleBackClick}
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
        {breadcrumb.length === 0 && (
          <button
            onClick={() => {
              onSelectCategory(null);
              onNavigateToCategory(null);
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

        {sortedCategories.map(category => {
          const isSelected = selectedCategoryId === category.id;

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between ${
                isSelected
                  ? 'liquid-button text-primary-foreground'
                  : 'ios-surface hover:bg-muted'
              }`}
            >
              <span>{category.label}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </button>
          );
        })}

        {sortedCategories.length === 0 && breadcrumb.length > 0 && (
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
