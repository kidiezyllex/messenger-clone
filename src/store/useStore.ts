import { create } from "zustand";

// Define the store state type
type StoreState = {
  selectConversationId: string | null;
  theme: string | null;
  calling: boolean;
  showFileSideBar: boolean;

  getSelectConversationId: () => string | null;
  setSelectConversationId: (id: string) => void;

  getCalling: () => boolean;
  setCalling: (status: boolean) => void;

  getTheme: () => string | null;
  setTheme: (id: string) => void;

  getShowFileSideBar: () => boolean;
  setShowFileSideBar: (val: boolean) => void;
};

// Create the store
const useStore = create<StoreState>((set, get) => ({
  selectConversationId: null,
  theme: "",
  calling: false,
  showFileSideBar: false,

  // Select Conversation ID methods
  getSelectConversationId: () => get().selectConversationId,
  setSelectConversationId: (id: string) => set({ selectConversationId: id }),

  // Calling state methods
  getCalling: () => get().calling,
  setCalling: (status: boolean) => set({ calling: status }),

  getTheme: () => get().theme,
  setTheme: (themeColor: string) => set({ theme: themeColor }),

  getShowFileSideBar: () => get().showFileSideBar,
  setShowFileSideBar: (val: boolean) => set({ showFileSideBar: val }),
}));

export default useStore;
