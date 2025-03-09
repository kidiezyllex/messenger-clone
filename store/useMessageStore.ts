import { create } from 'zustand';
import { Message, User } from '../lib/entity-types';

interface MessageStore {
  // State
  newMessage: Message | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setNewMessage: (newMessage: Message | null) => void;
  updateNewMessage: (messageData: Partial<Message>) => void;
  clearNewMessage: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Utility functions
  markNewMessageAsSeen: (user: User) => void;
}

const useMessageStore = create<MessageStore>((set, get) => ({
  // Initial state
  newMessage: null,
  isLoading: false,
  error: null,
  
  // Actions
  setNewMessage: (newMessage) => set({ newMessage }),
  
  updateNewMessage: (messageData) => set((state) => ({
    newMessage: state.newMessage ? { ...state.newMessage, ...messageData } : null
  })),
  
  clearNewMessage: () => set({ newMessage: null }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  // Utility functions
  markNewMessageAsSeen: (user) => set((state) => {
    if (!state.newMessage) return state;
    
    // Kiểm tra xem user đã có trong danh sách seen chưa
    const userAlreadySeen = state.newMessage.seen.some((seenUser) => seenUser.id === user.id);
    
    if (!userAlreadySeen) {
      return {
        newMessage: {
          ...state.newMessage,
          seen: [...state.newMessage.seen, user]
        }
      };
    }
    
    return state;
  }),
}));

export default useMessageStore; 