import { mount, type VueWrapper } from '@vue/test-utils';
import type { ComponentMountingOptions } from '@vue/test-utils';
import type { ComponentPublicInstance } from 'vue';

// Helper function to mount components with common options
export function mountComponent<T>(
  component: T,
  options: ComponentMountingOptions<T> = {}
): VueWrapper<ComponentPublicInstance> {
  return mount(component, {
    global: {
      stubs: {
        // Stub common Nuxt components
        NuxtLink: {
          template: '<a><slot /></a>',
          props: ['to'],
        },
        NuxtPage: {
          template: '<div><slot /></div>',
        },
        NuxtLayout: {
          template: '<div><slot /></div>',
        },
      },
      mocks: {
        // Common mocks
        $t: (key: string) => key,
        $route: {
          params: {},
          query: {},
          path: '/',
        },
        $router: {
          push: vi.fn(),
          replace: vi.fn(),
          back: vi.fn(),
          forward: vi.fn(),
        },
      },
    },
    ...options,
  });
}

// Helper to create mock data
export const createMockChat = (overrides = {}) => ({
  id: 'chat-1',
  title: 'Test Chat',
  messages: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockMessage = (overrides = {}) => ({
  id: 'msg-1',
  content: 'Test message',
  role: 'user' as const,
  timestamp: new Date().toISOString(),
  ...overrides,
});

export const createMockProject = (overrides = {}) => ({
  id: 'project-1',
  name: 'Test Project',
  description: 'Test project description',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Helper to wait for next tick
export const nextTick = () => new Promise(resolve => setTimeout(resolve, 0));

// Helper to create a mock store
export const createMockStore = (overrides = {}) => ({
  chats: [],
  projects: [],
  currentChat: null,
  currentProject: null,
  isLoading: false,
  error: null,
  ...overrides,
});

// Helper to create a mock composable
export const createMockComposable = (overrides = {}) => ({
  data: null,
  loading: false,
  error: null,
  execute: vi.fn(),
  ...overrides,
});
