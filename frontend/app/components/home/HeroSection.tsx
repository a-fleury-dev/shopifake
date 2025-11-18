import { ArrowRight, ExternalLink } from 'lucide-react';
import { LiquidBackground } from '../common/LiquidBackground';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface HeroSectionProps {
  t: typeof import('../../lib/translations').translations.en;
}

export function HeroSection({ t }: HeroSectionProps) {
  const scrollToPlatforms = () => {
    const platformsSection = document.getElementById('platforms');
    if (platformsSection) {
      platformsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center pt-32 md:pt-40 pb-16 md:pb-20">
      <LiquidBackground />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left">
            <div className="mb-8 md:mb-10">
              <h1 className="text-foreground mb-3 leading-tight">{t.hero.title}</h1>
              <div className="iridescent-text-enhanced mb-3">{t.hero.titleHighlight}</div>
              <h1 className="text-foreground leading-tight">{t.hero.titleEnd}</h1>
            </div>

            <div className="text-xl md:text-2xl lg:text-3xl text-muted-foreground-enhanced mb-10 md:mb-14 leading-relaxed">
              <p>{t.hero.subtitle}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center lg:justify-start mb-8">
              <button
                onClick={scrollToPlatforms}
                className="liquid-button px-10 md:px-12 py-4 md:py-5 text-lg md:text-xl font-semibold text-primary-foreground rounded-xl md:rounded-2xl group inline-flex items-center justify-center gap-4"
              >
                <span className="flex items-center gap-4">
                  {t.hero.downloadNow}
                  <ArrowRight className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:translate-x-1" />
                </span>
              </button>

              <a
                href="https://shopifake.com/dashboard"
                className="ios-surface px-10 md:px-12 py-4 md:py-5 text-lg md:text-xl font-semibold text-foreground rounded-xl md:rounded-2xl group inline-flex items-center justify-center gap-4 hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center gap-4">
                  {t.hero.openWeb}
                  <ExternalLink className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110" />
                </span>
              </a>
            </div>
          </div>

          {/* Right: Dashboard Mockup */}
          <div className="liquid-card no-hover p-4 md:p-6 group">
            <div className="rounded-xl md:rounded-2xl overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1629963918958-1b62cfe3fe92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjBkYXNoYm9hcmQlMjBhbmFseXRpY3N8ZW58MXx8fHwxNzYwOTk0Nzk2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Dashboard shopifake"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
