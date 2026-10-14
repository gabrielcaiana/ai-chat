<script setup lang="ts">
  defineProps<{
    isOpen: boolean;
  }>();

  const route = useRoute();
  const { projects, createProject } = useProjects();
  const { chats, chatsInProject, createChatAndNavigate } = useChats();
  const { load } = useSettings();

  onMounted(() => load());

  function isCurrentProject(projectId: string) {
    return route.params.projectId === projectId;
  }

  const chatsInCurrentProject = computed(() =>
    chatsInProject(route.params.projectId as string)
  );

  function isActiveChat(chatId: string) {
    return route.params.id === chatId;
  }

  async function handleCreateProject() {
    const newProject = await createProject();
    await createChatAndNavigate({ projectId: newProject.id });
  }

  async function handleCreateChat() {
    await createChatAndNavigate();
  }

  const chatsWithoutProject = computed(() =>
    chats.value.filter(c => c.projectId === null)
  );

  function filterChats(startDays: number, endDays?: number) {
    return computed(() =>
      filterChatsByDateRange(chatsWithoutProject.value, startDays, endDays)
    );
  }

  const todayChats = filterChats(-1, 1);
  const lastWeekChats = filterChats(1, 7);
  const lastMonthChats = filterChats(7, 30);
  const olderChats = filterChats(30);
</script>

<template>
  <aside class="sb" :class="{ 'sb--closed': !isOpen }">
    <!-- Lab tools -->
    <div class="sb-section">
      <div class="sb-section__head">
        <span class="sb-section__label">Lab</span>
      </div>
      <div class="sb-nav">
        <NuxtLink
          to="/compare"
          class="sb-item"
          :class="{ 'sb-item--active': route.path.startsWith('/compare') }"
          data-testid="nav-compare"
        >
          <UIcon name="i-lucide-columns-3" class="sb-item__icon" />
          <span class="sb-item__label">Compare models</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Projects -->
    <div v-if="projects?.length" class="sb-section">
      <div class="sb-section__head">
        <span class="sb-section__label">Projects</span>
        <button
          class="sb-section__add"
          title="New project"
          @click="handleCreateProject"
        >
          <UIcon name="i-lucide-plus" />
        </button>
      </div>

      <div class="sb-nav">
        <div v-for="project in projects" :key="project.id" class="sb-project">
          <NuxtLink
            :to="`/projects/${project.id}`"
            class="sb-item sb-item--project"
            :class="{ 'sb-item--active': isCurrentProject(project.id) }"
          >
            <UIcon name="i-lucide-folder" class="sb-item__icon" />
            <span class="sb-item__label">{{ project.name }}</span>
            <UIcon
              v-if="isCurrentProject(project.id)"
              name="i-lucide-chevron-down"
              class="sb-item__chevron"
            />
            <UIcon
              v-else
              name="i-lucide-chevron-right"
              class="sb-item__chevron"
            />
          </NuxtLink>

          <!-- Expanded project chats -->
          <div v-if="isCurrentProject(project.id)" class="sb-project-chats">
            <NuxtLink
              v-for="chat in chatsInCurrentProject"
              :key="chat.id"
              :to="`/projects/${project.id}/chats/${chat.id}`"
              class="sb-item sb-item--child"
              :class="{ 'sb-item--active-child': isActiveChat(chat.id) }"
            >
              <UIcon
                name="i-lucide-message-square"
                class="sb-item__icon sb-item__icon--sm"
              />
              <span class="sb-item__label">{{
                chat.title || 'Untitled Chat'
              }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div
      v-if="projects?.length && chatsWithoutProject.length"
      class="sb-divider"
    />

    <!-- Chat history -->
    <div v-if="chatsWithoutProject.length" class="sb-section sb-section--chats">
      <div v-if="todayChats.length" class="sb-group">
        <span class="sb-group__label">Today</span>
        <div class="sb-nav">
          <NuxtLink
            v-for="chat in todayChats"
            :key="chat.id"
            :to="`/chats/${chat.id}`"
            class="sb-item"
            :class="{ 'sb-item--active': isActiveChat(chat.id) }"
          >
            <UIcon name="i-lucide-message-circle" class="sb-item__icon" />
            <span class="sb-item__label">{{
              chat.title || 'Untitled Chat'
            }}</span>
          </NuxtLink>
        </div>
      </div>

      <div v-if="lastWeekChats.length" class="sb-group">
        <span class="sb-group__label">Last 7 Days</span>
        <div class="sb-nav">
          <NuxtLink
            v-for="chat in lastWeekChats"
            :key="chat.id"
            :to="`/chats/${chat.id}`"
            class="sb-item"
            :class="{ 'sb-item--active': isActiveChat(chat.id) }"
          >
            <UIcon name="i-lucide-message-circle" class="sb-item__icon" />
            <span class="sb-item__label">{{
              chat.title || 'Untitled Chat'
            }}</span>
          </NuxtLink>
        </div>
      </div>

      <div v-if="lastMonthChats.length" class="sb-group">
        <span class="sb-group__label">Last 30 Days</span>
        <div class="sb-nav">
          <NuxtLink
            v-for="chat in lastMonthChats"
            :key="chat.id"
            :to="`/chats/${chat.id}`"
            class="sb-item"
            :class="{ 'sb-item--active': isActiveChat(chat.id) }"
          >
            <UIcon name="i-lucide-message-circle" class="sb-item__icon" />
            <span class="sb-item__label">{{
              chat.title || 'Untitled Chat'
            }}</span>
          </NuxtLink>
        </div>
      </div>

      <div v-if="olderChats.length" class="sb-group">
        <span class="sb-group__label">Older</span>
        <div class="sb-nav">
          <NuxtLink
            v-for="chat in olderChats"
            :key="chat.id"
            :to="`/chats/${chat.id}`"
            class="sb-item"
            :class="{ 'sb-item--active': isActiveChat(chat.id) }"
          >
            <UIcon name="i-lucide-message-circle" class="sb-item__icon" />
            <span class="sb-item__label">{{
              chat.title || 'Untitled Chat'
            }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="!chatsWithoutProject.length && !projects?.length"
      class="sb-empty"
    >
      <div class="sb-empty__icon">
        <UIcon name="i-lucide-message-square-plus" />
      </div>
      <p class="sb-empty__text">No chats yet</p>
      <button class="sb-empty__btn" @click="handleCreateChat">
        <UIcon name="i-lucide-plus" />
        Start a conversation
      </button>
    </div>

    <!-- Bottom: new project button (when no projects yet) -->
    <div v-if="!projects?.length" class="sb-footer">
      <button class="sb-footer__btn" @click="handleCreateProject">
        <UIcon name="i-lucide-folder-plus" />
        <span>New Project</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
  .sb {
    position: fixed;
    top: var(--h-header-h);
    left: 0;
    bottom: 0;
    width: var(--h-sidebar-w);
    background: var(--h-surface);
    border-right: 1px solid var(--h-border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 50;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sb--closed {
    transform: translateX(-100%);
  }

  /* Section */
  .sb-section {
    padding: 0.75rem 0;
    flex-shrink: 0;
  }

  .sb-section--chats {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }

  .sb-section__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem 0.375rem;
  }

  .sb-section__label {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--ui-text-dimmed);
  }

  .sb-section__add {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    color: var(--ui-text-dimmed);
    font-size: 0.8125rem;
    transition:
      background 0.15s,
      color 0.15s;
  }
  .sb-section__add:hover {
    background: var(--h-surface-3);
    color: var(--ui-text-muted);
  }

  /* Groups */
  .sb-group {
    margin-bottom: 0.25rem;
  }

  .sb-group__label {
    display: block;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--ui-text-dimmed);
    padding: 0.5rem 1rem 0.25rem;
  }

  /* Nav items */
  .sb-nav {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .sb-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 1rem;
    border-radius: 0;
    color: var(--ui-text-muted);
    text-decoration: none;
    font-size: 0.8125rem;
    font-weight: 400;
    transition:
      background 0.12s,
      color 0.12s;
    position: relative;
    min-width: 0;
  }

  .sb-item:hover {
    background: var(--h-surface-3);
    color: var(--ui-text);
  }

  .sb-item--project {
    font-weight: 500;
  }

  .sb-item--child {
    padding-left: 2rem;
    font-size: 0.78125rem;
  }

  .sb-item--active {
    background: var(--h-cyan-dim);
    color: var(--h-cyan);
  }
  .sb-item--active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--h-cyan);
    border-radius: 0 1px 1px 0;
  }
  .sb-item--active:hover {
    background: rgba(14, 165, 233, 0.1);
    color: var(--h-cyan);
  }

  .sb-item--active-child {
    background: var(--h-cyan-dim);
    color: #38bdf8;
  }
  .sb-item--active-child::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #38bdf8;
    border-radius: 0 1px 1px 0;
  }

  .sb-item__icon {
    font-size: 0.875rem;
    flex-shrink: 0;
  }

  .sb-item__icon--sm {
    font-size: 0.75rem;
  }

  .sb-item__label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sb-item__chevron {
    font-size: 0.6875rem;
    flex-shrink: 0;
    color: var(--ui-text-dimmed);
  }

  .sb-project-chats {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  /* Divider */
  .sb-divider {
    height: 1px;
    background: var(--h-border);
    margin: 0.25rem 0;
  }

  /* Empty state */
  .sb-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.5rem;
    text-align: center;
    gap: 0.75rem;
  }

  .sb-empty__icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--h-surface-3);
    border: 1px solid var(--h-border);
    border-radius: 8px;
    color: var(--ui-text-dimmed);
    font-size: 1rem;
  }

  .sb-empty__text {
    font-size: 0.8125rem;
    color: var(--ui-text-dimmed);
  }

  .sb-empty__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.4375rem 0.875rem;
    background: var(--h-surface-3);
    border: 1px solid var(--h-border);
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--ui-text-muted);
    transition:
      border-color 0.15s,
      color 0.15s;
  }
  .sb-empty__btn:hover {
    border-color: var(--h-border-hi);
    color: var(--ui-text);
  }

  /* Footer */
  .sb-footer {
    padding: 0.75rem;
    border-top: 1px solid var(--h-border);
    flex-shrink: 0;
  }

  .sb-footer__btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: var(--h-surface-2);
    border: 1px solid var(--h-border);
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--ui-text-dimmed);
    transition:
      border-color 0.15s,
      color 0.15s,
      background 0.15s;
  }
  .sb-footer__btn:hover {
    border-color: var(--h-border-hi);
    color: var(--ui-text-muted);
    background: var(--h-surface-3);
  }
</style>
