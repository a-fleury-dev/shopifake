import { useState, useEffect } from 'react';
import {
  FileText,
  BookOpen,
  Image as ImageIcon,
  Menu as MenuIcon,
  Layout,
  File,
  Grid3x3,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Eye,
  Globe,
  Tag,
  Calendar,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Layers,
  GripVertical,
  Save,
  Languages,
  Upload,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { toast } from 'sonner';

interface CMSModuleProps {
  language: 'en' | 'fr';
  currentUser: {
    email: string;
    name: string;
    role: 'admin' | 'manager';
  };
  initialSection?: 'pages' | 'blog' | 'media' | 'menus' | 'blocks' | 'templates' | 'collections';
}

interface Page {
  id: string;
  title: string;
  slug: string;
  template: string;
  status: 'published' | 'draft' | 'scheduled';
  language: 'en' | 'fr' | 'both';
  seoTitle: string;
  seoDescription: string;
  content: ContentSection[];
  publishDate?: string;
  lastModified: string;
  author: string;
}

interface ContentSection {
  id: string;
  type: 'hero' | 'text' | 'image' | 'gallery' | 'cta' | 'testimonial' | 'faq' | 'custom';
  content: any;
  order: number;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  status: 'published' | 'draft' | 'scheduled';
  language: 'en' | 'fr' | 'both';
  publishDate: string;
  author: string;
  views: number;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  articlesCount: number;
  language: 'en' | 'fr' | 'both';
}

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: string;
  uploadDate: string;
  usedIn: string[];
}

interface MenuItem {
  id: string;
  label: string;
  url: string;
  type: 'page' | 'link' | 'category';
  target: '_self' | '_blank';
  order: number;
  children?: MenuItem[];
}

interface NavigationMenu {
  id: string;
  name: string;
  location: 'header' | 'footer' | 'sidebar';
  items: MenuItem[];
  language: 'en' | 'fr' | 'both';
}

interface ContentBlock {
  id: string;
  name: string;
  type: 'text' | 'html' | 'banner' | 'widget';
  content: string;
  language: 'en' | 'fr' | 'both';
  usedIn: string[];
}

interface PageTemplate {
  id: string;
  name: string;
  description: string;
  sections: ContentSection[];
  previewImage: string;
  usageCount: number;
}

interface Collection {
  id: string;
  name: string;
  type: string;
  fields: CollectionField[];
  entries: any[];
  language: 'en' | 'fr' | 'both';
}

interface CollectionField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'image' | 'select' | 'checkbox';
  required: boolean;
  options?: string[];
}

const translations = {
  en: {
    // Sections
    pages: 'Pages',
    blog: 'Blog',
    media: 'Media Library',
    menus: 'Menus & Navigation',
    blocks: 'Content Blocks',
    templates: 'Page Templates',
    collections: 'Collections',

    // Pages
    pageManagement: 'Page Management',
    addPage: 'Add Page',
    editPage: 'Edit Page',
    deletePage: 'Delete Page',
    pageTitle: 'Page Title',
    slug: 'Slug',
    template: 'Template',
    status: 'Status',
    language: 'Language',
    published: 'Published',
    draft: 'Draft',
    scheduled: 'Scheduled',
    both: 'Both Languages',
    seoTitle: 'SEO Title',
    seoDescription: 'SEO Description',
    content: 'Content',
    sections: 'Sections',
    addSection: 'Add Section',
    publishDate: 'Publish Date',
    lastModified: 'Last Modified',
    author: 'Author',
    preview: 'Preview',

    // Blog
    articles: 'Articles',
    addArticle: 'Add Article',
    editArticle: 'Edit Article',
    deleteArticle: 'Delete Article',
    excerpt: 'Excerpt',
    coverImage: 'Cover Image',
    category: 'Category',
    tags: 'Tags',
    views: 'Views',
    blogCategories: 'Blog Categories',
    addCategory: 'Add Category',

    // Media
    uploadMedia: 'Upload Media',
    mediaType: 'Type',
    fileName: 'File Name',
    fileSize: 'Size',
    uploadDate: 'Upload Date',
    usedIn: 'Used In',

    // Menus
    menuManagement: 'Menu Management',
    addMenu: 'Add Menu',
    editMenu: 'Edit Menu',
    deleteMenu: 'Delete Menu',
    menuName: 'Menu Name',
    location: 'Location',
    header: 'Header',
    footer: 'Footer',
    sidebar: 'Sidebar',
    menuItems: 'Menu Items',
    addMenuItem: 'Add Menu Item',
    label: 'Label',
    url: 'URL',
    type: 'Type',
    page: 'Page',
    link: 'Link',
    target: 'Target',

    // Content Blocks
    blockManagement: 'Content Block Management',
    addBlock: 'Add Block',
    editBlock: 'Edit Block',
    deleteBlock: 'Delete Block',
    blockName: 'Block Name',
    blockType: 'Block Type',
    text: 'Text',
    html: 'HTML',
    banner: 'Banner',
    widget: 'Widget',

    // Templates
    templateManagement: 'Page Template Management',
    addTemplate: 'Add Template',
    editTemplate: 'Edit Template',
    deleteTemplate: 'Delete Template',
    templateName: 'Template Name',
    description: 'Description',
    usageCount: 'Usage Count',

    // Collections
    collectionManagement: 'Collection Management',
    addCollection: 'Add Collection',
    editCollection: 'Edit Collection',
    deleteCollection: 'Delete Collection',
    collectionName: 'Collection Name',
    collectionType: 'Collection Type',
    fields: 'Fields',
    entries: 'Entries',
    addField: 'Add Field',
    addEntry: 'Add Entry',
    fieldName: 'Field Name',
    fieldType: 'Field Type',
    required: 'Required',

    // Common
    search: 'Search',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    actions: 'Actions',
    name: 'Name',
    duplicate: 'Duplicate',
    viewLive: 'View Live',
    noResults: 'No results found',
    confirmDelete: 'Confirm Deletion',
    deleteWarning: 'Are you sure you want to delete this item? This action cannot be undone.',

    // Section types
    sectionTypes: {
      hero: 'Hero Section',
      text: 'Text Block',
      image: 'Image',
      gallery: 'Gallery',
      cta: 'Call to Action',
      testimonial: 'Testimonial',
      faq: 'FAQ',
      custom: 'Custom',
    },
  },
  fr: {
    // Sections
    pages: 'Pages',
    blog: 'Blog',
    media: 'Bibliothèque Médias',
    menus: 'Menus & Navigation',
    blocks: 'Blocs de Contenu',
    templates: 'Modèles de Pages',
    collections: 'Collections',

    // Pages
    pageManagement: 'Gestion des Pages',
    addPage: 'Ajouter une Page',
    editPage: 'Modifier la Page',
    deletePage: 'Supprimer la Page',
    pageTitle: 'Titre de la Page',
    slug: 'Slug',
    template: 'Modèle',
    status: 'Statut',
    language: 'Langue',
    published: 'Publié',
    draft: 'Brouillon',
    scheduled: 'Programmé',
    both: 'Les Deux Langues',
    seoTitle: 'Titre SEO',
    seoDescription: 'Description SEO',
    content: 'Contenu',
    sections: 'Sections',
    addSection: 'Ajouter une Section',
    publishDate: 'Date de Publication',
    lastModified: 'Dernière Modification',
    author: 'Auteur',
    preview: 'Aperçu',

    // Blog
    articles: 'Articles',
    addArticle: 'Ajouter un Article',
    editArticle: "Modifier l'Article",
    deleteArticle: "Supprimer l'Article",
    excerpt: 'Extrait',
    coverImage: 'Image de Couverture',
    category: 'Catégorie',
    tags: 'Tags',
    views: 'Vues',
    blogCategories: 'Catégories du Blog',
    addCategory: 'Ajouter une Catégorie',

    // Media
    uploadMedia: 'Télécharger un Média',
    mediaType: 'Type',
    fileName: 'Nom du Fichier',
    fileSize: 'Taille',
    uploadDate: 'Date de Téléchargement',
    usedIn: 'Utilisé Dans',

    // Menus
    menuManagement: 'Gestion des Menus',
    addMenu: 'Ajouter un Menu',
    editMenu: 'Modifier le Menu',
    deleteMenu: 'Supprimer le Menu',
    menuName: 'Nom du Menu',
    location: 'Emplacement',
    header: 'En-tête',
    footer: 'Pied de page',
    sidebar: 'Barre latérale',
    menuItems: 'Éléments du Menu',
    addMenuItem: 'Ajouter un Élément',
    label: 'Libellé',
    url: 'URL',
    type: 'Type',
    page: 'Page',
    link: 'Lien',
    target: 'Cible',

    // Content Blocks
    blockManagement: 'Gestion des Blocs de Contenu',
    addBlock: 'Ajouter un Bloc',
    editBlock: 'Modifier le Bloc',
    deleteBlock: 'Supprimer le Bloc',
    blockName: 'Nom du Bloc',
    blockType: 'Type de Bloc',
    text: 'Texte',
    html: 'HTML',
    banner: 'Bannière',
    widget: 'Widget',

    // Templates
    templateManagement: 'Gestion des Modèles de Pages',
    addTemplate: 'Ajouter un Modèle',
    editTemplate: 'Modifier le Modèle',
    deleteTemplate: 'Supprimer le Modèle',
    templateName: 'Nom du Modèle',
    description: 'Description',
    usageCount: "Nombre d'Utilisations",

    // Collections
    collectionManagement: 'Gestion des Collections',
    addCollection: 'Ajouter une Collection',
    editCollection: 'Modifier la Collection',
    deleteCollection: 'Supprimer la Collection',
    collectionName: 'Nom de la Collection',
    collectionType: 'Type de Collection',
    fields: 'Champs',
    entries: 'Entrées',
    addField: 'Ajouter un Champ',
    addEntry: 'Ajouter une Entrée',
    fieldName: 'Nom du Champ',
    fieldType: 'Type de Champ',
    required: 'Requis',

    // Common
    search: 'Rechercher',
    save: 'Enregistrer',
    cancel: 'Annuler',
    edit: 'Modifier',
    delete: 'Supprimer',
    add: 'Ajouter',
    actions: 'Actions',
    name: 'Nom',
    duplicate: 'Dupliquer',
    viewLive: 'Voir en Direct',
    noResults: 'Aucun résultat trouvé',
    confirmDelete: 'Confirmer la Suppression',
    deleteWarning:
      'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.',

    // Section types
    sectionTypes: {
      hero: 'Section Hero',
      text: 'Bloc de Texte',
      image: 'Image',
      gallery: 'Galerie',
      cta: "Appel à l'Action",
      testimonial: 'Témoignage',
      faq: 'FAQ',
      custom: 'Personnalisé',
    },
  },
};

export function CMSModule({ language, currentUser, initialSection = 'pages' }: CMSModuleProps) {
  const [activeSection, setActiveSection] = useState<
    'pages' | 'blog' | 'media' | 'menus' | 'blocks' | 'templates' | 'collections'
  >(initialSection);
  const [searchTerm, setSearchTerm] = useState('');

  // Update activeSection when initialSection changes
  useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  // Pages state
  const [pages, setPages] = useState<Page[]>([
    {
      id: '1',
      title: 'Home',
      slug: 'home',
      template: 'home-template',
      status: 'published',
      language: 'both',
      seoTitle: 'Welcome to Shopifake',
      seoDescription: 'Your one-stop shop for everything',
      content: [
        {
          id: 'hero-1',
          type: 'hero',
          content: {
            title: 'Welcome to Shopifake',
            subtitle: 'Your one-stop shop for everything you need',
            buttonText: 'Start Shopping',
            buttonUrl: '/shop',
          },
          order: 0,
        },
        {
          id: 'text-1',
          type: 'text',
          content: {
            title: 'Why Choose Us?',
            text: 'We provide the best quality products at competitive prices with excellent customer service.',
          },
          order: 1,
        },
        {
          id: 'cta-1',
          type: 'cta',
          content: {
            title: 'Ready to Get Started?',
            text: 'Join thousands of satisfied customers today',
            buttonText: 'Sign Up Now',
            buttonUrl: '/signup',
          },
          order: 2,
        },
      ],
      lastModified: '2025-10-28',
      author: 'Admin',
    },
    {
      id: '2',
      title: 'About Us',
      slug: 'about',
      template: 'standard-page',
      status: 'published',
      language: 'both',
      seoTitle: 'About Shopifake',
      seoDescription: 'Learn more about our company',
      content: [
        {
          id: 'text-2',
          type: 'text',
          content: {
            title: 'Our Story',
            text: 'Founded in 2020, Shopifake has been serving customers worldwide with dedication and excellence.',
          },
          order: 0,
        },
        {
          id: 'testimonial-1',
          type: 'testimonial',
          content: {
            quote:
              'Shopifake has transformed the way I shop online. The experience is seamless and the products are top-notch!',
            author: 'Jane Smith',
            role: 'Customer',
          },
          order: 1,
        },
      ],
      lastModified: '2025-10-27',
      author: 'Admin',
    },
    {
      id: '3',
      title: 'Contact',
      slug: 'contact',
      template: 'contact-template',
      status: 'published',
      language: 'both',
      seoTitle: 'Contact Us',
      seoDescription: 'Get in touch with us',
      content: [
        {
          id: 'text-3',
          type: 'text',
          content: {
            title: 'Get in Touch',
            text: "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
          },
          order: 0,
        },
        {
          id: 'faq-1',
          type: 'faq',
          content: {
            question: 'How can I contact support?',
            answer:
              'You can reach our support team via email at support@shopifake.com or call us at 1-800-SHOPIFAKE.',
          },
          order: 1,
        },
      ],
      lastModified: '2025-10-26',
      author: 'Manager',
    },
  ]);

  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [showEditPageModal, setShowEditPageModal] = useState(false);
  const [showDeletePageDialog, setShowDeletePageDialog] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  // Articles state
  const [articles, setArticles] = useState<Article[]>([
    {
      id: '1',
      title: 'How to Choose the Perfect Product',
      slug: 'how-to-choose-perfect-product',
      excerpt: 'A comprehensive guide to selecting the right products for your needs.',
      content: 'Full article content here...',
      coverImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc',
      category: 'guides',
      tags: ['shopping', 'tips', 'guide'],
      status: 'published',
      language: 'both',
      publishDate: '2025-10-25',
      author: 'Admin',
      views: 1245,
    },
    {
      id: '2',
      title: '10 Trends to Watch This Season',
      slug: '10-trends-watch-season',
      excerpt: 'Discover the latest trends that are shaping the market.',
      content: 'Full article content here...',
      coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      category: 'trends',
      tags: ['fashion', 'trends', 'season'],
      status: 'published',
      language: 'both',
      publishDate: '2025-10-23',
      author: 'Manager',
      views: 890,
    },
  ]);

  const [blogCategories, setBlogCategories] = useState<BlogCategory[]>([
    {
      id: '1',
      name: 'Guides',
      slug: 'guides',
      description: 'Helpful guides and tutorials',
      articlesCount: 5,
      language: 'both',
    },
    {
      id: '2',
      name: 'Trends',
      slug: 'trends',
      description: 'Latest trends and news',
      articlesCount: 8,
      language: 'both',
    },
    {
      id: '3',
      name: 'Reviews',
      slug: 'reviews',
      description: 'Product reviews',
      articlesCount: 12,
      language: 'both',
    },
  ]);

  const [showAddArticleModal, setShowAddArticleModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Media state
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([
    {
      id: '1',
      name: 'hero-banner.jpg',
      url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04',
      type: 'image',
      size: '2.4 MB',
      uploadDate: '2025-10-28',
      usedIn: ['Home', 'Landing Page'],
    },
    {
      id: '2',
      name: 'product-showcase.jpg',
      url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc',
      type: 'image',
      size: '1.8 MB',
      uploadDate: '2025-10-27',
      usedIn: ['Products Page'],
    },
  ]);

  // Menus state
  const [menus, setMenus] = useState<NavigationMenu[]>([
    {
      id: '1',
      name: 'Main Navigation',
      location: 'header',
      language: 'both',
      items: [
        { id: '1', label: 'Home', url: '/', type: 'page', target: '_self', order: 1 },
        { id: '2', label: 'Shop', url: '/shop', type: 'page', target: '_self', order: 2 },
        { id: '3', label: 'About', url: '/about', type: 'page', target: '_self', order: 3 },
        { id: '4', label: 'Contact', url: '/contact', type: 'page', target: '_self', order: 4 },
      ],
    },
    {
      id: '2',
      name: 'Footer Navigation',
      location: 'footer',
      language: 'both',
      items: [
        {
          id: '5',
          label: 'Privacy Policy',
          url: '/privacy',
          type: 'page',
          target: '_self',
          order: 1,
        },
        {
          id: '6',
          label: 'Terms of Service',
          url: '/terms',
          type: 'page',
          target: '_self',
          order: 2,
        },
        { id: '7', label: 'FAQ', url: '/faq', type: 'page', target: '_self', order: 3 },
        { id: '8', label: 'Contact Us', url: '/contact', type: 'page', target: '_self', order: 4 },
      ],
    },
  ]);

  // Content Blocks state
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    {
      id: '1',
      name: 'Promo Banner',
      type: 'banner',
      content: 'Free shipping on orders over $50!',
      language: 'both',
      usedIn: ['Home', 'Shop'],
    },
    {
      id: '2',
      name: 'Footer Text',
      type: 'text',
      content: '© 2025 Shopifake. All rights reserved.',
      language: 'both',
      usedIn: ['All Pages'],
    },
  ]);

  // Templates state
  const [templates, setTemplates] = useState<PageTemplate[]>([
    {
      id: '1',
      name: 'Standard Page',
      description: 'Basic page layout with header and content',
      sections: [],
      previewImage: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d',
      usageCount: 15,
    },
    {
      id: '2',
      name: 'Landing Page',
      description: 'Full-width landing page with hero section',
      sections: [],
      previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      usageCount: 8,
    },
  ]);

  // Collections state
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: '1',
      name: 'Testimonials',
      type: 'testimonials',
      language: 'both',
      fields: [
        { id: '1', name: 'Name', type: 'text', required: true },
        { id: '2', name: 'Company', type: 'text', required: false },
        { id: '3', name: 'Testimonial', type: 'textarea', required: true },
        { id: '4', name: 'Rating', type: 'number', required: true },
      ],
      entries: [
        {
          id: '1',
          name: 'John Doe',
          company: 'Tech Corp',
          testimonial: 'Great service!',
          rating: 5,
        },
      ],
    },
  ]);

  const text = translations[language];

  // Permissions
  const canCreate = currentUser.role === 'admin' || currentUser.role === 'manager';
  const canEdit = currentUser.role === 'admin' || currentUser.role === 'manager';
  const canDelete = currentUser.role === 'admin';

  // Page handlers
  const handleAddPage = () => {
    toast.success(language === 'fr' ? 'Page ajoutée avec succès' : 'Page added successfully');
    setShowAddPageModal(false);
  };

  const handleOpenPageEditor = (pageId: string) => {
    setEditingPageId(pageId);
  };

  const handleSavePage = (updatedPage: Page) => {
    setPages(pages.map((p) => (p.id === updatedPage.id ? updatedPage : p)));
    setEditingPageId(null);
  };

  const handleCancelPageEdit = () => {
    setEditingPageId(null);
  };

  const handleDeletePage = () => {
    if (selectedPage) {
      setPages(pages.filter((p) => p.id !== selectedPage.id));
      toast.success(language === 'fr' ? 'Page supprimée avec succès' : 'Page deleted successfully');
      setShowDeletePageDialog(false);
      setSelectedPage(null);
    }
  };

  const handleDuplicatePage = (page: Page) => {
    const newPage = {
      ...page,
      id: Date.now().toString(),
      title: `${page.title} (Copy)`,
      slug: `${page.slug}-copy`,
      status: 'draft' as const,
    };
    setPages([...pages, newPage]);
    toast.success(
      language === 'fr' ? 'Page dupliquée avec succès' : 'Page duplicated successfully',
    );
  };

  // Article handlers
  const handleAddArticle = () => {
    toast.success(language === 'fr' ? 'Article ajouté avec succès' : 'Article added successfully');
    setShowAddArticleModal(false);
  };

  // Render functions
  const renderPagesSection = () => {
    const filteredPages = pages.filter(
      (page) =>
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.slug.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
      <div className="space-y-6">
        <Card className="liquid-card no-hover border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">{text.pageManagement}</CardTitle>
              {canCreate && (
                <Dialog open={showAddPageModal} onOpenChange={setShowAddPageModal}>
                  <DialogTrigger asChild>
                    <Button className="liquid-button">
                      <Plus className="w-4 h-4 mr-2" />
                      {text.addPage}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="liquid-card max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{text.addPage}</DialogTitle>
                      <DialogDescription>
                        {language === 'fr'
                          ? 'Créez une nouvelle page pour votre site'
                          : 'Create a new page for your site'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>{text.pageTitle} *</Label>
                          <Input placeholder="Enter page title" />
                        </div>
                        <div>
                          <Label>{text.slug} *</Label>
                          <Input placeholder="page-slug" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>{text.template}</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select template" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard Page</SelectItem>
                              <SelectItem value="landing">Landing Page</SelectItem>
                              <SelectItem value="contact">Contact Page</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>{text.status}</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="published">{text.published}</SelectItem>
                              <SelectItem value="draft">{text.draft}</SelectItem>
                              <SelectItem value="scheduled">{text.scheduled}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>{text.language}</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="fr">Français</SelectItem>
                              <SelectItem value="both">{text.both}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>{text.seoTitle}</Label>
                        <Input placeholder="SEO optimized title" />
                      </div>

                      <div>
                        <Label>{text.seoDescription}</Label>
                        <Textarea
                          placeholder="SEO meta description (150-160 characters)"
                          rows={3}
                        />
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium">{text.sections}</h3>
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            {text.addSection}
                          </Button>
                        </div>
                        <div className="text-center text-muted-foreground py-8 bg-muted/30 rounded-xl">
                          {language === 'fr'
                            ? 'Aucune section ajoutée. Cliquez sur "Ajouter une Section" pour commencer.'
                            : 'No sections added. Click "Add Section" to get started.'}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleAddPage} className="flex-1">
                          {text.save}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowAddPageModal(false)}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={text.search}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{text.pageTitle}</TableHead>
                  <TableHead>{text.slug}</TableHead>
                  <TableHead>{text.template}</TableHead>
                  <TableHead>{text.status}</TableHead>
                  <TableHead>{text.language}</TableHead>
                  <TableHead>{text.lastModified}</TableHead>
                  <TableHead className="text-right">{text.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      {text.noResults}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{page.slug}</code>
                      </TableCell>
                      <TableCell>{page.template}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            page.status === 'published'
                              ? 'default'
                              : page.status === 'draft'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {text[page.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          <Languages className="w-3 h-3 mr-1" />
                          {page.language.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {page.lastModified}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            title={text.preview}
                            onClick={() => handleOpenPageEditor(page.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title={text.viewLive}>
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          {canEdit && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDuplicatePage(page)}
                                title={text.duplicate}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenPageEditor(page.id)}
                                title={text.edit}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedPage(page);
                                setShowDeletePageDialog(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Delete Dialog */}
        <AlertDialog open={showDeletePageDialog} onOpenChange={setShowDeletePageDialog}>
          <AlertDialogContent className="liquid-card">
            <AlertDialogHeader>
              <AlertDialogTitle>{text.confirmDelete}</AlertDialogTitle>
              <AlertDialogDescription>{text.deleteWarning}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{text.cancel}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeletePage}
                className="bg-destructive text-destructive-foreground"
              >
                {text.delete}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

  const renderBlogSection = () => {
    return (
      <div className="space-y-6">
        <Tabs defaultValue="articles">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="articles">{text.articles}</TabsTrigger>
            <TabsTrigger value="categories">{text.blogCategories}</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="mt-6">
            <Card className="liquid-card no-hover border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{text.articles}</CardTitle>
                  {canCreate && (
                    <Button className="liquid-button" onClick={() => setShowAddArticleModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      {text.addArticle}
                    </Button>
                  )}
                </div>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={text.search}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {articles.map((article) => (
                    <Card key={article.id} className="liquid-card no-hover border overflow-hidden">
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{article.category}</Badge>
                          <Badge variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            {article.views}
                          </Badge>
                        </div>
                        <h3 className="font-medium mb-2">{article.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{article.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{article.publishDate}</span>
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          {article.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        {(canEdit || canDelete) && (
                          <div className="flex gap-2 mt-4 pt-4 border-t">
                            {canEdit && (
                              <Button variant="outline" size="sm" className="flex-1">
                                <Edit className="w-4 h-4 mr-2" />
                                {text.edit}
                              </Button>
                            )}
                            {canDelete && (
                              <Button variant="outline" size="sm" className="flex-1">
                                <Trash2 className="w-4 h-4 mr-2 text-destructive" />
                                {text.delete}
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <Card className="liquid-card no-hover border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{text.blogCategories}</CardTitle>
                  {canCreate && (
                    <Button className="liquid-button">
                      <Plus className="w-4 h-4 mr-2" />
                      {text.addCategory}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {blogCategories.map((category) => (
                    <Card key={category.id} className="liquid-card no-hover border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <BookOpen className="w-5 h-5 text-primary" />
                              <div>
                                <h3 className="font-medium">{category.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {category.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 mt-2 ml-8">
                              <Badge variant="outline">
                                {category.articlesCount} {text.articles}
                              </Badge>
                              <Badge variant="outline">
                                <Languages className="w-3 h-3 mr-1" />
                                {category.language.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                          {(canEdit || canDelete) && (
                            <div className="flex gap-2">
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
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  const renderMediaSection = () => {
    return (
      <div className="space-y-6">
        <Card className="liquid-card no-hover border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{text.media}</CardTitle>
              {canCreate && (
                <Button className="liquid-button">
                  <Upload className="w-4 h-4 mr-2" />
                  {text.uploadMedia}
                </Button>
              )}
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder={text.search} className="pl-10" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mediaFiles.map((file) => (
                <Card key={file.id} className="liquid-card no-hover border overflow-hidden group">
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button variant="secondary" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {canDelete && (
                        <Button variant="secondary" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                    {file.usedIn.length > 0 && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          Used in {file.usedIn.length} {file.usedIn.length === 1 ? 'page' : 'pages'}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderMenusSection = () => {
    return (
      <div className="space-y-6">
        <Card className="liquid-card no-hover border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{text.menuManagement}</CardTitle>
              {canCreate && (
                <Button className="liquid-button">
                  <Plus className="w-4 h-4 mr-2" />
                  {text.addMenu}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {menus.map((menu) => (
                <Card key={menu.id} className="liquid-card no-hover border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MenuIcon className="w-5 h-5 text-primary" />
                        <div>
                          <CardTitle className="text-base">{menu.name}</CardTitle>
                          <CardDescription>
                            {text.location}: {text[menu.location]} • {menu.items.length}{' '}
                            {text.menuItems}
                          </CardDescription>
                        </div>
                      </div>
                      {(canEdit || canDelete) && (
                        <div className="flex gap-2">
                          {canEdit && (
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-2" />
                              {text.edit}
                            </Button>
                          )}
                          {canDelete && (
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4 mr-2 text-destructive" />
                              {text.delete}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {menu.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                            <div>
                              <p className="font-medium">{item.label}</p>
                              <p className="text-xs text-muted-foreground">{item.url}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{text[item.type]}</Badge>
                            {canEdit && (
                              <Button variant="ghost" size="sm">
                                <Edit className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {canCreate && (
                      <Button variant="outline" className="w-full mt-3">
                        <Plus className="w-4 h-4 mr-2" />
                        {text.addMenuItem}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderBlocksSection = () => {
    return (
      <div className="space-y-6">
        <Card className="liquid-card no-hover border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{text.blockManagement}</CardTitle>
              {canCreate && (
                <Button className="liquid-button">
                  <Plus className="w-4 h-4 mr-2" />
                  {text.addBlock}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contentBlocks.map((block) => (
                <Card key={block.id} className="liquid-card no-hover border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Layers className="w-5 h-5 text-primary" />
                          <h3 className="font-medium">{block.name}</h3>
                        </div>
                        <Badge variant="secondary" className="mb-2">
                          {text[block.type]}
                        </Badge>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {block.content}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            <Languages className="w-3 h-3 mr-1" />
                            {block.language.toUpperCase()}
                          </Badge>
                          {block.usedIn.length > 0 && (
                            <Badge variant="outline">
                              Used in {block.usedIn.length}{' '}
                              {block.usedIn.length === 1 ? 'page' : 'pages'}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {(canEdit || canDelete) && (
                        <div className="flex gap-2">
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
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTemplatesSection = () => {
    return (
      <div className="space-y-6">
        <Card className="liquid-card no-hover border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{text.templateManagement}</CardTitle>
              {canCreate && (
                <Button className="liquid-button">
                  <Plus className="w-4 h-4 mr-2" />
                  {text.addTemplate}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="liquid-card no-hover border overflow-hidden">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    <img
                      src={template.previewImage}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Layout className="w-5 h-5 text-primary" />
                        <h3 className="font-medium">{template.name}</h3>
                      </div>
                      <Badge variant="outline">
                        {template.usageCount} {text.usageCount}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                    {(canEdit || canDelete) && (
                      <div className="flex gap-2">
                        {canEdit && (
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="w-4 h-4 mr-2" />
                            {text.edit}
                          </Button>
                        )}
                        {canDelete && (
                          <Button variant="outline" size="sm" className="flex-1">
                            <Trash2 className="w-4 h-4 mr-2 text-destructive" />
                            {text.delete}
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCollectionsSection = () => {
    return (
      <div className="space-y-6">
        <Card className="liquid-card no-hover border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{text.collectionManagement}</CardTitle>
              {canCreate && (
                <Button className="liquid-button">
                  <Plus className="w-4 h-4 mr-2" />
                  {text.addCollection}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {collections.map((collection) => (
                <Card key={collection.id} className="liquid-card no-hover border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Grid3x3 className="w-5 h-5 text-primary" />
                        <div>
                          <CardTitle className="text-base">{collection.name}</CardTitle>
                          <CardDescription>
                            {collection.fields.length} {text.fields} • {collection.entries.length}{' '}
                            {text.entries}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          <Languages className="w-3 h-3 mr-1" />
                          {collection.language.toUpperCase()}
                        </Badge>
                        {(canEdit || canDelete) && (
                          <>
                            {canEdit && (
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4 mr-2" />
                                {text.edit}
                              </Button>
                            )}
                            {canDelete && (
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4 mr-2 text-destructive" />
                                {text.delete}
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-2">{text.fields}:</h4>
                        <div className="flex flex-wrap gap-2">
                          {collection.fields.map((field) => (
                            <Badge key={field.id} variant="secondary">
                              {field.name} ({field.type})
                              {field.required && <span className="text-destructive ml-1">*</span>}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {canCreate && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Plus className="w-4 h-4 mr-2" />
                            {text.addEntry}
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Plus className="w-4 h-4 mr-2" />
                            {text.addField}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <Button
          variant={activeSection === 'pages' ? 'default' : 'outline'}
          onClick={() => setActiveSection('pages')}
          className={activeSection === 'pages' ? 'liquid-button' : ''}
        >
          <FileText className="w-4 h-4 mr-2" />
          {text.pages}
        </Button>
        <Button
          variant={activeSection === 'blog' ? 'default' : 'outline'}
          onClick={() => setActiveSection('blog')}
          className={activeSection === 'blog' ? 'liquid-button' : ''}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          {text.blog}
        </Button>
        <Button
          variant={activeSection === 'media' ? 'default' : 'outline'}
          onClick={() => setActiveSection('media')}
          className={activeSection === 'media' ? 'liquid-button' : ''}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          {text.media}
        </Button>
        <Button
          variant={activeSection === 'menus' ? 'default' : 'outline'}
          onClick={() => setActiveSection('menus')}
          className={activeSection === 'menus' ? 'liquid-button' : ''}
        >
          <MenuIcon className="w-4 h-4 mr-2" />
          {text.menus}
        </Button>
        <Button
          variant={activeSection === 'blocks' ? 'default' : 'outline'}
          onClick={() => setActiveSection('blocks')}
          className={activeSection === 'blocks' ? 'liquid-button' : ''}
        >
          <Layers className="w-4 h-4 mr-2" />
          {text.blocks}
        </Button>
        <Button
          variant={activeSection === 'templates' ? 'default' : 'outline'}
          onClick={() => setActiveSection('templates')}
          className={activeSection === 'templates' ? 'liquid-button' : ''}
        >
          <Layout className="w-4 h-4 mr-2" />
          {text.templates}
        </Button>
        <Button
          variant={activeSection === 'collections' ? 'default' : 'outline'}
          onClick={() => setActiveSection('collections')}
          className={activeSection === 'collections' ? 'liquid-button' : ''}
        >
          <Grid3x3 className="w-4 h-4 mr-2" />
          {text.collections}
        </Button>
      </div>

      {/* Section Content */}
      {editingPageId ? (
        <div className="p-8">
          <p className="text-muted-foreground">Page editor coming soon...</p>
        </div>
      ) : (
        <>
          {activeSection === 'pages' && renderPagesSection()}
          {activeSection === 'blog' && renderBlogSection()}
          {activeSection === 'media' && renderMediaSection()}
          {activeSection === 'menus' && renderMenusSection()}
          {activeSection === 'blocks' && renderBlocksSection()}
          {activeSection === 'templates' && renderTemplatesSection()}
          {activeSection === 'collections' && renderCollectionsSection()}
        </>
      )}
    </div>
  );
}
