import { ShoppingBag, ArrowRight } from 'lucide-react';

interface FinalCTASectionProps {
  t: typeof import('../../lib/translations').translations.en;
  language: 'en' | 'fr';
}

export function FinalCTASection({ t, language }: FinalCTASectionProps) {
  return (
    <section id="platforms" className="py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center liquid-card no-hover p-10 md:p-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8">
            <ShoppingBag className="w-5 h-5" />
            <span className="font-semibold">
              {language === 'fr'
                ? 'Essai Gratuit - Aucune Carte Bancaire'
                : 'Free Trial - No Credit Card'}
            </span>
          </div>

          <h2 className="text-foreground mb-6 leading-tight">{t.platforms.title}</h2>

          <p className="text-xl md:text-2xl text-muted-foreground-enhanced mb-10 leading-relaxed max-w-2xl mx-auto">
            {t.platforms.subtitle}
          </p>

          <button className="liquid-button px-12 md:px-16 py-5 md:py-6 text-xl md:text-2xl font-semibold text-primary-foreground rounded-2xl group inline-flex items-center gap-4 hover:scale-105 transition-all duration-300">
            <span className="flex items-center gap-4">
              {t.platforms.getStarted}
              <ArrowRight className="w-7 h-7 md:w-8 md:h-8 transition-transform group-hover:translate-x-1" />
            </span>
          </button>

          <p className="text-sm text-muted-foreground-enhanced mt-6">
            {language === 'fr'
              ? 'Aucune carte bancaire requise • Annulation à tout moment • Support 24/7'
              : 'No credit card required • Cancel anytime • 24/7 Support'}
          </p>
        </div>
      </div>
    </section>
  );
}
