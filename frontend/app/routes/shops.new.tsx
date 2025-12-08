import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Upload, Store, FileText, Link as LinkIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { createShop } from '../clients/shopApiClient';
import { uploadStoreBanner } from '../clients/imageApiClient';
import type { CreateShopRequestDTO } from '../lib/shops/dto';
import {useAuth} from "../contexts/AuthContext";

export function meta() {
  return [
    { title: 'Create Shop - shopifake' },
    { name: 'description', content: 'Create a new shop' },
  ];
}

export default function NewShopRoute() {
  const navigate = useNavigate();
  const { user, tokens } = useAuth();
  
  // Form state
  const [name, setName] = useState('');
  const [domainName, setDomainName] = useState('');
  const [description, setDescription] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const adminId = user?.id;
      if (!adminId) {
        throw new Error('No admin ID found');
      }

      let bannerUrl = '';

      // Step 1: Upload banner image if provided
      if (bannerFile) {
        setUploadProgress('Uploading banner image...');
        const tempStoreId = `temp-${Date.now()}`; // Temporary store ID for upload
        const uploadResponse = await uploadStoreBanner(tempStoreId, bannerFile);
        bannerUrl = uploadResponse.url;
        setUploadProgress('Image uploaded successfully!');
      }

      // Step 2: Create shop with the banner URL
      setUploadProgress('Creating shop...');
      const shopData: CreateShopRequestDTO = {
        adminId,
        name,
        domainName,
        description: description || undefined,
        bannerUrl: bannerUrl || undefined,
      };

      await createShop(shopData);
      setUploadProgress('Shop created successfully!');

      // Redirect to shops list
      setTimeout(() => {
        navigate('/shops');
      }, 500);
      
    } catch (err) {
      console.error('Failed to create shop:', err);
      setError(err instanceof Error ? err.message : 'Failed to create shop');
      setIsSubmitting(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="min-h-screen bg-background/95 backdrop-blur-xl relative">
      {/* Liquid Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="liquid-blob liquid-blob-1" />
        <div className="liquid-blob liquid-blob-2" />
        <div className="liquid-blob liquid-blob-3" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/shops')}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shops
          </Button>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-green-600 flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-foreground">Create New Shop</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Set up your new online store in minutes
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Card className="liquid-card p-5 mb-6 border-red-400/30 bg-red-50/50 dark:bg-red-950/20">
            <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          </Card>
        )}

        {/* Progress Alert */}
        {uploadProgress && (
          <Card className="liquid-card p-5 mb-6 border-blue-400/30 bg-blue-50/50 dark:bg-blue-950/20">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <p className="text-blue-600 dark:text-blue-400 font-medium">{uploadProgress}</p>
            </div>
          </Card>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="liquid-card p-8">
            <div className="space-y-6">
              {/* Shop Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-primary" />
                  Shop Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Sport Elite"
                  required
                  disabled={isSubmitting}
                  className="h-12"
                />
              </div>

              {/* Domain Name */}
              <div className="space-y-2">
                <Label htmlFor="domainName" className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-primary" />
                  Domain Name *
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="domainName"
                    type="text"
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    placeholder="e.g., sport-elite"
                    required
                    disabled={isSubmitting}
                    className="h-12"
                  />
                  <span className="text-muted-foreground whitespace-nowrap">
                    .shopifake.com
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use lowercase letters, numbers, and hyphens only
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your shop..."
                  disabled={isSubmitting}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Banner Upload */}
              <div className="space-y-2">
                <Label htmlFor="banner" className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  Banner Image (Optional)
                </Label>
                
                {/* Preview */}
                {bannerPreview && (
                  <div className="relative h-48 rounded-xl overflow-hidden mb-3">
                    <img
                      src={bannerPreview}
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* File Input */}
                <div className="relative">
                  <Input
                    id="banner"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    disabled={isSubmitting}
                    className="hidden"
                  />
                  <Label
                    htmlFor="banner"
                    className="flex items-center justify-center gap-2 h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary transition-colors"
                  >
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {bannerFile ? bannerFile.name : 'Click to upload banner image'}
                    </span>
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended size: 1600x400px. Max file size: 5MB
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex items-center gap-4">
              <Button
                type="submit"
                disabled={isSubmitting || !name || !domainName}
                className="liquid-button flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Store className="w-5 h-5 mr-2" />
                    Create Shop
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/shops')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}
