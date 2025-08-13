export default function useChats() {
  const chats = useState<Chat[]>("chats", () => []);

  /**
   * 1. $fetch (imperativo):
   * - Faz uma requisição HTTP diretamente, sem reatividade ou integração com SSR.
   * - Ideal para chamadas manuais em eventos, botões ou dentro de funções puras.
   * - Não serializa dados para o cliente (sem hydration).
   */
  // const data = await $fetch<Chat[]>("/api/chats");

  /**
   * 2. useAsyncData (SSR + hydration):
   * - Executa no servidor e os dados são repassados ao cliente via hydration.
   * - Reativo, com cache, deduplicação e suporte a revalidação.
   * - Útil quando você quer mais controle sobre a chave e configuração do fetch.
   */
  // const {
  //   data: chats,
  //   status,
  //   execute,
  // } = useAsyncData<Chat[]>(
  //   "chats",
  //   () => {
  //     console.log("fetch");
  //     return $fetch("/api/chats");
  //   },
  //   {
  //     immediate: false,
  //     default: () => [],
  //   }
  // );

  /**
   * 3. useFetch (recomendado para a maioria dos casos):
   * - Wrapper de useAsyncData + $fetch com tipagem automática e sintaxe mais limpa.
   * - Executa no servidor na primeira carga e envia os dados para o cliente via hydration.
   * - Excelente para chamadas reativas e integradas com o ciclo de vida do Nuxt.
   */
  const { data, execute, status } = useFetch<Chat[]>("/api/chats", {
    immediate: false,
    key: "chats",
    default: () => [],
  });

  async function fetchChats() {
    if (status.value !== "idle") return;
    await execute();
    chats.value = data.value;
  }

  async function createChat(
    options: { projectId?: string; title?: string } = {}
  ) {
    const newChat = await $fetch<Chat>("/api/chats", {
      method: "POST",
      body: {
        title: options.title,
        projectId: options.projectId,
      },
    });

    chats.value.push(newChat);

    return newChat;
  }

  async function createChatAndNavigate(options: { projectId?: string } = {}) {
    const chat = await createChat(options);

    if (chat.projectId) {
      await navigateTo(`/projects/${chat.projectId}/chats/${chat.id}`);
    } else {
      await navigateTo(`/chats/${chat.id}`, { replace: true });
    }
  }

  function chatsInProject(projectId: string) {
    return chats.value.filter((chat) => chat.projectId === projectId);
  }

  async function prefetchChatMessages() {
    const recentChats = chats.value
      .toSorted(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 2);

    await Promise.all(
      recentChats.map(async (chat) => {
        try {
          const messages = await $fetch<ChatMessage[]>(
            `/api/chats/${chat.id}/messages`
          );

          const targetChat = chats.value.find((c) => c.id === chat.id);
          if (targetChat) {
            targetChat.messages = messages;
          }
        } catch (error) {
          console.error(`Failed to fetch messages for chat ${chat.id}`, error);
        }
      })
    );
  }

  return {
    chats,
    fetchChats,
    createChat,
    chatsInProject,
    createChatAndNavigate,
    prefetchChatMessages,
  };
}
