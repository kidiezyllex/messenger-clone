export interface User {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  hashedPassword?: string;
  lastConversationId?: string;
  friendRequestId?: string;
  createAt: Date;
  updateAt: Date;
  conversations: Conversation[];
  seenMessages: Message[];
  messages: Message[];
  sentMessages: Message[];
}

export interface Conversation {
  id: string;
  createdAt: Date;
  lastMessageAt: Date;
  name?: string;
  groupImage?: string;
  isGroup?: boolean;
  groupCreator?: User;
  groupCreatorId?: string;
  groupName?: string;
  messages: Message[];
  users: User[];
  messagesIds: String[];
  usersIds: String[];
  pinnedMessages?: Message[];
}

export interface Message {
  id: string;
  text?: string;
  type?: string;
  image?: string;
  file?: string;
  fileName?: string;
  createdAt: Date;
  seen: User[];
  conversation: Conversation;
  conversationId: string;
  user?: User;
  userId?: string;
  sender?: User;
  senderId?: string;
  replyTo?: Message;
  replyToId?: string;
  replies?: Message[];
  replyText?: string;
  taggedUsers?: string[];
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
