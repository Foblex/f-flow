import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ISearchResult } from './search-index';
import { SearchService } from './search.service';

@Component({
  selector: 'search-dialog',
  templateUrl: './search-dialog.html',
  styleUrl: './search-dialog.scss',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.open]': 'isOpen()',
    '[attr.aria-hidden]': 'isOpen() ? null : true',
  },
})
export class SearchDialog {
  private readonly _service = inject(SearchService);
  private readonly _router = inject(Router);

  protected readonly isOpen = this._service.isOpen;
  protected readonly status = this._service.status;
  protected readonly query = signal('');
  protected readonly results = signal<ISearchResult[]>([]);
  protected readonly highlight = signal(0);
  protected readonly isSearching = signal(false);

  protected readonly hasResults = computed(() => this.results().length > 0);
  protected readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('queryInput');

  private _searchToken = 0;

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        queueMicrotask(() => this.inputRef()?.nativeElement.focus());
      } else {
        this.query.set('');
        this.results.set([]);
        this.highlight.set(0);
      }
    });

    effect(() => {
      const q = this.query();
      void this._runSearch(q);
    });
  }

  protected close(): void {
    this._service.close();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close();
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeyDown(event: KeyboardEvent): void {
    if (!this.isOpen()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();

      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const max = this.results().length - 1;
      this.highlight.update((i) => Math.min(i + 1, max));

      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.highlight.update((i) => Math.max(i - 1, 0));

      return;
    }
    if (event.key === 'Enter') {
      const result = this.results()[this.highlight()];
      if (result) {
        event.preventDefault();
        this.go(result);
      }
    }
  }

  protected go(result: ISearchResult): void {
    this.close();
    void this._router.navigateByUrl(result.document.route);
  }

  protected sectionLabel(section: string): string {
    switch (section) {
      case 'docs':
        return 'Docs';
      case 'examples':
        return 'Examples';
      case 'showcase':
        return 'Showcase';
      case 'blog':
        return 'Articles';
      default:
        return section;
    }
  }

  /**
   * Builds a focused snippet around the first matched query token,
   * then splits it into alternating highlighted / non-highlighted
   * segments. When the chunk is short enough no windowing is needed.
   * Returns `[{ text, match: false }]` when nothing matches so the
   * UI still shows the chunk start as fallback context.
   */
  protected highlightSegments(text: string): { text: string; match: boolean }[] {
    if (!text) return [];
    const tokens = this._queryTokens(this.query());
    const ranges = this._findRanges(text, tokens);
    const window = this._buildSnippetWindow(text, ranges);

    if (ranges.length === 0) {
      return [{ text: window.text, match: false }];
    }

    const out: { text: string; match: boolean }[] = [];
    let cursor = window.offset;
    for (const { start, end } of ranges) {
      if (end <= window.offset) continue;
      if (start >= window.offset + window.text.length - window.suffix.length) break;
      const visibleStart = Math.max(start, window.offset);
      const visibleEnd = Math.min(end, window.offset + window.text.length - window.suffix.length);
      if (visibleStart > cursor) {
        out.push({ text: text.slice(cursor, visibleStart), match: false });
      }
      out.push({ text: text.slice(visibleStart, visibleEnd), match: true });
      cursor = visibleEnd;
    }
    const tailEnd = window.offset + window.text.length - window.suffix.length;
    if (cursor < tailEnd) out.push({ text: text.slice(cursor, tailEnd), match: false });
    if (window.suffix) out.push({ text: window.suffix, match: false });
    if (window.prefix) out.unshift({ text: window.prefix, match: false });

    return out;
  }

  private _findRanges(text: string, tokens: string[]): { start: number; end: number }[] {
    if (tokens.length === 0) return [];
    const lower = text.toLowerCase();
    const ranges: { start: number; end: number }[] = [];
    for (const token of tokens) {
      let from = 0;
      while (true) {
        const idx = lower.indexOf(token, from);
        if (idx < 0) break;
        ranges.push({ start: idx, end: idx + token.length });
        from = idx + token.length;
      }
    }
    if (ranges.length === 0) return [];
    ranges.sort((a, b) => a.start - b.start);
    const merged = [ranges[0]];
    for (let i = 1; i < ranges.length; i++) {
      const top = merged[merged.length - 1];
      if (ranges[i].start <= top.end) {
        top.end = Math.max(top.end, ranges[i].end);
      } else {
        merged.push(ranges[i]);
      }
    }

    return merged;
  }

  private _buildSnippetWindow(
    text: string,
    ranges: { start: number; end: number }[],
  ): { offset: number; text: string; prefix: string; suffix: string } {
    const WINDOW_SIZE = 220;
    const PRE_CONTEXT = 60;
    if (text.length <= WINDOW_SIZE || ranges.length === 0) {
      return { offset: 0, text, prefix: '', suffix: '' };
    }

    const firstMatch = ranges[0].start;
    const rawStart = Math.max(0, firstMatch - PRE_CONTEXT);
    const wordStart = this._snapToWord(text, rawStart, 'forward');
    const rawEnd = Math.min(text.length, wordStart + WINDOW_SIZE);
    const wordEnd = this._snapToWord(text, rawEnd, 'backward');

    const prefix = wordStart > 0 ? '… ' : '';
    const suffix = wordEnd < text.length ? ' …' : '';

    return {
      offset: wordStart,
      text: prefix + text.slice(wordStart, wordEnd) + suffix,
      prefix,
      suffix,
    };
  }

  private _snapToWord(text: string, position: number, direction: 'forward' | 'backward'): number {
    if (position <= 0) return 0;
    if (position >= text.length) return text.length;
    if (/\s/.test(text[position])) return position;
    if (direction === 'forward') {
      const next = text.indexOf(' ', position);

      return next < 0 ? text.length : next;
    }
    const prev = text.lastIndexOf(' ', position);

    return prev < 0 ? 0 : prev;
  }

  private _queryTokens(query: string): string[] {
    return query
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length >= 2);
  }

  private async _runSearch(query: string): Promise<void> {
    const token = ++this._searchToken;
    if (!query.trim()) {
      this.results.set([]);
      this.highlight.set(0);

      return;
    }

    this.isSearching.set(true);
    try {
      const hits = await this._service.search(query, 8);
      if (token !== this._searchToken) return; // stale
      this.results.set(hits);
      this.highlight.set(0);
    } finally {
      if (token === this._searchToken) this.isSearching.set(false);
    }
  }
}
