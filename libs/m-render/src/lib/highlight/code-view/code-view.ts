import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Highlight, resolveHighlightLanguage } from '../index';
import { copyToClipboard } from '../../common';

interface ContainerData {
  height?: string | number;
  value: string;
  isLink?: boolean;
  language?: string;
}

@Component({
  selector: 'code-view',
  templateUrl: './code-view.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'f-code-view',
    '[style.height]': 'height()',
  },
  imports: [
    Highlight,
  ],
})
export class CodeView implements OnInit {
  private readonly _httpClient = inject(HttpClient);
  private readonly _destroyRef = inject(DestroyRef);
  private _copyFeedbackTimeout: ReturnType<typeof setTimeout> | null = null;

  public readonly data = input<ContainerData>();

  protected readonly height = computed(() => {
    return coerceComponentHeight(this.data()?.height);
  });

  protected readonly content = signal<string>('');
  protected readonly visibleLanguage = signal<string>('');
  protected readonly syntaxLanguage = signal<string>('');
  protected readonly isCopied = signal(false);
  protected readonly copyButtonLabel = computed(() => this.isCopied() ? 'Copied' : 'Copy');

  public constructor() {
    this._destroyRef.onDestroy(() => {
      if (this._copyFeedbackTimeout) {
        clearTimeout(this._copyFeedbackTimeout);
      }
    });
  }

  public ngOnInit(): void {
    this._updateLanguage();
    this._updateNotExistingData(this.data());
    this._updateExistingData(this.data());
  }

  private _updateLanguage(): void {
    const data = this.data();
    const language = data?.language || parseLanguageFromFileExtension(data?.value || '');
    this.syntaxLanguage.set(parseSyntaxLanguage(language));
    this.visibleLanguage.set(parseVisibleLanguage(language));
  }

  private _updateNotExistingData(data?: ContainerData): void {
    if (data?.isLink) {
      this._loadCodeByLink(data.value);
    }
  }

  private _updateExistingData(data?: ContainerData): void {
    if (!data?.isLink) {
      this.content.set(data?.value || '');
    }
  }

  private _loadCodeByLink(link: string): void {
    if (!link) return;

    this._httpClient.get(link, { responseType: 'text' }).pipe(
      take(1),
      takeUntilDestroyed(this._destroyRef),
      catchError(() => EMPTY),
    ).subscribe((content) => this.content.set(content));
  }

  protected onCopyClick(): void {
    if (this.isCopied()) {
      return;
    }

    this._copyContentToClipboard(this.content());
  }

  private _copyContentToClipboard(content: string): void {
    copyToClipboard(content).pipe(
      take(1),
      takeUntilDestroyed(this._destroyRef),
    ).subscribe(() => this._setCopiedFeedback());
  }

  private _setCopiedFeedback(): void {
    this.isCopied.set(true);

    if (this._copyFeedbackTimeout) {
      clearTimeout(this._copyFeedbackTimeout);
    }

    this._copyFeedbackTimeout = setTimeout(() => {
      this.isCopied.set(false);
      this._copyFeedbackTimeout = null;
    }, 1300);
  }
}

function coerceComponentHeight(value: string | number | undefined): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0 ? `${ value }px` : undefined;
  }

  const normalizedValue = value.trim();
  if (!normalizedValue) return undefined;

  if (normalizedValue === 'auto') return 'auto';

  const numericValue = Number(normalizedValue);
  if (Number.isFinite(numericValue) && numericValue > 0) {
    return `${ numericValue }px`;
  }

  if (/^-?\d+(\.\d+)?(px|%|vh|vw|vmin|vmax|rem|em|ch|ex|cm|mm|in|pt|pc)$/i.test(normalizedValue)) {
    return normalizedValue;
  }

  if (/^calc\(.+\)$/i.test(normalizedValue)) {
    return normalizedValue;
  }

  return undefined;
}


function parseLanguageFromFileExtension(url: string): string {
  const match = url.match(/\.([0-9a-z]+)(?:[?#]|$)/i);

  if (match) {
    let extension = match[1];
    if (extension === 'css') {
      extension = 'scss';
    }
    return extension;
  }
  return '';
}

function parseSyntaxLanguage(language: string): string {
  let result: string;
  switch (language) {
    case 'js':
    case 'javascript':
      result = 'javascript';
      break;
    case 'ts':
    case 'typescript':
    case 'angular-ts':
      result = 'angular-ts';
      break;
    case 'html':
    case 'angular-html':
      result = 'angular-html';
      break;
    default:
      result = extractLanguage(language);
  }
  return resolveHighlightLanguage(result);
}

function parseVisibleLanguage(language: string): string {
  return extractLanguage(language);
}

function extractLanguage(language: string): string {
  const match = language.match(/^([^\s[]+)/);
  return match ? match[1].toLowerCase() : language;
}
