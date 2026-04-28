import { InjectionToken } from '@angular/core';
import { EFCanvasLayer } from '../enums';
import { F_DEFAULT_LAYER_ORDER } from '../constants';

/**
 * Canvas-level configuration consumed by `withFCanvas(...)`.
 *
 * Currently a single field — `layers` — but the shape leaves room
 * for additional canvas-scoped knobs without spawning more `with*()`
 * helpers (e.g. canvas zoom defaults, padding, etc.).
 */
export interface MergeFCanvasConfig {
  /**
   * Order in which built-in layers are stacked inside `<f-canvas>`,
   * read bottom to top. Defaults to
   * `[EFCanvasLayer.GROUPS, EFCanvasLayer.CONNECTIONS, EFCanvasLayer.NODES]`.
   *
   * Missing layers are appended in their default position; unknown
   * values and duplicates are silently dropped.
   */
  layers?: EFCanvasLayer[];
}

/**
 * Fully resolved canvas configuration. The injection token always
 * resolves to this shape — `withFCanvas` runs the partial config
 * through `mergeFCanvasConfig` before binding it to the token, so
 * downstream consumers never have to handle `undefined` fields.
 */
export interface IFCanvasResolvedConfig {
  layers: EFCanvasLayer[];
}

export const F_CANVAS_CONFIG = new InjectionToken<IFCanvasResolvedConfig>('F_CANVAS_CONFIG');

const DEFAULT_CONFIG: IFCanvasResolvedConfig = {
  layers: [...F_DEFAULT_LAYER_ORDER],
};

export function mergeFCanvasConfig(
  partial: MergeFCanvasConfig | undefined,
): IFCanvasResolvedConfig {
  if (!partial) {
    return { layers: [...DEFAULT_CONFIG.layers] };
  }

  return {
    layers: partial.layers ? [...partial.layers] : [...DEFAULT_CONFIG.layers],
  };
}
