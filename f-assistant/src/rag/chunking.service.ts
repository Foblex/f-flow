import { Injectable } from '@nestjs/common';
import fg from 'fast-glob';
import fs from 'fs';

export interface Chunk {
  id: string;
  path: string;
  content: string;
  kind: string;
  ref?: string;
  lines?: string;
}

@Injectable()
export class ChunkingService {
  async chunkRepo(root = '..'): Promise<Chunk[]> {
    const files = await fg(
      [
        `${root}/projects/**/*.ts`,
        `${root}/projects/**/*.html`,
        `${root}/projects/**/*.scss`,
        `${root}/src/**/*`,
        `${root}/server/**/*`,
        `${root}/public/**/*`,
        `${root}/**/*.md`,
      ],
      { dot: false },
    );
    const chunks: Chunk[] = [];
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      const parts = this.fixedChunks(content, 1600, 200);
      let lineStart = 1;
      for (const part of parts) {
        const lines = part.split('\n').length;
        chunks.push({
          id: `${file}-${lineStart}`,
          path: file.replace(`${root}/`, ''),
          content: part,
          kind: 'code',
          lines: `L${lineStart}-L${lineStart + lines - 1}`,
        });
        lineStart += lines;
      }
    }
    return chunks.filter((c) => c.content.trim().length > 0);
  }

  fixedChunks(content: string, size: number, overlap: number): string[] {
    const res: string[] = [];
    let i = 0;
    while (i < content.length) {
      const slice = content.slice(i, i + size);
      res.push(slice);
      i += size - overlap;
    }
    return res;
  }
}
