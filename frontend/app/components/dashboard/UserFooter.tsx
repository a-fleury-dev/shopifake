import { Button } from '../ui/button';
import { LogOut, Moon, Sun } from 'lucide-react';

interface UserFooterProps {
  currentUser: {
    name: string;
    role: 'admin' | 'manager';
  };
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  onLogout: () => void;
}

export function UserFooter({ currentUser, theme, setTheme, onLogout }: UserFooterProps) {
  return (
    <div className="mt-auto pt-6 border-t border-border/30 space-y-4">
      <div className="flex items-center gap-4 p-4 rounded-2xl ios-surface liquid-glow">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center">
          <span className="text-white font-bold">{currentUser.name.charAt(0).toUpperCase()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-foreground font-semibold truncate">{currentUser.name}</p>
          <p className="text-muted-foreground-enhanced text-sm">
            {currentUser.role === 'admin' ? 'Administrator' : 'Manager'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          variant="outline"
          size="sm"
          className="flex-1 ios-surface border-0 text-muted-foreground hover:text-foreground h-12 rounded-2xl font-semibold liquid-glow"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </Button>
        <Button
          onClick={onLogout}
          variant="outline"
          size="sm"
          className="flex-1 ios-surface border-0 text-red-600 hover:text-red-700 h-12 rounded-2xl font-semibold liquid-glow"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
