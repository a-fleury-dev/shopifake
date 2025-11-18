import { useState, useEffect, useRef } from 'react';
import { Download, LogIn, BookOpen, MonitorSpeaker, Star, Shield, Menu, X } from 'lucide-react';
import { ShopifyLogo } from '../common/ShopifyLogo';
import { ThemeToggle } from '../common/ThemeToggle';
import { LanguageToggle } from '../common/LanguageToggle';

const navIcons = {
  blog: BookOpen,
  interface: MonitorSpeaker,
  features: Star,
  security: Shield,
  platforms: Download,
};

interface HeaderProps {
  t: typeof import('../../lib/translations').translations.en;
  language: 'en' | 'fr';
  setLanguage: (lang: 'en' | 'fr') => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  onAuthClick: () => void;
}

export function Header({ t, language, setLanguage, theme, setTheme, onAuthClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerWidth, setHeaderWidth] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleResize = () => {
      if (headerRef.current) {
        setHeaderWidth(headerRef.current.offsetWidth);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scrollToPlatforms = () => {
    const platformsSection = document.getElementById('platforms');
    if (platformsSection) {
      platformsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shouldShowIconOnly = headerWidth < 1400 && headerWidth > 0;

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'glass-strong-transparent' : 'glass-transparent'}`}
    >
      <div className="container mx-auto px-4 md:px-6 py-5 md:py-6">
        <div className="flex items-center justify-between">
          <button
            onClick={scrollToTop}
            className="flex items-start gap-3 md:gap-4 header-logo-enhanced header-logo-left-aligned min-w-0 flex-shrink-0 transition-all duration-300"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center flex-shrink-0">
              <ShopifyLogo className="w-12 h-12 md:w-14 md:h-14" />
            </div>
            <div className="hidden sm:block min-w-0 text-left">
              <h4 className="text-foreground truncate leading-tight">shopifake</h4>
              <p className="text-muted-foreground truncate leading-tight">E-Commerce Platform</p>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {Object.entries(t.nav).map(([key, item]) => (
              <a
                key={key}
                href={`#${key}`}
                className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group text-base whitespace-nowrap"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <LanguageToggle language={language} setLanguage={setLanguage} />

            {/* Auth button */}
            <button
              onClick={onAuthClick}
              className="hidden sm:flex ios-surface w-12 h-12 md:w-14 md:h-14 rounded-full items-center justify-center transition-all duration-300 hover:scale-105 liquid-glow flex-shrink-0"
            >
              <LogIn className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
            </button>

            {shouldShowIconOnly ? (
              <button
                onClick={scrollToPlatforms}
                className="hidden sm:flex liquid-button w-12 h-12 md:w-14 md:h-14 rounded-full items-center justify-center transition-all duration-300 hover:scale-105"
              >
                <Download className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
              </button>
            ) : (
              <button
                onClick={scrollToPlatforms}
                className="hidden sm:block liquid-button px-5 md:px-7 py-3 md:py-4 text-sm md:text-base font-medium text-primary-foreground rounded-lg md:rounded-xl whitespace-nowrap"
              >
                {t.hero.downloadNow}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden ios-surface w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 flex-shrink-0"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 md:w-7 md:h-7 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 md:w-7 md:h-7 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden mt-6 pt-6 border-t border-border/50">
            <nav className="flex flex-col gap-5">
              {Object.entries(t.nav).map(([key, item]) => {
                const IconComponent = navIcons[key as keyof typeof navIcons];
                return (
                  <a
                    key={key}
                    href={`#${key}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-foreground hover:text-primary transition-all duration-300 font-medium py-3 text-lg flex items-center gap-4"
                  >
                    <IconComponent className="w-6 h-6 text-primary" />
                    {item}
                  </a>
                );
              })}
              <button
                onClick={() => {
                  onAuthClick();
                  setMobileMenuOpen(false);
                }}
                className="ios-surface px-6 py-3 text-base font-medium text-foreground rounded-xl mt-4 text-center flex items-center gap-3 justify-center"
              >
                <LogIn className="w-5 h-5 text-primary" />
                {language === 'en' ? 'Admin Login' : 'Connexion Admin'}
              </button>
              <button
                onClick={() => {
                  scrollToPlatforms();
                  setMobileMenuOpen(false);
                }}
                className="liquid-button px-6 py-3 text-base font-medium text-primary-foreground rounded-xl mt-2 text-center flex items-center gap-3 justify-center"
              >
                <Download className="w-5 h-5" />
                {t.hero.downloadNow}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
