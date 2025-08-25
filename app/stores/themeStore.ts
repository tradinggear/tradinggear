import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'dark' | 'light';
  isClient: boolean;
  toggleTheme: () => void;
  setIsClient: (value: boolean) => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      isClient: false,
      
      toggleTheme: () => {
        const { theme, isClient } = get();
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        
        set({ theme: newTheme });
        
        if (isClient && typeof window !== 'undefined') {
          // Apply theme to document
          if (newTheme === 'light') {
            document.documentElement.classList.add('light');
          } else {
            document.documentElement.classList.remove('light');
          }
        }
      },
      
      setIsClient: (value: boolean) => {
        set({ isClient: value });
      },
      
      initializeTheme: () => {
        if (typeof window !== 'undefined') {
          set({ isClient: true });
          
          const { theme } = get();
          
          // Apply current theme to document
          if (theme === 'light') {
            document.documentElement.classList.add('light');
          } else {
            document.documentElement.classList.remove('light');
          }
        }
      },
    }),
    {
      name: 'theme-storage', // localStorage key
      partialize: (state) => ({ theme: state.theme }), // Only persist theme, not isClient
    }
  )
);