import { getAllChats } from "../../repository/chatRepository";

export default defineEventHandler(async (_e) => {
  return getAllChats();
});
