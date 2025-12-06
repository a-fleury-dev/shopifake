import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ShoppingBag,
  Mail,
  Lock,
  User,
  Shield,
  CheckCircle,
  AlertCircle,
  Home,
  Moon,
  Sun,
  ArrowRight,
  Hash,
} from 'lucide-react';
import type { Route } from './+types/auth';
import { translations } from '../lib/translations';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../lib/hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Authentication - shopifake' },
    { name: 'description', content: 'Sign in or create an account to manage your store' },
  ];
}

interface User {
  email: string;
  name: string;
  role: 'admin' | 'manager';
}

export default function Auth() {
  const navigate = useNavigate();
  const { theme, setTheme, language } = useTheme();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'manager'>('manager');
  
  // Temporary: Admin ID for development (default to 1)
  const [adminId, setAdminId] = useState<string>('1');

  // Error and success states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[language];

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateEmail(email)) {
      setError(t.auth.errors.invalidEmail);
      return;
    }

    if (!validatePassword(password)) {
      setError(t.auth.errors.passwordTooShort);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockUser: User = {
        email: email,
        name: email.split('@')[0],
        role: 'admin',
      };

      setSuccess(t.auth.success.loginSuccess);
      setIsLoading(false);

      // Store user and auth time in localStorage + temporary admin_id
      setTimeout(() => {
        const parsedAdminId = parseInt(adminId, 10);
        if (isNaN(parsedAdminId) || parsedAdminId <= 0) {
          setError('Invalid admin ID');
          return;
        }
        
        login(parsedAdminId);
        localStorage.setItem('shopifake_user', JSON.stringify(mockUser));
        localStorage.setItem('shopifake_auth_time', Date.now().toString());
        navigate('/shops');
      }, 1000);

      setEmail('');
      setPassword('');
    }, 1000);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError(t.auth.errors.nameRequired);
      return;
    }

    if (!validateEmail(email)) {
      setError(t.auth.errors.invalidEmail);
      return;
    }

    if (!validatePassword(password)) {
      setError(t.auth.errors.passwordTooShort);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockUser: User = {
        email: email,
        name: name,
        role: role,
      };

      setSuccess(t.auth.success.signupSuccess);
      setIsLoading(false);

      // Store user and auth time in localStorage + temporary admin_id
      setTimeout(() => {
        const parsedAdminId = parseInt(adminId, 10);
        if (isNaN(parsedAdminId) || parsedAdminId <= 0) {
          setError('Invalid admin ID');
          return;
        }
        
        login(parsedAdminId);
        localStorage.setItem('shopifake_user', JSON.stringify(mockUser));
        localStorage.setItem('shopifake_auth_time', Date.now().toString());
        navigate('/shops');
      }, 1000);

      setEmail('');
      setPassword('');
      setName('');
      setRole('manager');
    }, 1000);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setName('');
    setRole('manager');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background/95 backdrop-blur-xl relative">
      {/* Liquid Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="liquid-blob liquid-blob-1" />
        <div className="liquid-blob liquid-blob-2" />
        <div className="liquid-blob liquid-blob-3" />
      </div>

      {/* Header with Back and Theme Toggle */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="ios-surface w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 liquid-glow"
        >
          <Home className="w-5 h-5 text-foreground" />
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="ios-surface w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 liquid-glow"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-foreground" />
            ) : (
              <Sun className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      <div className="w-full max-w-md liquid-card no-hover p-8 md:p-10 relative z-10 mx-auto my-8">
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary to-green-600 flex items-center justify-center liquid-glow">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-foreground mb-3 text-2xl md:text-3xl font-bold">
            {isLogin ? t.auth.loginTitle : t.auth.signupTitle}
          </h2>
          <p className="text-muted-foreground-enhanced text-lg">
            {isLogin ? t.auth.loginSubtitle : t.auth.signupSubtitle}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-5 rounded-2xl ios-surface border border-red-400/30 flex items-center gap-4 liquid-glow">
            <div className="w-10 h-10 rounded-full red-gradient flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-5 rounded-2xl ios-surface border border-green-400/30 flex items-center gap-4 liquid-glow">
            <div className="w-10 h-10 rounded-full green-gradient flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <p className="text-green-600 dark:text-green-400 font-medium">{success}</p>
          </div>
        )}

        <form onSubmit={isLogin ? handleLoginSubmit : handleSignup} className="space-y-6">
          {!isLogin && (
            <div className="space-y-3">
              <Label
                htmlFor="name"
                className="text-foreground flex items-center gap-3 font-semibold"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                {t.auth.form.name}
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.auth.form.namePlaceholder}
                className="ios-surface border-0 text-foreground h-14 text-base rounded-2xl px-5"
                required={!isLogin}
              />
            </div>
          )}

          <div className="space-y-3">
            <Label
              htmlFor="email"
              className="text-foreground flex items-center gap-3 font-semibold"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              {t.auth.form.email}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.auth.form.emailPlaceholder}
              className="ios-surface border-0 text-foreground h-14 text-base rounded-2xl px-5"
              required
            />
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="password"
              className="text-foreground flex items-center gap-3 font-semibold"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Lock className="w-4 h-4 text-primary" />
              </div>
              {t.auth.form.password}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.auth.form.passwordPlaceholder}
              className="ios-surface border-0 text-foreground h-14 text-base rounded-2xl px-5"
              required
            />
            <p className="text-xs text-muted-foreground">{t.auth.form.passwordHint}</p>
          </div>

          {/* Temporary Admin ID Field - TODO: Remove when auth service is ready */}
          <div className="space-y-3 p-4 rounded-2xl border-2 border-dashed border-orange-400/50 bg-orange-50/50 dark:bg-orange-950/20">
            <Label
              htmlFor="adminId"
              className="text-foreground flex items-center gap-3 font-semibold"
            >
              <div className="w-8 h-8 rounded-full bg-orange-400/20 flex items-center justify-center">
                <Hash className="w-4 h-4 text-orange-500" />
              </div>
              Admin ID (Temporary)
            </Label>
            <Input
              id="adminId"
              type="number"
              min="1"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="Enter admin ID (default: 1)"
              className="ios-surface border-0 text-foreground h-14 text-base rounded-2xl px-5"
              required
            />
            <p className="text-xs text-orange-600 dark:text-orange-400">
              ⚠️ Development only - This will be replaced with proper authentication
            </p>
          </div>

          {!isLogin && (
            <div className="space-y-3">
              <Label
                htmlFor="role"
                className="text-foreground flex items-center gap-3 font-semibold"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                {t.auth.form.role}
              </Label>
              <Select
                value={role}
                onValueChange={(value: string) => setRole(value as 'admin' | 'manager')}
              >
                <SelectTrigger className="ios-surface border-0 text-foreground h-14 text-base rounded-2xl px-5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="liquid-card border-0">
                  <SelectItem value="manager" className="rounded-xl">
                    {t.auth.form.roleManager}
                  </SelectItem>
                  <SelectItem value="admin" className="rounded-xl">
                    {t.auth.form.roleAdmin}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full liquid-button h-14 text-lg font-semibold text-primary-foreground rounded-2xl flex items-center justify-center gap-3 mt-8 disabled:opacity-50"
          >
            {isLoading ? (
              <span>{t.auth.form.loading}</span>
            ) : (
              <>
                <span>{isLogin ? t.auth.loginButton : t.auth.signupButton}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={toggleAuthMode}
            className="text-primary hover:text-primary/80 transition-all duration-300 font-semibold text-base liquid-glow"
          >
            {isLogin ? t.auth.switchToSignup : t.auth.switchToLogin}
          </button>
        </div>

        <div className="mt-8 p-5 rounded-2xl ios-surface border border-orange-400/20">
          <p className="text-sm text-muted-foreground-enhanced text-center flex items-center justify-center gap-2">
            {t.auth.inactivityWarning}
          </p>
        </div>
      </div>
    </div>
  );
}
