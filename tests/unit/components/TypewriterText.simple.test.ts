import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import TypewriterText from '../../../layers/base/app/components/TypewriterText.vue';

// Mock Element.animate
const mockAnimate = vi.fn(() => ({
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

Object.defineProperty(Element.prototype, 'animate', {
  value: mockAnimate,
  writable: true,
});

describe('TypewriterText - Simple', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders text content correctly', () => {
    const text = 'Hello World';
    const wrapper = mount(TypewriterText, {
      props: { text },
    });

    expect(wrapper.text()).toBe(text);
  });

  it('applies correct CSS classes', () => {
    const wrapper = mount(TypewriterText, {
      props: { text: 'Test' },
    });

    const span = wrapper.find('.typewriter-text');
    expect(span.exists()).toBe(true);
    expect(span.classes()).toContain('typewriter-text');
  });

  it('handles empty text gracefully', () => {
    const wrapper = mount(TypewriterText, {
      props: { text: '' },
    });

    expect(wrapper.text()).toBe('');
    expect(wrapper.find('.typewriter-text').exists()).toBe(true);
  });
});
