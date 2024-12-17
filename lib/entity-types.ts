export interface User {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  hashedPassword?: string;
  createAt: Date;
  updateAt: Date;
  conversations: Conversation[];
  seenMessages: Message[];
  accounts: Account[];
  messages: Message[];
  sentMessages: Message[];
}

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  user: User;
}

export interface Conversation {
  id: string;
  createdAt: Date;
  lastMessageAt: Date;
  name?: string;
  isGroup?: boolean;
  messages: Message[];
  users: User[];
  messagesIds: String[];
  usersIds: String[];
}

export interface Message {
  id: string;
  body?: string;
  image?: string;
  createdAt: Date;
  seen: User[];
  conversation: Conversation;
  conversationId: string;
  user?: User;
  userId?: string;
  sender: User;
  senderId: string;
}

export interface StickerImage {
  id: string;
  url?: string;
}

export interface Sticker {
  id: string;
  name?: string;
  value: StickerImage[];
}
