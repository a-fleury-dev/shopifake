import { useState } from 'react';
import { Tags, Plus, Edit, Trash2, Search, ChevronRight, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import type { CategoryHierarchy, BackOfficeUser } from './types';
import { mockCategories, roles } from './mockData';
import { backofficeTranslations } from './translations';

interface CategoriesViewProps {
  language: 'en' | 'fr';
  currentUser: BackOfficeUser;
}

export function CategoriesView({ language, currentUser }: CategoriesViewProps) {
  const [categories] = useState<CategoryHierarchy[]>(mockCategories);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [categorySearch, setCategorySearch] = useState('');

  const userRole = roles.find((r) => r.name === currentUser.role);
  const canEdit = userRole?.permissions.categories.update || false;
  const canCreate = userRole?.permissions.categories.create || false;
  const canDelete = userRole?.permissions.categories.delete || false;

  const text = backofficeTranslations[language];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  return (
    <div className="p-6">
      <Card className="liquid-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <Tags className="w-6 h-6 text-primary" />
              {text.categories}
            </CardTitle>
            {canCreate && (
              <Button className="liquid-button">
                <Plus className="w-4 h-4 mr-2" />
                {text.add}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={text.search}
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredCategories.map((category) => (
              <div key={category.id} className="ios-surface p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="p-1 hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      {expandedCategories[category.id] ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <Badge variant="secondary">
                      {category.productsCount} {text.productsCount}
                    </Badge>
                    {category.gender && <Badge variant="outline">{text[category.gender]}</Badge>}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {canEdit && (
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    {canDelete && (
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>

                {expandedCategories[category.id] && category.subCategories && (
                  <div className="mt-4 ml-8 space-y-2">
                    {category.subCategories.map((sub) => (
                      <div key={sub.id} className="p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{sub.name}</h4>
                            <p className="text-sm text-muted-foreground">{sub.description}</p>
                          </div>
                          {canEdit && (
                            <Button variant="ghost" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
