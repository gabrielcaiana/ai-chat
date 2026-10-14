import { describe, it, expect } from 'vitest';
import {
  createModel,
  generateChatResponse,
  generateChatTitle,
  streamChatResponse,
  toModelMessages,
} from '../../../layers/chat/server/services/ai-service';
import { generatingModel, streamingModel } from './mock-model';

async function collect(stream: AsyncIterable<string>) {
  let out = '';
  for await (const chunk of stream) out += chunk;
  return out;
}

describe('ai-service', () => {
  describe('createModel', () => {
    it.each([
      ['openai', 'gpt-6-luna', 'openai'],
      ['anthropic', 'claude-haiku-5-5', 'anthropic'],
      ['ollama', 'qwen2.5:0.5b', 'ollama'],
    ])('creates a %s model without casts', (provider, model, expected) => {
      const m = createModel(provider, model, 'key');
      expect(typeof m).toBe('object');
      if (typeof m === 'string') throw new Error('unexpected string model');
      expect(m.modelId).toBe(model);
      expect(m.provider).toContain(expected);
    });

    it('defaults to OpenAI for unknown providers', () => {
      const m = createModel('unknown', 'gpt-6-luna', 'key');
      if (typeof m === 'string') throw new Error('unexpected string model');
      expect(m.provider).toContain('openai');
    });
  });

  describe('toModelMessages', () => {
    it('strips DB-only columns and keeps role/content', () => {
      const rows = [
        { id: '1', chatId: 'c', role: 'user' as const, content: 'hi' },
        { id: '2', chatId: 'c', role: 'assistant' as const, content: 'yo' },
      ];
      expect(toModelMessages(rows)).toEqual([
        { role: 'user', content: 'hi' },
        { role: 'assistant', content: 'yo' },
      ]);
    });
  });

  describe('generateChatResponse', () => {
    it('returns trimmed text from the model', async () => {
      const text = await generateChatResponse({
        model: generatingModel('  hello world  '),
        messages: [{ role: 'user', content: 'hi' }],
      });
      expect(text).toBe('hello world');
    });

    it('rejects an empty message list', async () => {
      await expect(
        generateChatResponse({ model: generatingModel('x'), messages: [] })
      ).rejects.toThrow('Messages must be an array and not empty');
    });
  });

  describe('generateChatTitle', () => {
    it('sends a system prompt plus the first message', async () => {
      const model = generatingModel(' Vue Reactivity ');
      const title = await generateChatTitle(model, 'How does ref work?');
      expect(title).toBe('Vue Reactivity');
      const prompt = model.doGenerateCalls[0]!.prompt;
      expect(prompt[0]!.role).toBe('system');
      expect(prompt[1]!.role).toBe('user');
    });
  });

  describe('streamChatResponse', () => {
    it('streams text chunks in order', async () => {
      const stream = await streamChatResponse(
        streamingModel(['Hel', 'lo', '!']),
        [{ role: 'user', content: 'hi' }]
      );
      expect(await collect(stream)).toBe('Hello!');
    });

    it('rejects an empty message list', async () => {
      await expect(
        streamChatResponse(streamingModel(['x']), [])
      ).rejects.toThrow('Invalid messages format');
    });
  });
});
