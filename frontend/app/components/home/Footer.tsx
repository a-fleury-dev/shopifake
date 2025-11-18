import { Twitter, Github } from 'lucide-react';
import { ShopifyLogo } from '../common/ShopifyLogo';

interface FooterProps {
  t: typeof import('../../lib/translations').translations.en;
}

export function Footer({ t }: FooterProps) {
  return (
    <footer className="py-12 md:py-16 border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <ShopifyLogo className="w-12 h-12" />
              <span className="text-2xl text-foreground">shopifake</span>
            </div>
            <p className="text-muted-foreground-enhanced text-base md:text-lg mb-6">
              {t.footer.tagline}
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-muted-foreground-enhanced hover:text-primary transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#security"
                  className="text-muted-foreground-enhanced hover:text-primary transition-colors"
                >
                  Security
                </a>
              </li>
              <li>
                <a
                  href="#platforms"
                  className="text-muted-foreground-enhanced hover:text-primary transition-colors"
                >
                  Platforms
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground-enhanced hover:text-primary transition-colors"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground-enhanced hover:text-primary transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  className="text-muted-foreground-enhanced hover:text-primary transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground-enhanced hover:text-primary transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground-enhanced hover:text-primary transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 text-center">
          <p className="text-muted-foreground-enhanced">{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
