interface LanguageToggleProps {
  language: 'en' | 'fr';
  setLanguage: (lang: 'en' | 'fr') => void;
}

export function LanguageToggle({ language, setLanguage }: LanguageToggleProps) {
  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
      className="ios-surface px-4 py-3 md:px-5 md:py-3 text-sm md:text-base font-medium transition-all duration-300 hover:scale-105 liquid-glow flex-shrink-0"
    >
      <span className="text-lg md:text-xl mr-2">{language === 'en' ? '🇺🇸' : '🇫🇷'}</span>
      {language === 'en' ? 'EN' : 'FR'}
    </button>
  );
}
