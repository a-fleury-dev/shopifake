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
import { useTheme } from '../contexts/ThemeContext';

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
  const { theme, setTheme, language, setLanguage } = useTheme();

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
