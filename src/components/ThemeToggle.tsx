import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Force light mode on first load if no preference exists
    if (!localStorage.getItem('moonjab-theme')) {
      setTheme('light');
    }
  }, [setTheme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full hover:bg-accent/50 hover:scale-110 transition-all duration-300 group"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 group-hover:text-primary transition-colors" />
      ) : (
        <Sun className="h-5 w-5 group-hover:text-primary transition-colors" />
      )}
    </Button>
  );
};
