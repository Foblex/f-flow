import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IS_BROWSER_PLATFORM } from '@foblex/m-render';
import MiniSearch from 'minisearch';
import { ISearchDocument, ISearchIndex, ISearchResult } from './search-index';

type FeatureExtractor = (
  text: string,
  options: { pooling: 'mean'; normalize: boolean },
) => Promise<{ data: Float32Array }>;

const INDEX_URL = '/search-index.json';

/**
 * Lazy-loaded semantic search.
 *
 * On first use, downloads the search-index.json (built at deploy time
 * by `scripts/build-search-index.mjs`) and the same MiniLM model that
 * was used to build it (~6 MB quantised, cached by the browser
 * indefinitely). Subsequent queries embed locally and rank by cosine
 * similarity — no network round-trip per query.
 */
@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly _http = inject(HttpClient);
  private readonly _isBrowser = inject(IS_BROWSER_PLATFORM);

  private readonly _isOpen = signal(false);
  private readonly _isReady = signal(false);
  private readonly _isLoading = signal(false);

  public readonly isOpen = this._isOpen.asReadonly();
  public readonly isReady = this._isReady.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly status = computed(() => {
    if (this._isReady()) return 'ready' as const;
    if (this._isLoading()) return 'loading' as const;

    return 'idle' as const;
  });

  private _index: ISearchIndex | null = null;
  private _extractor: FeatureExtractor | null = null;
  private _bm25: MiniSearch<ISearchDocument> | null = null;
  private _readyPromise: Promise<void> | null = null;

  public open(): void {
    if (!this._isBrowser) return;
    this._isOpen.set(true);
    void this._ensureReady();
  }

  public close(): void {
    this._isOpen.set(false);
  }

  public toggle(): void {
    if (this._isOpen()) this.close();
    else this.open();
  }

  public async search(query: string, limit = 8): Promise<ISearchResult[]> {
    const cleaned = query.trim();
    if (!cleaned) return [];

    await this._ensureReady();
    if (!this._extractor || !this._index || !this._bm25) return [];

    // Semantic side: cosine across precomputed chunk vectors.
    const out = await this._extractor(cleaned, { pooling: 'mean', normalize: true });
    const queryVec = Array.from(out.data);
    const semanticRanked = this._index.documents
      .map((doc) => ({ doc, score: cosine(queryVec, doc.vector) }))
      .sort((a, b) => b.score - a.score);

    // Keyword side: BM25 over the same chunks.
    const bm25Hits = this._bm25.search(cleaned, { prefix: true, fuzzy: 0.2 });

    // Per-chunk Reciprocal Rank Fusion.
    const RRF_K = 60;
    const chunkScores = new Map<string, { doc: ISearchDocument; score: number }>();
    semanticRanked.forEach(({ doc }, rank) => {
      chunkScores.set(doc.chunkId, { doc, score: 1 / (RRF_K + rank + 1) });
    });
    bm25Hits.forEach((hit, rank) => {
      const bm25Score = 1 / (RRF_K + rank + 1);
      const prev = chunkScores.get(String(hit.id));
      if (prev) {
        prev.score += bm25Score;
      } else {
        const doc = this._index!.documents.find((d) => d.chunkId === hit.id);
        if (doc) chunkScores.set(doc.chunkId, { doc, score: bm25Score });
      }
    });

    // Many chunks belong to the same page. Keep the best-scoring chunk
    // per route so the result list shows distinct pages.
    const byRoute = new Map<string, { doc: ISearchDocument; score: number }>();
    for (const entry of chunkScores.values()) {
      const prev = byRoute.get(entry.doc.route);
      if (!prev || prev.score < entry.score) {
        byRoute.set(entry.doc.route, entry);
      }
    }

    return Array.from(byRoute.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ doc, score }) => ({ document: doc, score }));
  }

  private async _ensureReady(): Promise<void> {
    if (this._isReady()) return;
    if (this._readyPromise) return this._readyPromise;

    this._isLoading.set(true);
    this._readyPromise = (async () => {
      const [index, extractor] = await Promise.all([this._loadIndex(), this._loadExtractor()]);
      this._index = index;
      this._extractor = extractor;
      this._bm25 = this._buildBm25Index(index);
      this._isReady.set(true);
      this._isLoading.set(false);
    })().catch((error) => {
      this._isLoading.set(false);
      this._readyPromise = null;
      console.error('[SearchService] Failed to load index/model:', error);
      throw error;
    });

    return this._readyPromise;
  }

  private async _loadIndex(): Promise<ISearchIndex> {
    return firstValueFrom(this._http.get<ISearchIndex>(INDEX_URL));
  }

  private _buildBm25Index(index: ISearchIndex): MiniSearch<ISearchDocument> {
    const bm25 = new MiniSearch<ISearchDocument>({
      idField: 'chunkId',
      fields: ['keywords'],
      // Tokenise on non-word boundaries so identifiers like
      // `getState`, `IFFlowState`, `f-flow` round-trip cleanly.
      tokenize: (text) =>
        text
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter(Boolean),
      searchOptions: {
        prefix: true,
        fuzzy: 0.2,
      },
    });
    bm25.addAll(index.documents);

    return bm25;
  }

  private async _loadExtractor(): Promise<FeatureExtractor> {
    // Loaded from a CDN at runtime — bypasses Angular's esbuild bundler,
    // which otherwise tries to inline `onnxruntime-node`'s native .node
    // binaries and fails. The browser receives the WASM-backed build,
    // which the package picks automatically when running in a browser.
    const transformers = (await loadFromCdn(
      'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.2.0/+esm',
    )) as { pipeline: (...args: unknown[]) => Promise<FeatureExtractor> };

    return transformers.pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      dtype: 'q8',
    });
  }
}

// Wrapper around dynamic `import(<url>)` that the bundler cannot
// statically analyse. esbuild eagerly parses bare-string dynamic imports
// and tries to bundle the target; passing the URL through `new Function`
// hides it from static analysis so the import happens purely at runtime.
async function loadFromCdn(url: string): Promise<unknown> {
  const dynamicImport = new Function('u', 'return import(u)') as (u: string) => Promise<unknown>;

  return dynamicImport(url);
}

function cosine(a: number[], b: number[]): number {
  // both vectors are L2-normalised → dot product == cosine similarity
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];

  return s;
}
