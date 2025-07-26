import { v4 as uuidv4 } from "uuid";
import type { Chat } from "../../shared/types/types";
import { MOCK_CHAT } from "../../shared/utils/mockData";

const chats: Chat[] = [MOCK_CHAT];

export async function getAllChats(): Promise<Chat[]> {
  return [...chats]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .map((chat) => {
      const lastMessage = chat.messages.at(-1);
      return {
        ...chat,
        messages: lastMessage ? [lastMessage] : [],
      };
    });
}

export async function createChat(data: {
  title?: string;
  projectId?: string;
}): Promise<Chat> {
  const now = new Date();
  const newChat: Chat = {
    id: uuidv4(),
    title: data.title || "New Chat",
    messages: [],
    projectId: data.projectId || "",
    createdAt: now,
    updatedAt: now,
  };

  chats.push(newChat);
  return newChat;
}
