import { Moon, Sun, Globe } from 'lucide-react';
import { Button } from '../ui/button';

interface ShopsHeaderProps {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  language: 'en' | 'fr';
  setLanguage: (language: 'en' | 'fr') => void;
}

export function ShopsHeader({ theme, setTheme, language, setLanguage }: ShopsHeaderProps) {
  return (
    <div className="fixed top-0 right-0 z-50 p-4 md:p-6 flex items-center gap-3">
      {/* Language Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
        className="ios-surface h-10 w-10 p-0 hover:bg-primary/10"
      >
        <Globe className="h-4 w-4" />
      </Button>

      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="ios-surface h-10 w-10 p-0 hover:bg-primary/10"
      >
        {theme === 'dark' ? (
          <Sun className="h-4 w-4 text-yellow-500" />
        ) : (
          <Moon className="h-4 w-4 text-blue-600" />
        )}
      </Button>
    </div>
  );
}
