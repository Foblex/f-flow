export interface SourceChunk {
  id: string;
  source: string;
  kind: string;
  path: string;
  ref?: string;
  lines?: string;
  content: string;
  embedding?: string;
}
