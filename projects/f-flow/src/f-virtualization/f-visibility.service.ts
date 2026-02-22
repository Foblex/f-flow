import { inject, Injectable } from '@angular/core';
import { IPoint } from '@foblex/2d';
import { FNodeSizeRegistry } from './f-node-size-registry';

export interface INodeWorldRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

@Injectable()
export class FVisibilityService {
  private _visibleNodeIds = new Set<string>();
  private _forcedVisibleIds = new Set<string>();
  private _bufferPx = 200;

  private readonly _sizeRegistry = inject(FNodeSizeRegistry);

  public setBufferPx(value: number): void {
    this._bufferPx = value;
  }

  /**
   * Compute which nodes are visible given the current viewport.
   * @param viewportRect The visible area in world coordinates (x, y, width, height).
   * @param nodePositions Map of nodeId → world position.
   * @param scale Current zoom scale for buffer calculation.
   * @returns Set of visible node IDs (includes forced-visible).
   */
  public computeVisibility(
    viewportRect: { x: number; y: number; width: number; height: number },
    nodePositions: Map<string, IPoint>,
    scale: number,
  ): Set<string> {
    const buffer = this._bufferPx / Math.max(scale, 0.1);
    const expandedRect = {
      x: viewportRect.x - buffer,
      y: viewportRect.y - buffer,
      width: viewportRect.width + buffer * 2,
      height: viewportRect.height + buffer * 2,
    };

    const visible = new Set<string>();

    nodePositions.forEach((position, nodeId) => {
      const size = this._sizeRegistry.getSize(nodeId);
      if (this._intersects(expandedRect, position, size)) {
        visible.add(nodeId);
      }
    });

    // Always include forced-visible nodes
    this._forcedVisibleIds.forEach((id) => visible.add(id));

    this._visibleNodeIds = visible;

    return visible;
  }

  private _intersects(
    viewport: { x: number; y: number; width: number; height: number },
    position: IPoint,
    size: { width: number; height: number },
  ): boolean {
    return !(
      position.x + size.width < viewport.x ||
      position.x > viewport.x + viewport.width ||
      position.y + size.height < viewport.y ||
      position.y > viewport.y + viewport.height
    );
  }

  public isVisible(nodeId: string): boolean {
    return this._visibleNodeIds.has(nodeId);
  }

  public getVisibleNodeIds(): Set<string> {
    return this._visibleNodeIds;
  }

  public forceVisible(nodeId: string): void {
    this._forcedVisibleIds.add(nodeId);
  }

  public removeForceVisible(nodeId: string): void {
    this._forcedVisibleIds.delete(nodeId);
  }

  public clearForceVisible(): void {
    this._forcedVisibleIds.clear();
  }

  public getForcedVisibleIds(): Set<string> {
    return this._forcedVisibleIds;
  }
}
