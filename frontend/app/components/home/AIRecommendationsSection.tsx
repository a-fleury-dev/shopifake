import { TrendingUp, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface AIRecommendationsSectionProps {
  t: typeof import('../../lib/translations').translations.en;
  language: 'en' | 'fr';
}

export function AIRecommendationsSection({ language }: AIRecommendationsSectionProps) {
  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Left: Mockup */}
          <div className="liquid-card no-hover p-6 md:p-8 group">
            <div className="rounded-xl md:rounded-2xl overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1646583288948-24548aedffd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwcmVjb21tZW5kYXRpb25zfGVufDF8fHx8MTc2MDk5NDc5N3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Recommandations IA"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right: Text */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">Intelligence Artificielle</span>
            </div>

            <h2 className="text-foreground mb-6 leading-tight">
              Recommandations Personnalisées & Analytics IA
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground-enhanced mb-8 leading-relaxed">
              {language === 'fr'
                ? 'Découvrez des produits similaires et tableau analytics avec notre moteur de recommandations IA pour optimiser vos ventes.'
                : 'Discover similar products and analytics dashboard with our AI recommendation engine to optimize your sales.'}
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="text-foreground mb-1">
                    {language === 'fr'
                      ? 'Produits Similaires Intelligents'
                      : 'Smart Similar Products'}
                  </h4>
                  <p className="text-muted-foreground-enhanced text-sm">
                    {language === 'fr'
                      ? "L'IA analyse le comportement pour suggérer les meilleurs produits"
                      : 'AI analyzes behavior to suggest the best products'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="text-foreground mb-1">
                    {language === 'fr'
                      ? 'Tableau Analytics en Temps Réel'
                      : 'Real-Time Analytics Dashboard'}
                  </h4>
                  <p className="text-muted-foreground-enhanced text-sm">
                    {language === 'fr'
                      ? 'Dashboard avec métriques avancées et insights automatisés'
                      : 'Dashboard with advanced metrics and automated insights'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="text-foreground mb-1">
                    {language === 'fr'
                      ? 'Optimisation du Cross-Selling'
                      : 'Cross-Selling Optimization'}
                  </h4>
                  <p className="text-muted-foreground-enhanced text-sm">
                    {language === 'fr'
                      ? 'Ajustez automatiquement vos stratégies pour maximiser les ventes'
                      : 'Automatically adjust your strategies to maximize sales'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
