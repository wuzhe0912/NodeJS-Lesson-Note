import { create } from 'zustand';
import { ThemeStore } from '@/types/theme.types';

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: localStorage.getItem('chat-theme') || 'coffee',
  setTheme: (theme) => {
    localStorage.setItem('chat-theme', theme);
    set({ theme });
  },
}));
