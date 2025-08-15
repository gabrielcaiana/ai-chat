import { vi } from 'vitest';
import { ref } from 'vue';

// Mock Nuxt composables
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      apiBase: 'http://localhost:3000',
    },
  }),
  useNuxtApp: () => ({
    $fetch: vi.fn(),
    $router: {
      push: vi.fn(),
      replace: vi.fn(),
    },
  }),
  navigateTo: vi.fn(),
  useRoute: () => ({
    params: {},
    query: {},
    path: '/',
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  useAppConfig: () => ({
    title: 'AI Chat App',
  }),
  useTemplateRef: (_name: string) => ref(null),
}));

// Mock Nuxt UI components
vi.mock('#nuxt/ui', () => ({
  UButton: {
    name: 'UButton',
    template: '<button><slot /></button>',
  },
  UInput: {
    name: 'UInput',
    template: '<input />',
  },
  UModal: {
    name: 'UModal',
    template: '<div><slot /></div>',
  },
  UCard: {
    name: 'UCard',
    template: '<div><slot /></div>',
  },
  UBadge: {
    name: 'UBadge',
    template: '<span><slot /></span>',
  },
  UIcon: {
    name: 'UIcon',
    template: '<span><slot /></span>',
  },
}));

// Mock MDC component
vi.mock('@nuxtjs/mdc', () => ({
  default: {
    name: 'MDC',
    template: '<div class="mdc-prose"><slot /></div>',
    props: ['value'],
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
  log: vi.fn(),
};
