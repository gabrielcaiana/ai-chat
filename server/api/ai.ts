export default defineEventHandler(async (e) => {
  const body = await readBody(e)
  const { messages } = body;

  const id = messages.length.toString();
  const lastMessage = messages.at(-1)

  return {
    id,
    role: "assistant",
    content: `(server) You said: ${lastMessage.content}`,
  }
})