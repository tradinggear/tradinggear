import { create } from 'zustand';

interface SidebarState {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
  closeSidebarOnMobile: () => void;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  isSidebarOpen: true,
  isMobile: false,
  
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  setSidebarOpen: (isOpen: boolean) => set({ isSidebarOpen: isOpen }),
  
  setIsMobile: (isMobile: boolean) => {
    set({ isMobile });
    // PC에서는 사이드바 기본 열림, 모바일에서는 기본 닫힘
    if (!isMobile) {
      set({ isSidebarOpen: true });
    } else {
      set({ isSidebarOpen: false });
    }
  },
  
  closeSidebarOnMobile: () => {
    const { isMobile } = get();
    if (isMobile) {
      set({ isSidebarOpen: false });
    }
  },
}));