import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export function ThemeToggle({ theme, setTheme }: ThemeToggleProps) {
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="ios-surface w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 liquid-glow flex-shrink-0"
    >
      {theme === 'light' ? (
        <Moon className="w-6 h-6 md:w-7 md:h-7 text-foreground" />
      ) : (
        <Sun className="w-6 h-6 md:w-7 md:h-7 text-foreground" />
      )}
    </button>
  );
}
