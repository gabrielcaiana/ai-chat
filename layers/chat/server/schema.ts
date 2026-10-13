import { z } from 'zod';

// Message role enum and type definition
const MessageRole = z.enum(['user', 'assistant']);

// Base message schema
export const MessageSchema = z
  .object({
    content: z.string(),
    role: MessageRole,
    id: z.uuid({ version: 'v4' }).optional(),
    chatId: z.uuid({ version: 'v4' }).optional(),
  })
  .strict();

// Chat and message related schemas
export const ChatMessageSchema = z
  .object({
    messages: z.array(MessageSchema),
    chatId: z.uuid({ version: 'v4' }),
  })
  .strict();

export const CreateMessageSchema = z
  .object({
    content: z.string().min(1),
    role: MessageRole,
  })
  .strict();

// Project related schemas
export const CreateProjectSchema = z
  .object({
    name: z.string().min(1),
  })
  .strict();

export const UpdateProjectSchema = z
  .object({
    name: z.string().min(1),
  })
  .strict();

// Chat related schemas
export const CreateChatSchema = z
  .object({
    title: z.string().min(1).optional(),
    projectId: z.uuid({ version: 'v4' }).optional(),
  })
  .strict();

// provider and model are optional — the title endpoint uses the same model the user has selected
// so it generates a contextually consistent title without requiring a separate configuration
export const UpdateChatTitleSchema = z.object({
  message: z.string().min(1),
  provider: z.string().optional(),
  model: z.string().optional(),
});

export const UpdateChatSchema = z
  .object({
    projectId: z.string().uuid(),
  })
  .strict();

// Compare (side-by-side) — one prompt, 1..6 models.
// apiKeys are optional per provider; they are used for this request only and
// never persisted. Missing keys fall back to server env vars.
export const CompareTargetSchema = z
  .object({
    provider: z.enum(['openai', 'anthropic', 'ollama']),
    model: z.string().min(1).max(100),
  })
  .strict();

export const CompareRequestSchema = z
  .object({
    prompt: z.string().trim().min(1).max(20_000),
    targets: z.array(CompareTargetSchema).min(1).max(6),
    apiKeys: z
      .object({
        openai: z.string().optional(),
        anthropic: z.string().optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export type CompareRequest = z.infer<typeof CompareRequestSchema>;
