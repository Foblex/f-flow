import { inject, Injectable } from '@angular/core';
import { IPoint, IRect, ISize, RectExtensions } from '@foblex/2d';
import { FComponentsStore } from '../../f-storage';
import { FNodeBase } from '../../f-node';

/**
 * Flow-space node rects for the minimap, computed from the model instead of
 * per-frame DOM measurement.
 *
 * Positions come straight from `node._position`; sizes are read from layout
 * once (offsetWidth/offsetHeight are unaffected by the canvas CSS transform)
 * and cached until a node resize invalidates them via `connectionsRevision` —
 * the same signal every node's ResizeObserver already bumps. Pan/zoom therefore
 * costs zero DOM reads per node, which is what previously forced the minimap
 * to bail out above `fNodeRenderLimit`.
 */
@Injectable()
export class MinimapNodeRects {
  private readonly _store = inject(FComponentsStore);

  private _sizes = new WeakMap<FNodeBase, ISize>();
  private _sizesRevision = -1;

  /** Drops stale cached sizes when any node resized since the last pass. */
  public ensureFresh(): void {
    const revision = this._store.connectionsRevision;
    if (revision !== this._sizesRevision) {
      this._sizesRevision = revision;
      this._sizes = new WeakMap();
    }
  }

  /**
   * The minimap draws nodes in flow coordinates and shifts the whole layer by
   * this offset, so panning moves one `<g>` transform instead of every rect.
   */
  public viewOffset(): IPoint {
    const transform = this._store.transform;
    if (!transform) {
      return { x: 0, y: 0 };
    }

    const scale = transform.scale || 1;

    return {
      x: (transform.position.x + transform.scaledPosition.x) / scale,
      y: (transform.position.y + transform.scaledPosition.y) / scale,
    };
  }

  /** Rotation-aware AABB of a node in flow coordinates. */
  public rectOf(node: FNodeBase): IRect {
    const size = this._sizeOf(node);
    const { x, y } = node._position;

    if (!node._rotate) {
      return RectExtensions.initialize(x, y, size.width, size.height);
    }

    // transform: translate(p) rotate(deg) spins the node around its center;
    // mirror that math so rotated nodes keep the same minimap footprint the
    // old getBoundingClientRect path produced.
    const radians = (node._rotate * Math.PI) / 180;
    const cos = Math.abs(Math.cos(radians));
    const sin = Math.abs(Math.sin(radians));
    const width = size.width * cos + size.height * sin;
    const height = size.width * sin + size.height * cos;

    return RectExtensions.initialize(
      x + size.width / 2 - width / 2,
      y + size.height / 2 - height / 2,
      width,
      height,
    );
  }

  /** Union of all node rects in flow coordinates; null when there are no nodes. */
  public contentRect(): IRect | null {
    const nodes = this._store.nodes.getAll();
    if (!nodes.length) {
      return null;
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const node of nodes) {
      const rect = this.rectOf(node);
      minX = Math.min(minX, rect.x);
      minY = Math.min(minY, rect.y);
      maxX = Math.max(maxX, rect.x + rect.width);
      maxY = Math.max(maxY, rect.y + rect.height);
    }

    return RectExtensions.initialize(minX, minY, maxX - minX, maxY - minY);
  }

  private _sizeOf(node: FNodeBase): ISize {
    if (node._size) {
      return node._size;
    }

    const cached = this._sizes.get(node);
    if (cached) {
      return cached;
    }

    const measured = this._measure(node);
    this._sizes.set(node, measured);

    return measured;
  }

  private _measure(node: FNodeBase): ISize {
    const host = node.hostElement as HTMLElement;
    if (typeof host.offsetWidth === 'number') {
      return { width: host.offsetWidth, height: host.offsetHeight };
    }

    // SVG hosts have no offset geometry; fall back to one unscaled gBCR.
    const rect = host.getBoundingClientRect();
    const scale = this._store.transform?.scale || 1;

    return { width: rect.width / scale, height: rect.height / scale };
  }
}
