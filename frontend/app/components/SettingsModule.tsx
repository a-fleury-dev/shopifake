import { useState, useEffect } from 'react';
import {
  Store,
  Globe,
  CreditCard,
  Truck,
  Bell,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Info,
  HelpCircle,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Separator } from './ui/separator';

interface SettingsModuleProps {
  language: 'en' | 'fr';
  initialSection?: 'store' | 'domains';
}

export function SettingsModule({ language, initialSection = 'store' }: SettingsModuleProps) {
  // Sync with initialSection when it changes (controlled by Dashboard)
  useEffect(() => {
    // This ensures the component updates when navigating between sections
  }, [initialSection]);

  // Store Information State
  const [storeName, setStoreName] = useState('Shopifake Store');
  const [storeDescription, setStoreDescription] = useState('Your one-stop shop for everything');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1441986300917-64674bd600d8');
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  // Domain State (single domain name)
  const [domainName, setDomainName] = useState('my-awesome-shop');
  const [isEditingDomain, setIsEditingDomain] = useState(false);
  const [domainError, setDomainError] = useState<string | null>(null);

  const text = {
    en: {
      // Navigation
      storeInfo: 'Store Information',
      domains: 'Domain',

      // Common
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      add: 'Add',

      // Store Information
      storeName: 'Store Name',
      storeNamePlaceholder: 'Enter store name',
      description: 'Description',
      descriptionPlaceholder: 'Enter store description',
      bannerUrl: 'Banner Image',
      bannerUrlPlaceholder: 'https://example.com/banner.jpg',
      selectBannerImage: 'Select Image',
      uploadingBanner: 'Uploading...',
      bannerImageSelected: 'Image selected',
      storeInfoTooltip:
        'Customize your store display name, description, and banner image',

      // Domains
      domainName: 'Domain Name',
      domainPlaceholder: 'my-shop-name',
      domainNote: 'This will be your store URL: ',
      domainError: 'This domain name is already taken',
      domainsTooltip:
        'Choose a unique domain name for your store. This cannot contain spaces or special characters.',

      // Payment Settings
      paymentGateway: 'Payment Gateway',
      selectGateway: 'Select payment gateway',
      apiKey: 'API Key',
      apiKeyPlaceholder: 'Enter your API key',
      secretKey: 'Secret Key',
      secretKeyPlaceholder: 'Enter your secret key',
      currency: 'Currency',
      selectCurrency: 'Select currency',
      paymentTooltip: 'Keep your API credentials secure. Never share them publicly.',

      // Shipping Settings
      shippingProvider: 'Shipping Provider',
      selectProvider: 'Select shipping provider',
      flatRate: 'Flat Rate',
      flatRatePlaceholder: '9.99',
      enableFreeShipping: 'Enable Free Shipping',
      freeShippingLabel: 'Offer free shipping on orders',
      shippingTooltip:
        'Configure your default shipping settings. You can override these per product.',

      // Notification Settings
      emailNotifications: 'Email Notifications',
      emailNotificationsLabel: 'Send email notifications',
      smsNotifications: 'SMS Notifications',
      smsNotificationsLabel: 'Send SMS notifications',
      senderEmail: 'Sender Email',
      senderEmailPlaceholder: 'noreply@example.com',
      notificationEvents: 'Notification Events',
      notificationEventsDesc: 'Choose which events trigger notifications',
      notificationsTooltip: 'Configure when and how you want to be notified about store events',

      // Notification Events
      newOrder: 'New Order Placed',
      paymentReceived: 'Payment Received',
      orderShipped: 'Order Shipped',
      productAdded: 'Product Added',
      productUpdated: 'Product Updated',
      stockChanged: 'Stock Level Changed',
      newCustomer: 'New Customer Registered',
      customerReview: 'Customer Left a Review',
      categoryAdded: 'Category Added',
      categoryUpdated: 'Category Updated',
      promotionCreated: 'Discount or Promotion Created',
    },
    fr: {
      // Navigation
      storeInfo: 'Informations du Magasin',
      domains: 'Domaine',

      // Common
      save: 'Enregistrer',
      cancel: 'Annuler',
      edit: 'Modifier',
      delete: 'Supprimer',
      add: 'Ajouter',

      // Store Information
      storeName: 'Nom du Magasin',
      storeNamePlaceholder: 'Entrez le nom du magasin',
      description: 'Description',
      descriptionPlaceholder: 'Entrez la description du magasin',
      bannerUrl: 'Image de Bannière',
      bannerUrlPlaceholder: 'https://exemple.com/banniere.jpg',
      selectBannerImage: 'Sélectionner une Image',
      uploadingBanner: 'Téléchargement...',
      bannerImageSelected: 'Image sélectionnée',
      storeInfoTooltip:
        'Personnalisez le nom d\'affichage, la description et la bannière de votre boutique',

      // Domains
      domainName: 'Nom de Domaine',
      domainPlaceholder: 'mon-nom-de-boutique',
      domainNote: 'Ceci sera l\'URL de votre boutique : ',
      domainError: 'Ce nom de domaine est déjà utilisé',
      domainsTooltip:
        'Choisissez un nom de domaine unique pour votre boutique. Pas d\'espaces ni de caractères spéciaux.',


    },
  };

  const t = text[language];

  // Domain handlers
  const handleSaveDomain = () => {
    // TODO: Check if domain exists via API
    // For now, simulate with simple validation
    const forbiddenNames = ['admin', 'api', 'www', 'shop', 'store'];
    
    if (forbiddenNames.includes(domainName.toLowerCase())) {
      setDomainError(t.domainError);
      return;
    }
    
    // TODO: Call API to update domain
    setDomainError(null);
    setIsEditingDomain(false);
    console.log('Domain updated:', domainName);
  };

  const handleBannerFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(language === 'en' ? 'Please select an image file' : 'Veuillez sélectionner un fichier image');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(language === 'en' ? 'Image size must be less than 5MB' : 'La taille de l\'image doit être inférieure à 5 Mo');
      return;
    }

    setSelectedBannerFile(file);
    setIsUploadingBanner(true);

    try {
      // TODO: Upload to image-service
      // const formData = new FormData();
      // formData.append('image', file);
      // const response = await fetch('/api/images/upload', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();
      // setBannerUrl(data.url);

      // For now, create a local preview URL
      const previewUrl = URL.createObjectURL(file);
      setBannerUrl(previewUrl);
    } catch (error) {
      console.error('Error uploading banner:', error);
      alert(language === 'en' ? 'Failed to upload image' : 'Échec du téléchargement de l\'image');
    } finally {
      setIsUploadingBanner(false);
    }
  };

  // Save handlers
  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Settings saved');
  };

  const handleCancel = () => {
    // TODO: Implement cancel/reset logic
    console.log('Changes cancelled');
  };

  const renderStoreInformation = () => (
    <Card className="liquid-card no-hover border-0">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{t.storeInfo}</CardTitle>
            <CardDescription>
              {language === 'en'
                ? "Customize your store's display name, description, and banner"
                : 'Personnalisez le nom, la description et la bannière de votre boutique'}
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="ios-surface border border-border/50 max-w-xs shadow-lg">
                <p className="text-foreground">{t.storeInfoTooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="storeName">{t.storeName}</Label>
          <Input
            id="storeName"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder={t.storeNamePlaceholder}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">{t.description}</Label>
          <Textarea
            id="description"
            value={storeDescription}
            onChange={(e) => setStoreDescription(e.target.value)}
            placeholder={t.descriptionPlaceholder}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bannerFile">{t.bannerUrl}</Label>
          <div className="flex gap-2">
            <Input
              id="bannerFile"
              type="file"
              accept="image/*"
              onChange={handleBannerFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('bannerFile')?.click()}
              disabled={isUploadingBanner}
              className="flex-1"
            >
              {isUploadingBanner ? t.uploadingBanner : t.selectBannerImage}
            </Button>
            {selectedBannerFile && (
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md flex-1">
                <span className="text-sm text-muted-foreground truncate">
                  {selectedBannerFile.name}
                </span>
              </div>
            )}
          </div>
          {bannerUrl && (
            <div className="mt-3 relative aspect-video rounded-lg overflow-hidden border border-border">
              <img
                src={bannerUrl}
                alt="Banner preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1920x400?text=Invalid+Banner+URL';
                }}
              />
            </div>
          )}
        </div>

        <Separator />

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            {t.cancel}
          </Button>
          <Button onClick={handleSave} className="liquid-button">
            <Save className="w-4 h-4 mr-2" />
            {t.save}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderDomains = () => (
    <Card className="liquid-card no-hover border-0">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{t.domains}</CardTitle>
            <CardDescription>
              {language === 'en'
                ? 'Set your unique store domain name'
                : 'Définissez votre nom de domaine unique'}
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="ios-surface border border-border/50 max-w-xs shadow-lg">
                <p className="text-foreground">{t.domainsTooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domainName">{t.domainName}</Label>
            <div className="space-y-2">
              {!isEditingDomain ? (
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{domainName}</p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'en' ? 'Current domain' : 'Domaine actuel'}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsEditingDomain(true)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Input
                    id="domainName"
                    value={domainName}
                    onChange={(e) => {
                      // Only allow lowercase letters, numbers, and hyphens
                      const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      setDomainName(value);
                      setDomainError(null);
                    }}
                    placeholder={t.domainPlaceholder}
                    className={domainError ? 'border-red-500' : ''}
                  />
                  {domainError && (
                    <p className="text-sm text-red-500">{domainError}</p>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setIsEditingDomain(false);
                        setDomainError(null);
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      {t.cancel}
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleSaveDomain}
                      className="liquid-button"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {t.save}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                {t.domainNote}
                <span className="font-mono font-medium">/{domainName}</span>
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            {t.cancel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Render content based on initialSection (controlled by Dashboard sidebar)
  const renderContent = () => {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <p className="text-2xl text-muted-foreground font-semibold">
            {language === 'fr' ? 'À implémenter' : 'To be implemented'}
          </p>
        </div>
      </div>
    );
  };

  return <div className="w-full">{renderContent()}</div>;
}

/* COMMENTED OUT - To be implemented
  const renderContent = () => {
    switch (initialSection) {
      case 'store':
        return renderStoreInformation();
      case 'domains':
        return renderDomains();
      default:
        return renderStoreInformation();
    }
  };
*/
