import { create } from "zustand";
import { Conversation, User } from "../../lib/entity-types";

// Define the store state type
type StoreState = {
  conversation: Conversation | null;
  user2: User | null;
  currentUserId: string | null;
  getConversation: () => Conversation | null;
  setConversation: (conversation: Conversation) => void;
  getUser2: () => User | null;
  setUser2: (user2: User) => void;
  getCurrentUserId: () => string | null;
  setCurrentUserId: (id: string) => void;
};

// Create the store
const useStore = create<StoreState>((set, get) => ({
  conversation: null,
  user2: null,
  currentUserId: null,

  // Conversation methods
  getConversation: () => get().conversation,
  setConversation: (conversation: Conversation) => set({ conversation }),

  // User methods
  getUser2: () => get().user2,
  setUser2: (user2: User) => set({ user2 }),

  // Current User ID methods
  getCurrentUserId: () => get().currentUserId,
  setCurrentUserId: (id: string) => set({ currentUserId: id }),
}));

export default useStore;