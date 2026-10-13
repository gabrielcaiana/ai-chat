import { describe, it, expect, vi } from 'vitest';

// useCompare pulls Nuxt auto-imports at call time only; parseNdjsonLines is pure.
vi.stubGlobal('useSettings', () => ({}));
const { parseNdjsonLines } = await import(
  '../../layers/chat/app/composables/useCompare'
);

describe('parseNdjsonLines', () => {
  it('parses complete lines and keeps the partial tail', () => {
    const { events, rest } = parseNdjsonLines(
      '{"type":"delta","index":0,"text":"a"}\n{"type":"del'
    );
    expect(events).toEqual([{ type: 'delta', index: 0, text: 'a' }]);
    expect(rest).toBe('{"type":"del');
  });

  it('ignores blank lines', () => {
    expect(parseNdjsonLines('\n\n').events).toEqual([]);
  });
});
