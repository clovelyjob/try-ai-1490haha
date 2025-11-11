import { useState, useEffect } from 'react';

export const useThemeLogo = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Get initial theme
    const stored = localStorage.getItem('clovely-theme') as 'light' | 'dark' | null;
    const initial = stored || 'light';
    setTheme(initial);

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return { theme, isDark: theme === 'dark' };
};
