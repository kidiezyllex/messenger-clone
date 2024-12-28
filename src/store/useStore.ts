import { create } from "zustand";

// Define the store state type
type StoreState = {
  selectConversationId: string | null;
  calling: boolean;

  getSelectConversationId: () => string | null;
  setSelectConversationId: (id: string) => void;

  getCalling: () => boolean;
  setCalling: (status: boolean) => void;
};

// Create the store
const useStore = create<StoreState>((set, get) => ({
  selectConversationId: null,
  calling: false,

  // Select Conversation ID methods
  getSelectConversationId: () => get().selectConversationId,
  setSelectConversationId: (id: string) => set({ selectConversationId: id }),

  // Calling state methods
  getCalling: () => get().calling,
  setCalling: (status: boolean) => set({ calling: status }),
}));

export default useStore;
