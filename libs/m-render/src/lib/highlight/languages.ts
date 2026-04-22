import type { LanguageInput, PlainTextLanguage } from '@shikijs/types';

type ShikiLanguage =
  | 'javascript'
  | 'typescript'
  | 'angular-html'
  | 'angular-ts'
  | 'shell'
  | 'html'
  | 'bash'
  | 'css'
  | 'scss'
  | 'markdown';

export type HighlightLanguage = ShikiLanguage | PlainTextLanguage;

const LANGUAGE_ALIASES: Record<string, HighlightLanguage> = {
  js: 'javascript',
  javascript: 'javascript',
  ts: 'typescript',
  typescript: 'typescript',
  md: 'markdown',
  sh: 'shell',
  zsh: 'shell',
  shell: 'shell',
  shellscript: 'shell',
  txt: 'text',
  plain: 'text',
  plaintext: 'text',
};

const LANGUAGE_LOADERS = new Map<ShikiLanguage, LanguageInput>([
  [ 'javascript', () => import('@shikijs/langs/javascript') ],
  [ 'typescript', () => import('@shikijs/langs/typescript') ],
  [ 'angular-html', () => import('@shikijs/langs/angular-html') ],
  [ 'angular-ts', () => import('@shikijs/langs/angular-ts') ],
  [ 'shell', () => import('@shikijs/langs/shell') ],
  [ 'html', () => import('@shikijs/langs/html') ],
  [ 'bash', () => import('@shikijs/langs/bash') ],
  [ 'css', () => import('@shikijs/langs/css') ],
  [ 'scss', () => import('@shikijs/langs/scss') ],
  [ 'markdown', () => import('@shikijs/langs/markdown') ],
]);

export const AVAILABLE_LANGUAGES: readonly HighlightLanguage[] = [
  'javascript',
  'typescript',
  'angular-html',
  'angular-ts',
  'shell',
  'html',
  'bash',
  'css',
  'scss',
  'markdown',
  'text',
];

export function resolveHighlightLanguage(lang?: string): HighlightLanguage {
  const normalized = (lang || '').trim().toLowerCase();
  if (!normalized) {
    return 'text';
  }

  const alias = LANGUAGE_ALIASES[normalized];
  if (alias) {
    return alias;
  }

  if (isAvailableLanguage(normalized)) {
    return normalized;
  }

  return 'text';
}

export function getLanguageLoader(lang: HighlightLanguage): LanguageInput | null {
  if (isPlainTextLanguage(lang)) {
    return null;
  }
  return LANGUAGE_LOADERS.get(lang) || null;
}

function isAvailableLanguage(lang: string): lang is HighlightLanguage {
  return AVAILABLE_LANGUAGES.includes(lang as HighlightLanguage);
}

function isPlainTextLanguage(lang: HighlightLanguage): lang is PlainTextLanguage {
  const value = lang as string;
  return value === 'text' || value === 'txt' || value === 'plain' || value === 'plaintext';
}
