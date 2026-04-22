import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { IHeaderSearchConfiguration, IS_BROWSER_PLATFORM } from '../../../common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'f-search-button',
  templateUrl: './f-search-button.component.html',
  styleUrls: ['./f-search-button.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
  ],
})
export class FSearchButtonComponent implements AfterViewInit, OnDestroy {
  public readonly configuration = input<IHeaderSearchConfiguration | undefined>(undefined);

  private readonly _isBrowser = inject(IS_BROWSER_PLATFORM);
  private readonly _document = inject(DOCUMENT);
  private readonly _containerRef = viewChild<ElementRef<HTMLElement>>('searchContainer');

  private _instance: IDocSearchInstance | null = null;

  public async ngAfterViewInit(): Promise<void> {
    if (!this._isBrowser) return;

    const docsearch = await loadDocSearch(this._document);
    if (!docsearch) return;

    const config = this.configuration();
    if (!config) return;

    const container = this._containerRef()?.nativeElement;
    if (!container) return;

    this._instance = docsearch({
      container,
      appId: config.appId,
      apiKey: config.apiKey,
      indexName: config.indexName,
      placeholder: config.placeholder || 'Search docs',
      insights: config.insights ?? true,
      searchParameters: config.searchParameters,
    });
  }

  public ngOnDestroy(): void {
    this._instance?.destroy?.();
    this._instance = null;
  }
}

interface IDocSearchInstance {
  destroy?: () => void;
}

interface IDocSearchOptions {
  container: HTMLElement;
  appId: string;
  apiKey: string;
  indexName: string;
  placeholder?: string;
  insights?: boolean;
  searchParameters?: Record<string, unknown>;
}

type DocSearchFactory = (options: IDocSearchOptions) => IDocSearchInstance;

let cachedDocSearchFactory: Promise<DocSearchFactory | null> | null = null;

async function loadDocSearch(documentRef: Document): Promise<DocSearchFactory | null> {
  if (cachedDocSearchFactory) {
    return cachedDocSearchFactory;
  }

  cachedDocSearchFactory = (async () => {
    await Promise.all([
      appendStyle(documentRef),
      appendScript(documentRef),
    ]);

    const docsearch = (documentRef.defaultView as Window & {
      docsearch?: DocSearchFactory;
    } | null)?.docsearch;

    return typeof docsearch === 'function' ? docsearch : null;
  })();

  return cachedDocSearchFactory;
}

function appendScript(documentRef: Document): Promise<void> {
  const existing = documentRef.getElementById(DOCSEARCH_SCRIPT_ID);
  if (existing) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const script = documentRef.createElement('script');
    script.id = DOCSEARCH_SCRIPT_ID;
    script.src = DOCSEARCH_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Algolia DocSearch script.'));
    documentRef.head.appendChild(script);
  });
}

function appendStyle(documentRef: Document): Promise<void> {
  const existing = documentRef.getElementById(DOCSEARCH_STYLE_ID);
  if (existing) {
    return Promise.resolve();
  }

  const link = documentRef.createElement('link');
  link.id = DOCSEARCH_STYLE_ID;
  link.rel = 'stylesheet';
  link.href = DOCSEARCH_STYLE_URL;
  documentRef.head.appendChild(link);
  return Promise.resolve();
}

const DOCSEARCH_SCRIPT_ID = 'f-docsearch-script';
const DOCSEARCH_STYLE_ID = 'f-docsearch-style';
const DOCSEARCH_SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/@docsearch/js@3/dist/umd/index.js';
const DOCSEARCH_STYLE_URL = 'https://cdn.jsdelivr.net/npm/@docsearch/css@3/dist/style.css';
