import { ShoppingBag, Package, Shield, TrendingUp } from 'lucide-react';

interface KeyFeaturesSectionProps {
  t: typeof import('../../lib/translations').translations.en;
}

export function KeyFeaturesSection({ t }: KeyFeaturesSectionProps) {
  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-foreground mb-4 md:mb-6 px-4">Key Features</h2>
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground-enhanced max-w-3xl lg:max-w-4xl mx-auto px-4">
            {t.features.title}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          <div className="liquid-card p-6 md:p-8 text-center group">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 pastel-green-bg">
              <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
            </div>
            <h3 className="text-foreground mb-2 md:mb-3 text-base md:text-lg">
              {t.features.multiAsset.title}
            </h3>
            <p className="text-muted-foreground-enhanced text-sm md:text-base">
              {t.features.multiAsset.description}
            </p>
          </div>

          <div className="liquid-card p-6 md:p-8 text-center group">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 pastel-blue-bg">
              <Package className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
            </div>
            <h3 className="text-foreground mb-2 md:mb-3 text-base md:text-lg">
              {t.features.dappBrowser.title}
            </h3>
            <p className="text-muted-foreground-enhanced text-sm md:text-base">
              {t.features.dappBrowser.description}
            </p>
          </div>

          <div className="liquid-card p-6 md:p-8 text-center group">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 pastel-red-bg">
              <Shield className="w-8 h-8 md:w-10 md:h-10 text-red-600" />
            </div>
            <h3 className="text-foreground mb-2 md:mb-3 text-base md:text-lg">
              {t.features.security.title}
            </h3>
            <p className="text-muted-foreground-enhanced text-sm md:text-base">
              {t.features.security.description}
            </p>
          </div>

          <div className="liquid-card p-6 md:p-8 text-center group">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 pastel-purple-bg">
              <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />
            </div>
            <h3 className="text-foreground mb-2 md:mb-3 text-base md:text-lg">
              {t.features.rewards.title}
            </h3>
            <p className="text-muted-foreground-enhanced text-sm md:text-base">
              {t.features.rewards.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
