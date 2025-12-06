import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { ArrowLeft, Plus, X, Store, Globe, Info } from 'lucide-react';
import type { ShopRole, CreateShopFormData } from '../lib/shops/types';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { translations } from '../lib/translations';
import { toast } from 'sonner';
import { ShopsHeader } from '../components/shops/ShopsHeader';
import { useTheme } from '../contexts/ThemeContext';
import { createShop } from '../lib/shops/shopService';

const currencies = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
];

const timezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Toronto', label: 'Toronto (ET)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
  { value: 'de', label: 'Deutsch' },
];

export function meta() {
  return [
    { title: 'Create Shop - shopifake' },
    { name: 'description', content: 'Create a new online store' },
  ];
}

export default function CreateShopRoute() {
  const navigate = useNavigate();
  const { theme, setTheme, language, setLanguage } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const [formData, setFormData] = useState<CreateShopFormData>({
    name: '',
    domain: '',
    description: '',
    collaborators: [],
    currency: 'USD',
    timezone: 'America/New_York',
    language: 'en'
  });

  const [collaboratorInput, setCollaboratorInput] = useState({
    email: '',
    role: 'manager' as ShopRole
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check authentication on mount
  useEffect(() => {
    const user = localStorage.getItem('shopifake_user');
    const authTime = localStorage.getItem('shopifake_auth_time');

    if (user && authTime) {
      const authDate = parseInt(authTime);
      const now = Date.now();

      if (now - authDate < 600000) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('shopifake_user');
        localStorage.removeItem('shopifake_auth_time');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const validateDomain = (domain: string): boolean => {
    const domainRegex = /^[a-z0-9-]+$/;
    return domainRegex.test(domain);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddCollaborator = () => {
    const newErrors: Record<string, string> = {};

    if (!collaboratorInput.email) {
      newErrors.collaboratorEmail = t.validation.emailInvalid;
    } else if (!validateEmail(collaboratorInput.email)) {
      newErrors.collaboratorEmail = t.validation.emailInvalid;
    } else if (formData.collaborators.some(c => c.email === collaboratorInput.email)) {
      newErrors.collaboratorEmail = language === 'en' ? 'Email already added' : 'Email déjà ajouté';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setFormData({
      ...formData,
      collaborators: [
        ...formData.collaborators,
        {
          email: collaboratorInput.email,
          role: collaboratorInput.role,
          addedAt: new Date().toISOString()
        }
      ]
    });

    setCollaboratorInput({ email: '', role: 'manager' });
    setErrors({});
  };

  const handleRemoveCollaborator = (email: string) => {
    setFormData({
      ...formData,
      collaborators: formData.collaborators.filter(c => c.email !== email)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t.validation.nameRequired;
    }

    if (!formData.domain.trim()) {
      newErrors.domain = t.validation.domainRequired;
    } else if (!validateDomain(formData.domain)) {
      newErrors.domain = t.validation.domainInvalid;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error(t.error);
      return;
    }

    setIsCreating(true);
    
    // Simulate API call
    setTimeout(() => {
      try {
        const newShop = createShop(formData);
        toast.success(t.success);
        navigate(`/shops/${newShop.id}/dashboard`);
      } catch {
        toast.error(t.error);
        setIsCreating(false);
      }
    }, 1000);
  };

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const t = translations[language].shops.createShop;
  const tMyShops = translations[language].shops.myShops;

  return (
    <div className="min-h-screen bg-background/95 backdrop-blur-xl relative">
      <ShopsHeader 
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
      />
      
      {/* Liquid Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="liquid-blob liquid-blob-1" />
        <div className="liquid-blob liquid-blob-2" />
        <div className="liquid-blob liquid-blob-3" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/shops')}
            variant="ghost"
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToShops}
          </Button>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-foreground">{t.title}</h1>
            </div>
          </div>
          <p className="text-muted-foreground text-lg">{t.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="liquid-card p-6">
            <h2 className="text-foreground mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              {t.basicInfo}
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{t.shopName}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setErrors({ ...errors, name: '' });
                  }}
                  placeholder={t.shopNamePlaceholder}
                  className={errors.name ? 'border-red-500' : ''}
                />
                <p className="text-xs text-muted-foreground mt-1">{t.shopNameHint}</p>
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="domain">{t.domain}</Label>
                <div className="flex gap-2">
                  <Input
                    id="domain"
                    value={formData.domain}
                    onChange={(e) => {
                      setFormData({ ...formData, domain: e.target.value.toLowerCase() });
                      setErrors({ ...errors, domain: '' });
                    }}
                    placeholder={t.domainPlaceholder}
                    className={`flex-1 ${errors.domain ? 'border-red-500' : ''}`}
                  />
                  <div className="ios-surface px-4 py-2 rounded-lg flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{t.domainSuffix}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{t.domainHint}</p>
                {errors.domain && <p className="text-xs text-red-500 mt-1">{errors.domain}</p>}
              </div>

              <div>
                <Label htmlFor="description">{t.description}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t.descriptionPlaceholder}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">{t.descriptionHint}</p>
              </div>
            </div>
          </Card>

          {/* Shop Settings */}
          <Card className="liquid-card p-6">
            <h2 className="text-foreground mb-6">{t.settings}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="currency">{t.currency}</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timezone">{t.timezone}</Label>
                <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language">{t.language}</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Collaborators */}
          <Card className="liquid-card p-6">
            <div className="mb-4">
              <h2 className="text-foreground mb-1">{t.collaborators}</h2>
              <p className="text-sm text-muted-foreground">{t.collaboratorsDesc}</p>
            </div>

            <div className="space-y-4">
              {/* Add Collaborator Form */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    value={collaboratorInput.email}
                    onChange={(e) => {
                      setCollaboratorInput({ ...collaboratorInput, email: e.target.value });
                      setErrors({ ...errors, collaboratorEmail: '' });
                    }}
                    placeholder={t.emailPlaceholder}
                    type="email"
                    className={errors.collaboratorEmail ? 'border-red-500' : ''}
                  />
                  {errors.collaboratorEmail && (
                    <p className="text-xs text-red-500 mt-1">{errors.collaboratorEmail}</p>
                  )}
                </div>
                
                <Select
                  value={collaboratorInput.role}
                  onValueChange={(value: ShopRole) => setCollaboratorInput({ ...collaboratorInput, role: value })}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{tMyShops.roleAdmin}</SelectItem>
                    <SelectItem value="manager">{tMyShops.roleManager}</SelectItem>
                    <SelectItem value="reader">{tMyShops.roleReader}</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  onClick={handleAddCollaborator}
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Role Descriptions */}
              <div className="ios-surface p-4 rounded-lg space-y-2">
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Admin:</span> {t.roleDescriptions.admin}
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Manager:</span> {t.roleDescriptions.manager}
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Reader:</span> {t.roleDescriptions.reader}
                </div>
              </div>

              {/* Collaborators List */}
              {formData.collaborators.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t.noCollaborators}
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.collaborators.map((collaborator) => {
                    const roleKey = `role${collaborator.role.charAt(0).toUpperCase() + collaborator.role.slice(1)}` as keyof typeof tMyShops;
                    return (
                      <div
                        key={collaborator.email}
                        className="ios-surface p-3 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{collaborator.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {tMyShops[roleKey]}
                          </Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveCollaborator(collaborator.email)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/shops')}
              disabled={isCreating}
            >
              {t.cancel}
            </Button>
            <Button
              type="submit"
              className="liquid-button"
              disabled={isCreating}
            >
              {isCreating ? t.creating : t.createButton}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
