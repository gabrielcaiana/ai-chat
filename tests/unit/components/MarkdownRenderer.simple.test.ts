import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MarkdownRenderer from '../../../layers/base/app/components/MarkdownRenderer.vue';

describe('MarkdownRenderer - Simple', () => {
  it('renders with correct container class', () => {
    const content = '# Hello World';
    const wrapper = mount(MarkdownRenderer, {
      props: { content },
    });

    expect(wrapper.find('.markdown-container').exists()).toBe(true);
  });

  it('handles empty content', () => {
    const wrapper = mount(MarkdownRenderer, {
      props: { content: '' },
    });

    expect(wrapper.find('.markdown-container').exists()).toBe(true);
  });

  it('renders with proper structure', () => {
    const wrapper = mount(MarkdownRenderer, {
      props: { content: 'Test' },
    });

    // Should have container div
    expect(wrapper.find('.markdown-container').exists()).toBe(true);
  });
});
