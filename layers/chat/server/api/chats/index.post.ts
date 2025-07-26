import { createChat } from "../../repository/chatRepository";

export default defineEventHandler((_e) => {
  return createChat({
    title: "New Chat",
  });
});
