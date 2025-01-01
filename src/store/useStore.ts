import { create } from "zustand";
import { User } from "../../lib/entity-types";

// Define the store state type
type StoreState = {
  selectConversationId: string | null;
  currentUserId: string | null;
  calling: boolean;
  showFileSideBar: boolean;
  member: User[];
  triggerMessage: boolean;

  getSelectConversationId: () => string | null;
  setSelectConversationId: (id: string) => void;

  getCalling: () => boolean;
  setCalling: (status: boolean) => void;

  getCurrentUserId: () => string | null;
  setCurrentUserId: (id: string) => void;

  getShowFileSideBar: () => boolean;
  setShowFileSideBar: (val: boolean) => void;

  getMember: () => User[];
  setMember: (members: User[]) => void;
  addMember: (member: User) => void;
  removeMember: (memberId: string) => void;

  getTriggerMessage: () => boolean;
  setTriggerMessage: (val: boolean) => void;
};

// Create the store
const useStore = create<StoreState>((set, get) => ({
  selectConversationId: null,
  currentUserId: "",
  calling: false,
  showFileSideBar: false,
  member: [],
  triggerMessage: false,

  // Select Conversation ID methods
  getSelectConversationId: () => get().selectConversationId,
  setSelectConversationId: (id: string) => set({ selectConversationId: id }),

  // Calling state methods
  getCalling: () => get().calling,
  setCalling: (status: boolean) => set({ calling: status }),

  // Theme methods
  getCurrentUserId: () => get().currentUserId,
  setCurrentUserId: (id: string) => set({ currentUserId: id }),

  // File Sidebar methods
  getShowFileSideBar: () => get().showFileSideBar,
  setShowFileSideBar: (val: boolean) => set({ showFileSideBar: val }),

  // Member methods
  getMember: () => get().member,
  setMember: (members: User[]) => set({ member: members }),
  addMember: (member: User) => set({ member: [...get().member, member] }),
  removeMember: (memberId: string) =>
    set({ member: get().member.filter((m) => m.id !== memberId) }),

  // Trigger Message methods
  getTriggerMessage: () => get().triggerMessage,
  setTriggerMessage: (val: boolean) => set({ triggerMessage: val }),
}));

export default useStore;
