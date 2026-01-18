import { IPoint } from '@foblex/2d';

export function mergePointChains(chains: IPoint[][]): IPoint[] {
  const out: IPoint[] = [];
  for (const chain of chains) {
    for (const p of chain) {
      const last = out[out.length - 1];
      if (!last || last.x !== p.x || last.y !== p.y) out.push(p);
    }
  }

  return out;
}
