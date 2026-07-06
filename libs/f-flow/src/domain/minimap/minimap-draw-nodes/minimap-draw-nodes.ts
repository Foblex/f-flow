import { inject, Injectable } from '@angular/core';
import { MinimapDrawNodesRequest } from './minimap-draw-nodes-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { createSVGElement } from '../../../domain';
import { FNodeBase, FNodeDirective } from '../../../f-node';
import { IRect, RectExtensions, setRectToElement } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';
import { BrowserService } from '@foblex/platform';
import { MinimapNodeRects } from '../minimap-node-rects';

interface IMinimapNodeEntry {
  element: SVGRectElement;
  lastRect: IRect;
  lastClassName: string;
}

/**
 * Keeps one `<rect>` per node and updates it in place. Rects live in flow
 * coordinates; panning/zooming only moves the group transform, so a transform
 * change writes ONE attribute instead of rebuilding N elements — the previous
 * implementation re-measured (2 x getBoundingClientRect) and re-created every
 * node rect on every animation frame.
 */
@Injectable()
@FExecutionRegister(MinimapDrawNodesRequest)
export class MinimapDrawNodes implements IExecution<MinimapDrawNodesRequest, void> {
  private readonly _browser = inject(BrowserService);
  private readonly _store = inject(FComponentsStore);
  private readonly _rects = inject(MinimapNodeRects);

  private readonly _entries = new Map<FNodeBase, IMinimapNodeEntry>();
  private _membershipRevision = -1;

  public handle({ hostElement }: MinimapDrawNodesRequest): void {
    this._rects.ensureFresh();

    const nodes = this._store.nodes.getAll();
    if (this._membershipRevision !== this._store.nodesRevision) {
      this._membershipRevision = this._store.nodesRevision;
      this._removeStaleEntries(nodes);
    }

    const offset = this._rects.viewOffset();
    hostElement.setAttribute('transform', `translate(${offset.x} ${offset.y})`);

    for (const node of nodes) {
      this._updateNode(node, hostElement);
    }
  }

  private _updateNode(node: FNodeBase, hostElement: SVGGElement): void {
    let entry = this._entries.get(node);
    if (!entry) {
      entry = {
        element: createSVGElement('rect', this._browser) as SVGRectElement,
        lastRect: RectExtensions.initialize(NaN, NaN),
        lastClassName: '',
      };
      this._entries.set(node, entry);
    }

    const rect = this._rects.rectOf(node);
    if (!this._isSameRect(rect, entry.lastRect)) {
      setRectToElement(rect, entry.element);
      entry.lastRect = rect;
    }

    const className = this._className(node);
    if (className !== entry.lastClassName) {
      entry.element.setAttribute('class', className);
      entry.lastClassName = className;
    }

    // Also self-heals after an external clear() (e.g. the render-limit bailout).
    if (entry.element.parentNode !== hostElement) {
      hostElement.appendChild(entry.element);
    }
  }

  private _removeStaleEntries(nodes: FNodeBase[]): void {
    if (this._entries.size === nodes.length) {
      return;
    }

    const alive = new Set<FNodeBase>(nodes);
    for (const [node, entry] of this._entries) {
      if (!alive.has(node)) {
        entry.element.remove();
        this._entries.delete(node);
      }
    }
  }

  private _className(node: FNodeBase): string {
    const parts = [
      'f-component',
      node instanceof FNodeDirective ? 'f-minimap-node' : 'f-minimap-group',
      ...this._minimapClasses(node),
    ];
    if (node.isSelected()) {
      parts.push('f-selected');
    }

    return parts.join(' ');
  }

  private _minimapClasses(node: FNodeBase): string[] {
    const classes = node.fMinimapClass();

    return Array.isArray(classes) ? classes : [classes];
  }

  private _isSameRect(a: IRect, b: IRect): boolean {
    return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
  }
}
