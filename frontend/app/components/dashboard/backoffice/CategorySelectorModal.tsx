import { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import {
  ChevronLeft,
  ChevronRight,
  Folder,
  FolderOpen,
  Check,
  Loader2,
} from 'lucide-react';
import {
  fetchRootCategories,
  fetchCategoryChildren,
} from '../../../clients/storefrontApiClient';
import type { CategoryDTO } from '../../../lib/storefront/dto';

interface CategorySelectorModalProps {
  language: 'en' | 'fr';
  shopId: number;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (categoryId: number, categoryName: string) => void;
  selectedCategoryId?: number;
}

export function CategorySelectorModal({
  language,
  shopId,
  isOpen,
  onClose,
  onSelect,
  selectedCategoryId,
}: CategorySelectorModalProps) {
  const [navigationStack, setNavigationStack] = useState<(number | null)[]>([null]);
  const currentParentId = navigationStack[navigationStack.length - 1];

  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [childrenCache, setChildrenCache] = useState<Record<number, CategoryDTO[]>>({});

  const text = {
    en: {
      title: 'Select a Category',
      back: 'Back',
      select: 'Select',
      rootLevel: 'Root Categories',
      loading: 'Loading categories...',
      error: 'Error loading categories',
      noCategories: 'No categories available',
      close: 'Close',
    },
    fr: {
      title: 'Sélectionner une Catégorie',
      back: 'Retour',
      select: 'Sélectionner',
      rootLevel: 'Catégories Racines',
      loading: 'Chargement des catégories...',
      error: 'Erreur lors du chargement des catégories',
      noCategories: 'Aucune catégorie disponible',
      close: 'Fermer',
    },
  };

  const t = text[language];

  // Load categories for current level
  useEffect(() => {
    if (!isOpen) return;

    const loadCategories = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (currentParentId === null) {
          const rootCategories = await fetchRootCategories(shopId);
          setCategories(rootCategories);
        } else {
          if (childrenCache[currentParentId]) {
            setCategories(childrenCache[currentParentId]);
            setIsLoading(false);
          } else {
            const children = await fetchCategoryChildren(shopId, currentParentId);
            setCategories(children);
            setChildrenCache(prev => ({ ...prev, [currentParentId]: children }));
          }
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
        setError(err instanceof Error ? err.message : t.error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId, currentParentId, isOpen]);

  const handleNavigate = (categoryId: number) => {
    setNavigationStack([...navigationStack, categoryId]);
  };

  const handleBack = () => {
    if (navigationStack.length > 1) {
      setNavigationStack(navigationStack.slice(0, -1));
    }
  };

  const handleSelect = (category: CategoryDTO) => {
    onSelect(category.id, category.label);
    onClose();
  };

  const hasChildren = (categoryId: number): boolean => {
    return childrenCache[categoryId]?.length > 0;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="liquid-card w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t.title}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              {t.close}
            </Button>
          </div>
          {navigationStack.length > 1 && (
            <Button variant="outline" size="sm" onClick={handleBack} className="mt-2 w-fit">
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t.back}
            </Button>
          )}
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto space-y-3">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
              <span className="text-muted-foreground">{t.loading}</span>
            </div>
          )}

          {error && (
            <div className="text-center text-red-500 py-4">{error}</div>
          )}

          {!isLoading && !error && categories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">{t.noCategories}</div>
          )}

          {!isLoading && !error && categories.map((category) => (
            <div
              key={category.id}
              className="ios-surface p-4 rounded-lg flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                {hasChildren(category.id) ? (
                  <FolderOpen className="w-5 h-5 text-primary" />
                ) : (
                  <Folder className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <div className="font-medium">{category.label}</div>
                  <div className="text-xs text-muted-foreground">{category.slug}</div>
                </div>
                {selectedCategoryId === category.id && (
                  <Check className="w-5 h-5 text-primary ml-2" />
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelect(category)}
                >
                  {t.select}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigate(category.id)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
