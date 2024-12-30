import { create } from "zustand";
import { User } from "../../lib/entity-types";

// Define the store state type
type StoreState = {
  selectConversationId: string | null;
  theme: string | null;
  calling: boolean;
  showFileSideBar: boolean;
  member: User[];

  getSelectConversationId: () => string | null;
  setSelectConversationId: (id: string) => void;

  getCalling: () => boolean;
  setCalling: (status: boolean) => void;

  getTheme: () => string | null;
  setTheme: (id: string) => void;

  getShowFileSideBar: () => boolean;
  setShowFileSideBar: (val: boolean) => void;

  getMember: () => User[];
  setMember: (members: User[]) => void;
  addMember: (member: User) => void;
  removeMember: (memberId: string) => void;
};

// Create the store
const useStore = create<StoreState>((set, get) => ({
  selectConversationId: null,
  theme: "",
  calling: false,
  showFileSideBar: false,
  member: [],

  // Select Conversation ID methods
  getSelectConversationId: () => get().selectConversationId,
  setSelectConversationId: (id: string) => set({ selectConversationId: id }),

  // Calling state methods
  getCalling: () => get().calling,
  setCalling: (status: boolean) => set({ calling: status }),

  // Theme methods
  getTheme: () => get().theme,
  setTheme: (themeColor: string) => set({ theme: themeColor }),

  // File Sidebar methods
  getShowFileSideBar: () => get().showFileSideBar,
  setShowFileSideBar: (val: boolean) => set({ showFileSideBar: val }),

  // Member methods
  getMember: () => get().member,
  setMember: (members: User[]) => set({ member: members }),
  addMember: (member: User) => set({ member: [...get().member, member] }),
  removeMember: (memberId: string) =>
    set({ member: get().member.filter((m) => m.id !== memberId) }),
}));

export default useStore;
