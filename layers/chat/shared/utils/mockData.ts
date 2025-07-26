import type { Chat, ChatMessage, Project } from "../types/types";
import { v4 as uuidv4} from 'uuid'

// Mock data for initial messages
const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: uuidv4(),
    role: "user",
    content: "Hello, can you help me with my Nuxt.js project?",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    role: "assistant",
    content:
      "Of course! I'd be happy to help with your Nuxt.js project. What specific questions or issues do you have?",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    role: "user",
    content: "How do I implement server-side rendering?",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    role: "assistant",
    content:
      "Nuxt.js provides server-side rendering out of the box! You don't need to do any special configuration for basic SSR. If you need specific optimizations, we can discuss those in detail.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock data for initial chat
const MOCK_CHAT: Chat = {
  id: "1",
  title: "Nuxt.js project help",
  messages: [...MOCK_MESSAGES],
  projectId: "1",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const MOCK_PROJECT: Project = {
  id: "1",
  name: "Nuxt Project",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export { MOCK_CHAT, MOCK_MESSAGES, MOCK_PROJECT };
