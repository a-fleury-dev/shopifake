import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { Route } from './+types/home';
import { translations } from '../lib/translations';
import {
  Header,
  HeroSection,
  KeyFeaturesSection,
  DashboardSection,
  AIRecommendationsSection,
  FinalCTASection,
  Footer,
} from '../components/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'shopifake - The Ultimate E-Commerce Platform' },
    {
      name: 'description',
      content:
        'Manage your online store with powerful tools for inventory, sales, and customer engagement.',
    },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'en' | 'fr'>('en');

  useEffect(() => {
    // Sync with root theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }

    // Get saved language preference
    const savedLanguage = localStorage.getItem('language') as 'en' | 'fr' | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Update document class when theme changes
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Save language preference
    localStorage.setItem('language', language);
  }, [language]);

  const t = translations[language];

  const handleAuthClick = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen">
      <Header
        t={t}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
        onAuthClick={handleAuthClick}
      />
      <HeroSection t={t} />
      <KeyFeaturesSection t={t} />
      <DashboardSection t={t} />
      <AIRecommendationsSection t={t} language={language} />
      <FinalCTASection t={t} language={language} />
      <Footer t={t} />
    </div>
  );
}
