import { create } from "zustand";
// Define the store state type
type StoreState = {
  selectConversationId: string | null;

  getSelectConversationId: () => string | null;
  setSelectConversationId: (id: string) => void;
};

// Create the store
const useStore = create<StoreState>((set, get) => ({
  selectConversationId: "",

  // Select Conversation ID methods
  getSelectConversationId: () => get().selectConversationId,
  setSelectConversationId: (id: string) => set({ selectConversationId: id }),
}));

export default useStore;
