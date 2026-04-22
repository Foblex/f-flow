import { ThemeInput } from '@shikijs/types'

export const UNIVERSAL_THEME: ThemeInput = {
  name: 'universal',
  colors: {
    'editor.background': 'transparent',
    'editor.foreground': 'var(--code-view-text-color)',
  },
  settings: [
    {
      scope: ['comment', 'punctuation.definition.comment', 'string.comment'],
      settings: {
        foreground: 'var(--token-comment)',
      },
    },
    {
      scope: ['constant', 'entity.name.constant', 'variable.other.constant', 'variable.other.enummember', 'variable.language'],
      settings: {
        foreground: 'var(--token-number)',
      },
    },
    {
      scope: ['entity', 'entity.name'],
      settings: {
        foreground: 'var(--token-tag)',
      },
    },
    {
      scope: 'variable.parameter.function',
      settings: {
        foreground: 'var(--primary-text)',
      },
    },
    {
      scope: 'entity.name.tag',
      settings: {
        foreground: 'var(--token-tag)',
      },
    },
    {
      scope: 'keyword',
      settings: {
        foreground: 'var(--token-keyword)',
      },
    },
    {
      scope: ['storage', 'storage.type'],
      settings: {
        foreground: 'var(--token-keyword)',
      },
    },
    {
      scope: ['storage.modifier.package', 'storage.modifier.import', 'storage.type.java'],
      settings: {
        foreground: 'var(--primary-text)',
      },
    },
    {
      scope: ['string', 'punctuation.definition.string', 'string punctuation.section.embedded source'],
      settings: {
        foreground: 'var(--token-string)',
      },
    },
    {
      scope: 'support',
      settings: {
        foreground: 'var(--token-function)',
      },
    },
    {
      scope: 'meta.property-name',
      settings: {
        foreground: 'var(--token-function)',
      },
    },
    {
      scope: 'variable',
      settings: {
        foreground: 'var(--token-variable)',
      },
    },
    {
      scope: 'variable.other',
      settings: {
        foreground: 'var(--token-function)',
      },
    },
    {
      scope: [
        'invalid.broken',
        'invalid.deprecated',
        'invalid.illegal',
        'invalid.unimplemented',
      ],
      settings: {
        fontStyle: 'italic',
        foreground: 'var(--danger-2)',
      },
    },
    {
      scope: 'carriage-return',
      settings: {
        fontStyle: 'italic underline',
        foreground: 'var(--background-color)',
        background: 'var(--token-keyword)',
      },
    },
    {
      scope: 'message.error',
      settings: {
        foreground: 'var(--danger-2)',
      },
    },
    {
      scope: 'string variable',
      settings: {
        foreground: 'var(--token-function)',
      },
    },
    {
      scope: ['source.regexp', 'string.regexp'],
      settings: {
        foreground: 'var(--token-interpolation)',
      },
    },
    {
      scope: [
        'string.regexp.character-class',
        'string.regexp constant.character.escape',
        'string.regexp source.ruby.embedded',
        'string.regexp string.regexp.arbitrary-repitition',
      ],
      settings: {
        foreground: 'var(--token-interpolation)',
      },
    },
    {
      scope: 'string.regexp constant.character.escape',
      settings: {
        fontStyle: 'bold',
        foreground: 'var(--token-attr-value)',
      },
    },
    {
      scope: ['support.constant', 'support.variable', 'meta.module-reference'],
      settings: {
        foreground: 'var(--token-function)',
      },
    },
    {
      scope: 'punctuation.definition.list.begin.markdown',
      settings: {
        foreground: 'var(--token-variable)',
      },
    },
    {
      scope: ['markup.heading', 'markup.heading entity.name'],
      settings: {
        fontStyle: 'bold',
        foreground: 'var(--token-function)',
      },
    },
    {
      scope: 'markup.quote',
      settings: {
        foreground: 'var(--token-attr-value)',
      },
    },
    {
      scope: 'markup.italic',
      settings: {
        fontStyle: 'italic',
        foreground: 'var(--primary-text)',
      },
    },
    {
      scope: 'markup.bold',
      settings: {
        fontStyle: 'bold',
        foreground: 'var(--primary-text)',
      },
    },
    {
      scope: 'markup.underline',
      settings: {
        fontStyle: 'underline',
      },
    },
    {
      scope: 'markup.strikethrough',
      settings: {
        fontStyle: 'strikethrough',
      },
    },
    {
      scope: 'markup.inline.raw',
      settings: {
        foreground: 'var(--token-function)',
      },
    },
    {
      scope: ['markup.deleted', 'meta.diff.header.from-file', 'punctuation.definition.deleted'],
      settings: {
        background: 'var(--danger-3)',
        foreground: 'var(--danger-2)',
      },
    },
    {
      scope: ['markup.inserted', 'meta.diff.header.to-file', 'punctuation.definition.inserted'],
      settings: {
        background: 'var(--success-3)',
        foreground: 'var(--token-attr-value)',
      },
    },
    {
      scope: ['markup.changed', 'punctuation.definition.changed'],
      settings: {
        background: 'var(--warning-3)',
        foreground: 'var(--token-variable)',
      },
    },
    {
      scope: ['markup.ignored', 'markup.untracked'],
      settings: {
        background: 'var(--token-function)',
        foreground: 'var(--alt-background)',
      },
    },
    {
      scope: 'meta.diff.range',
      settings: {
        fontStyle: 'bold',
        foreground: 'var(--token-attr-name)',
      },
    },
    {
      scope: 'meta.diff.header',
      settings: {
        foreground: 'var(--token-function)',
      },
    },
    {
      scope: 'meta.separator',
      settings: {
        fontStyle: 'bold',
        foreground: 'var(--token-function)',
      },
    },
    {
      scope: 'meta.output',
      settings: {
        foreground: 'var(--token-function)',
      },
    },
    {
      scope: [
        'brackethighlighter.tag',
        'brackethighlighter.curly',
        'brackethighlighter.round',
        'brackethighlighter.square',
        'brackethighlighter.angle',
        'brackethighlighter.quote',
      ],
      settings: {
        foreground: 'var(--gray-1)',
      },
    },
    {
      scope: 'brackethighlighter.unmatched',
      settings: {
        foreground: 'var(--danger-2)',
      },
    },
    {
      scope: ['constant.other.reference.link', 'string.other.link'],
      settings: {
        fontStyle: 'underline',
        foreground: 'var(--token-interpolation)',
      },
    },
  ],
}
