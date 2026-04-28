import { EFCanvasLayer } from '../enums';
import { F_DEFAULT_LAYER_ORDER } from '../constants';

/**
 * Normalises a user-supplied layer order into a complete, de-duplicated
 * `EFCanvasLayer[]`. Unknown entries are dropped, duplicates collapse to the
 * first occurrence, and any layer the caller forgot to mention is
 * appended in its default position so the canvas always has every layer
 * to render.
 */
export function resolveLayerOrder(value: EFCanvasLayer[] | undefined | null): EFCanvasLayer[] {
  const known = new Set<EFCanvasLayer>(F_DEFAULT_LAYER_ORDER);
  const seen = new Set<EFCanvasLayer>();
  const out: EFCanvasLayer[] = [];

  for (const layer of value ?? []) {
    if (!known.has(layer) || seen.has(layer)) continue;
    seen.add(layer);
    out.push(layer);
  }

  for (const layer of F_DEFAULT_LAYER_ORDER) {
    if (!seen.has(layer)) out.push(layer);
  }

  return out;
}
