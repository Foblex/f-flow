import { ChunkingService } from '../chunking.service.js';

describe('ChunkingService', () => {
  it('splits content without empty chunks', () => {
    const svc = new ChunkingService();
    const parts = svc.fixedChunks('abcdef', 3, 1);
    expect(parts.every((p) => p.length > 0)).toBe(true);
  });
});
