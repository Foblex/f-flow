export interface ISearchDocument {
  /** Unique per chunk: `<route>#<index>`. Multiple chunks share the same route. */
  chunkId: string;
  slug: string;
  route: string;
  section: 'docs' | 'examples' | 'showcase' | 'blog';
  title: string;
  description: string;
  group: string | null;
  vector: number[];
  /** Whitespace-joined keyword text for BM25 (title boosted, chunk body + camelCase decomposition). */
  keywords: string;
  /** Display-ready excerpt for the dialog (clean ~240-char snippet from this chunk). */
  excerpt: string;
}

export interface ISearchIndex {
  model: string;
  dim: number;
  builtAt: string;
  documents: ISearchDocument[];
}

export interface ISearchResult {
  document: ISearchDocument;
  score: number;
}
