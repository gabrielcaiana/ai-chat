import { describe, it, expect } from 'vitest';
import {
  createMockChat,
  createMockMessage,
  createMockProject,
  createMockStore,
  createMockComposable,
} from './utils';

describe('Test Utils', () => {
  describe('createMockChat', () => {
    it('creates chat with default values', () => {
      const chat = createMockChat();

      expect(chat.id).toBe('chat-1');
      expect(chat.title).toBe('Test Chat');
      expect(chat.messages).toEqual([]);
      expect(chat.createdAt).toBeDefined();
      expect(chat.updatedAt).toBeDefined();
    });

    it('allows overriding default values', () => {
      const chat = createMockChat({
        id: 'custom-id',
        title: 'Custom Title',
        messages: ['msg1', 'msg2'],
      });

      expect(chat.id).toBe('custom-id');
      expect(chat.title).toBe('Custom Title');
      expect(chat.messages).toEqual(['msg1', 'msg2']);
    });
  });

  describe('createMockMessage', () => {
    it('creates message with default values', () => {
      const message = createMockMessage();

      expect(message.id).toBe('msg-1');
      expect(message.content).toBe('Test message');
      expect(message.role).toBe('user');
      expect(message.timestamp).toBeDefined();
    });

    it('allows overriding default values', () => {
      const message = createMockMessage({
        id: 'custom-msg-id',
        content: 'Custom content',
        role: 'assistant',
      });

      expect(message.id).toBe('custom-msg-id');
      expect(message.content).toBe('Custom content');
      expect(message.role).toBe('assistant');
    });
  });

  describe('createMockProject', () => {
    it('creates project with default values', () => {
      const project = createMockProject();

      expect(project.id).toBe('project-1');
      expect(project.name).toBe('Test Project');
      expect(project.description).toBe('Test project description');
      expect(project.createdAt).toBeDefined();
      expect(project.updatedAt).toBeDefined();
    });

    it('allows overriding default values', () => {
      const project = createMockProject({
        id: 'custom-project-id',
        name: 'Custom Project Name',
        description: 'Custom description',
      });

      expect(project.id).toBe('custom-project-id');
      expect(project.name).toBe('Custom Project Name');
      expect(project.description).toBe('Custom description');
    });
  });

  describe('createMockStore', () => {
    it('creates store with default values', () => {
      const store = createMockStore();

      expect(store.chats).toEqual([]);
      expect(store.projects).toEqual([]);
      expect(store.currentChat).toBeNull();
      expect(store.currentProject).toBeNull();
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('allows overriding default values', () => {
      const store = createMockStore({
        chats: ['chat1'],
        projects: ['project1'],
        isLoading: true,
        error: 'Test error',
      });

      expect(store.chats).toEqual(['chat1']);
      expect(store.projects).toEqual(['project1']);
      expect(store.isLoading).toBe(true);
      expect(store.error).toBe('Test error');
    });
  });

  describe('createMockComposable', () => {
    it('creates composable with default values', () => {
      const composable = createMockComposable();

      expect(composable.data).toBeNull();
      expect(composable.loading).toBe(false);
      expect(composable.error).toBeNull();
      expect(composable.execute).toBeDefined();
    });

    it('allows overriding default values', () => {
      const composable = createMockComposable({
        data: 'test data',
        loading: true,
        error: 'test error',
      });

      expect(composable.data).toBe('test data');
      expect(composable.loading).toBe(true);
      expect(composable.error).toBe('test error');
    });
  });
});
