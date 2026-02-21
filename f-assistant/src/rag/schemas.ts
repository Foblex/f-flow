import { z } from 'zod';

export const citationSchema = z.object({
  kind: z.string(),
  path: z.string().optional(),
  ref: z.string().optional(),
  lines: z.string().optional(),
  url: z.string().optional(),
});

export const draftSchema = z.object({
  id: z.enum(['A', 'B', 'C']),
  tone: z.string(),
  description: z.string(),
  text: z.string(),
  citations: z.array(citationSchema),
});

export const answerPackSchema = z.object({
  source: z.object({
    type: z.enum(['github_issue', 'github_discussion', 'website']),
    repo: z.literal('Foblex/f-flow'),
    url: z.string(),
    number: z.number().optional(),
    author: z.string().optional(),
    title: z.string().optional(),
  }),
  drafts: z.array(draftSchema).length(3),
  confidence: z.number().min(0).max(1),
  missing_context: z.array(z.string()),
});

export type AnswerPack = z.infer<typeof answerPackSchema>;
export type Draft = z.infer<typeof draftSchema>;
