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
  initialSection?: 'store' | 'domains' | 'payment' | 'shipping' | 'notifications';
}

interface Domain {
  id: string;
  name: string;
  isActive: boolean;
}

export function SettingsModule({ language, initialSection = 'store' }: SettingsModuleProps) {
  // Sync with initialSection when it changes (controlled by Dashboard)
  useEffect(() => {
    // This ensures the component updates when navigating between sections
  }, [initialSection]);

  // Store Information State
  const [storeName, setStoreName] = useState('Shopifake Store');
  const [storeDescription, setStoreDescription] = useState('Your one-stop shop for everything');
  const [storeEmail, setStoreEmail] = useState('contact@shopifake.com');
  const [storeAddress, setStoreAddress] = useState('123 Main Street, New York, NY 10001');
  const [storePhone, setStorePhone] = useState('+1 (555) 123-4567');

  // Domains State
  const [domains, setDomains] = useState<Domain[]>([
    { id: '1', name: 'shopifake.com', isActive: true },
    { id: '2', name: 'www.shopifake.com', isActive: true },
  ]);
  const [newDomainName, setNewDomainName] = useState('');

  // Payment Settings State
  const [paymentGateway, setPaymentGateway] = useState('stripe');
  const [apiKey, setApiKey] = useState('pk_test_***************');
  const [secretKey, setSecretKey] = useState('sk_test_***************');
  const [currency, setCurrency] = useState('usd');

  // Shipping Settings State
  const [shippingProvider, setShippingProvider] = useState('fedex');
  const [flatRate, setFlatRate] = useState('9.99');
  const [enableFreeShipping, setEnableFreeShipping] = useState(false);

  // Notification Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [senderEmail, setSenderEmail] = useState('noreply@shopifake.com');
  const [notificationEvents, setNotificationEvents] = useState({
    newOrder: true,
    paymentReceived: true,
    orderShipped: true,
    productAdded: false,
    productUpdated: false,
    stockChanged: true,
    newCustomer: true,
    customerReview: false,
    categoryAdded: false,
    categoryUpdated: false,
    promotionCreated: false,
  });

  const text = {
    en: {
      // Navigation
      storeInfo: 'Store Information',
      domains: 'Domains',
      payment: 'Payment Settings',
      shipping: 'Shipping Settings',
      notifications: 'Notification Settings',

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
      storeEmail: 'Store Email',
      storeEmailPlaceholder: 'contact@example.com',
      storeAddress: 'Store Address',
      storeAddressPlaceholder: 'Enter physical address',
      storePhone: 'Store Phone',
      storePhonePlaceholder: '+1 (555) 123-4567',
      storeInfoTooltip:
        'Make sure all contact information is up-to-date for customer communications',

      // Domains
      domainName: 'Store Domain Name',
      domainPlaceholder: 'example.com',
      addDomain: 'Add Domain',
      activeDomains: 'Active Domains',
      domainsTooltip:
        'You can add multiple domains for your store. Make sure DNS is properly configured.',

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
      domains: 'Domaines',
      payment: 'Paramètres de Paiement',
      shipping: 'Paramètres de Livraison',
      notifications: 'Paramètres de Notification',

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
      storeEmail: 'Email du Magasin',
      storeEmailPlaceholder: 'contact@exemple.com',
      storeAddress: 'Adresse du Magasin',
      storeAddressPlaceholder: "Entrez l'adresse physique",
      storePhone: 'Téléphone du Magasin',
      storePhonePlaceholder: '+33 1 23 45 67 89',
      storeInfoTooltip:
        'Assurez-vous que toutes les informations de contact sont à jour pour communiquer avec les clients',

      // Domains
      domainName: 'Nom de Domaine',
      domainPlaceholder: 'exemple.com',
      addDomain: 'Ajouter un Domaine',
      activeDomains: 'Domaines Actifs',
      domainsTooltip:
        'Vous pouvez ajouter plusieurs domaines. Assurez-vous que le DNS est correctement configuré.',

      // Payment Settings
      paymentGateway: 'Passerelle de Paiement',
      selectGateway: 'Sélectionner une passerelle',
      apiKey: 'Clé API',
      apiKeyPlaceholder: 'Entrez votre clé API',
      secretKey: 'Clé Secrète',
      secretKeyPlaceholder: 'Entrez votre clé secrète',
      currency: 'Devise',
      selectCurrency: 'Sélectionner une devise',
      paymentTooltip: 'Gardez vos identifiants API sécurisés. Ne les partagez jamais publiquement.',

      // Shipping Settings
      shippingProvider: 'Fournisseur de Livraison',
      selectProvider: 'Sélectionner un fournisseur',
      flatRate: 'Tarif Forfaitaire',
      flatRatePlaceholder: '9.99',
      enableFreeShipping: 'Activer la Livraison Gratuite',
      freeShippingLabel: 'Offrir la livraison gratuite',
      shippingTooltip:
        'Configurez vos paramètres de livraison par défaut. Vous pouvez les modifier par produit.',

      // Notification Settings
      emailNotifications: 'Notifications par Email',
      emailNotificationsLabel: 'Envoyer des notifications par email',
      smsNotifications: 'Notifications par SMS',
      smsNotificationsLabel: 'Envoyer des notifications par SMS',
      senderEmail: 'Email Expéditeur',
      senderEmailPlaceholder: 'noreply@exemple.com',
      notificationEvents: 'Événements de Notification',
      notificationEventsDesc: 'Choisissez quels événements déclenchent des notifications',
      notificationsTooltip:
        'Configurez quand et comment vous souhaitez être notifié des événements',

      // Notification Events
      newOrder: 'Nouvelle Commande Passée',
      paymentReceived: 'Paiement Reçu',
      orderShipped: 'Commande Expédiée',
      productAdded: 'Produit Ajouté',
      productUpdated: 'Produit Mis à Jour',
      stockChanged: 'Niveau de Stock Modifié',
      newCustomer: 'Nouveau Client Enregistré',
      customerReview: 'Client a Laissé un Avis',
      categoryAdded: 'Catégorie Ajoutée',
      categoryUpdated: 'Catégorie Mise à Jour',
      promotionCreated: 'Remise ou Promotion Créée',
    },
  };

  const t = text[language];

  // Domain handlers
  const handleAddDomain = () => {
    if (newDomainName.trim()) {
      setDomains([
        ...domains,
        {
          id: Date.now().toString(),
          name: newDomainName.trim(),
          isActive: true,
        },
      ]);
      setNewDomainName('');
    }
  };

  const handleDeleteDomain = (id: string) => {
    setDomains(domains.filter((d) => d.id !== id));
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
                ? "Manage your store's basic information and contact details"
                : 'Gérez les informations de base et les coordonnées de votre magasin'}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="storeEmail">{t.storeEmail}</Label>
            <Input
              id="storeEmail"
              type="email"
              value={storeEmail}
              onChange={(e) => setStoreEmail(e.target.value)}
              placeholder={t.storeEmailPlaceholder}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="storePhone">{t.storePhone}</Label>
            <Input
              id="storePhone"
              type="tel"
              value={storePhone}
              onChange={(e) => setStorePhone(e.target.value)}
              placeholder={t.storePhonePlaceholder}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="storeAddress">{t.storeAddress}</Label>
          <Textarea
            id="storeAddress"
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
            placeholder={t.storeAddressPlaceholder}
            rows={3}
          />
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
                ? 'Manage your store domains and custom URLs'
                : 'Gérez vos domaines et URLs personnalisées'}
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
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={newDomainName}
                onChange={(e) => setNewDomainName(e.target.value)}
                placeholder={t.domainPlaceholder}
                onKeyDown={(e) => e.key === 'Enter' && handleAddDomain()}
              />
            </div>
            <Button onClick={handleAddDomain} className="liquid-button">
              <Plus className="w-4 h-4 mr-2" />
              {t.addDomain}
            </Button>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">{t.activeDomains}</h3>
            {domains.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8 bg-muted/30 rounded-lg">
                {language === 'en' ? 'No domains added yet' : 'Aucun domaine ajouté'}
              </p>
            ) : (
              domains.map((domain) => (
                <div
                  key={domain.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{domain.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {domain.isActive
                          ? language === 'en'
                            ? 'Active'
                            : 'Actif'
                          : language === 'en'
                            ? 'Inactive'
                            : 'Inactif'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteDomain(domain.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
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

  const renderPaymentSettings = () => (
    <Card className="liquid-card no-hover border-0">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{t.payment}</CardTitle>
            <CardDescription>
              {language === 'en'
                ? 'Configure payment gateways and currency settings'
                : 'Configurez les passerelles de paiement et les devises'}
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
                <p className="text-foreground">{t.paymentTooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="paymentGateway">{t.paymentGateway}</Label>
          <Select value={paymentGateway} onValueChange={setPaymentGateway}>
            <SelectTrigger id="paymentGateway">
              <SelectValue placeholder={t.selectGateway} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stripe">Stripe</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="authorize">Authorize.net</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="apiKey">{t.apiKey}</Label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={t.apiKeyPlaceholder}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="secretKey">{t.secretKey}</Label>
          <Input
            id="secretKey"
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder={t.secretKeyPlaceholder}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">{t.currency}</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger id="currency">
              <SelectValue placeholder={t.selectCurrency} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usd">USD - US Dollar</SelectItem>
              <SelectItem value="eur">EUR - Euro</SelectItem>
              <SelectItem value="gbp">GBP - British Pound</SelectItem>
              <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
              <SelectItem value="aud">AUD - Australian Dollar</SelectItem>
            </SelectContent>
          </Select>
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

  const renderShippingSettings = () => (
    <Card className="liquid-card no-hover border-0">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{t.shipping}</CardTitle>
            <CardDescription>
              {language === 'en'
                ? 'Configure shipping providers and rates'
                : 'Configurez les fournisseurs et tarifs de livraison'}
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
                <p className="text-foreground">{t.shippingTooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="shippingProvider">{t.shippingProvider}</Label>
          <Select value={shippingProvider} onValueChange={setShippingProvider}>
            <SelectTrigger id="shippingProvider">
              <SelectValue placeholder={t.selectProvider} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fedex">FedEx</SelectItem>
              <SelectItem value="ups">UPS</SelectItem>
              <SelectItem value="usps">USPS</SelectItem>
              <SelectItem value="dhl">DHL</SelectItem>
              <SelectItem value="custom">Custom Provider</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="flatRate">{t.flatRate}</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id="flatRate"
              type="number"
              step="0.01"
              value={flatRate}
              onChange={(e) => setFlatRate(e.target.value)}
              placeholder={t.flatRatePlaceholder}
              className="pl-8"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="space-y-0.5">
            <Label htmlFor="freeShipping" className="cursor-pointer">
              {t.enableFreeShipping}
            </Label>
            <p className="text-sm text-muted-foreground">{t.freeShippingLabel}</p>
          </div>
          <Switch
            id="freeShipping"
            checked={enableFreeShipping}
            onCheckedChange={setEnableFreeShipping}
          />
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

  const renderNotificationSettings = () => (
    <Card className="liquid-card no-hover border-0">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{t.notifications}</CardTitle>
            <CardDescription>
              {language === 'en'
                ? 'Manage notification preferences and events'
                : 'Gérez les préférences et événements de notification'}
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
                <p className="text-foreground">{t.notificationsTooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="space-y-0.5">
            <Label htmlFor="emailNotif" className="cursor-pointer">
              {t.emailNotifications}
            </Label>
            <p className="text-sm text-muted-foreground">{t.emailNotificationsLabel}</p>
          </div>
          <Switch
            id="emailNotif"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="space-y-0.5">
            <Label htmlFor="smsNotif" className="cursor-pointer">
              {t.smsNotifications}
            </Label>
            <p className="text-sm text-muted-foreground">{t.smsNotificationsLabel}</p>
          </div>
          <Switch id="smsNotif" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="senderEmail">{t.senderEmail}</Label>
          <Input
            id="senderEmail"
            type="email"
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            placeholder={t.senderEmailPlaceholder}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">{t.notificationEvents}</h3>
            <p className="text-sm text-muted-foreground">{t.notificationEventsDesc}</p>
          </div>

          <div className="space-y-3 border rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="newOrder"
                checked={notificationEvents.newOrder}
                onCheckedChange={(checked) =>
                  setNotificationEvents({ ...notificationEvents, newOrder: checked as boolean })
                }
              />
              <Label htmlFor="newOrder" className="cursor-pointer">
                {t.newOrder}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="paymentReceived"
                checked={notificationEvents.paymentReceived}
                onCheckedChange={(checked) =>
                  setNotificationEvents({
                    ...notificationEvents,
                    paymentReceived: checked as boolean,
                  })
                }
              />
              <Label htmlFor="paymentReceived" className="cursor-pointer">
                {t.paymentReceived}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="orderShipped"
                checked={notificationEvents.orderShipped}
                onCheckedChange={(checked) =>
                  setNotificationEvents({ ...notificationEvents, orderShipped: checked as boolean })
                }
              />
              <Label htmlFor="orderShipped" className="cursor-pointer">
                {t.orderShipped}
              </Label>
            </div>

            <Separator />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="productAdded"
                checked={notificationEvents.productAdded}
                onCheckedChange={(checked) =>
                  setNotificationEvents({ ...notificationEvents, productAdded: checked as boolean })
                }
              />
              <Label htmlFor="productAdded" className="cursor-pointer">
                {t.productAdded}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="productUpdated"
                checked={notificationEvents.productUpdated}
                onCheckedChange={(checked) =>
                  setNotificationEvents({
                    ...notificationEvents,
                    productUpdated: checked as boolean,
                  })
                }
              />
              <Label htmlFor="productUpdated" className="cursor-pointer">
                {t.productUpdated}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="stockChanged"
                checked={notificationEvents.stockChanged}
                onCheckedChange={(checked) =>
                  setNotificationEvents({ ...notificationEvents, stockChanged: checked as boolean })
                }
              />
              <Label htmlFor="stockChanged" className="cursor-pointer">
                {t.stockChanged}
              </Label>
            </div>

            <Separator />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="newCustomer"
                checked={notificationEvents.newCustomer}
                onCheckedChange={(checked) =>
                  setNotificationEvents({ ...notificationEvents, newCustomer: checked as boolean })
                }
              />
              <Label htmlFor="newCustomer" className="cursor-pointer">
                {t.newCustomer}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="customerReview"
                checked={notificationEvents.customerReview}
                onCheckedChange={(checked) =>
                  setNotificationEvents({
                    ...notificationEvents,
                    customerReview: checked as boolean,
                  })
                }
              />
              <Label htmlFor="customerReview" className="cursor-pointer">
                {t.customerReview}
              </Label>
            </div>

            <Separator />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="categoryAdded"
                checked={notificationEvents.categoryAdded}
                onCheckedChange={(checked) =>
                  setNotificationEvents({
                    ...notificationEvents,
                    categoryAdded: checked as boolean,
                  })
                }
              />
              <Label htmlFor="categoryAdded" className="cursor-pointer">
                {t.categoryAdded}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="categoryUpdated"
                checked={notificationEvents.categoryUpdated}
                onCheckedChange={(checked) =>
                  setNotificationEvents({
                    ...notificationEvents,
                    categoryUpdated: checked as boolean,
                  })
                }
              />
              <Label htmlFor="categoryUpdated" className="cursor-pointer">
                {t.categoryUpdated}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="promotionCreated"
                checked={notificationEvents.promotionCreated}
                onCheckedChange={(checked) =>
                  setNotificationEvents({
                    ...notificationEvents,
                    promotionCreated: checked as boolean,
                  })
                }
              />
              <Label htmlFor="promotionCreated" className="cursor-pointer">
                {t.promotionCreated}
              </Label>
            </div>
          </div>
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

  // Render content based on initialSection (controlled by Dashboard sidebar)
  const renderContent = () => {
    switch (initialSection) {
      case 'store':
        return renderStoreInformation();
      case 'domains':
        return renderDomains();
      case 'payment':
        return renderPaymentSettings();
      case 'shipping':
        return renderShippingSettings();
      case 'notifications':
        return renderNotificationSettings();
      default:
        return renderStoreInformation();
    }
  };

  return <div className="w-full">{renderContent()}</div>;
}
