import { z } from 'zod';

export const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().default('gpt-5.2'),
  OPENAI_EMBED_MODEL: z.string().default('text-embedding-3-small'),
  QDRANT_URL: z.string().url(),
  QDRANT_COLLECTION: z.string().default('foblex_flow'),
  GITHUB_REPO: z.string().min(1),
  GITHUB_WEBHOOK_SECRET: z.string().min(1).optional(),
  GITHUB_APP_ID: z.string().optional(),
  GITHUB_APP_PRIVATE_KEY_PEM: z.string().optional(),
  GITHUB_APP_INSTALLATION_ID: z.string().optional(),
  ALLOW_PAT: z.string().optional(),
  GITHUB_PAT: z.string().optional(),
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  TELEGRAM_ADMIN_CHAT_ID: z.string().min(1),
  PREFERRED_LANGUAGE: z.string().default('en'),
});

export type Env = z.infer<typeof envSchema>;
