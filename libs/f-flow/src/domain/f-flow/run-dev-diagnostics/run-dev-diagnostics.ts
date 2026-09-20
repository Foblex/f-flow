import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RunDevDiagnosticsRequest } from './run-dev-diagnostics-request';
import { FComponentsStore, INSTANCES } from '../../../f-storage';
import { fWarnOnce, isFDevMode } from '../../f-diagnostics';
import { FNodeBase } from '../../../f-node';
import { FConnectorBase } from '../../../f-connectors';
import { F_FLOW_CONFIG } from '../../../provide-f-flow';
import { calculatePointerInFlow } from '../../../utils';

const DEFAULT_MIN_CONNECTOR_SIZE = 1;
const DEFAULT_MAX_NODE_POSITION_DRIFT = 2;

/**
 * Dev-mode misconfiguration checks (`FFxxxx` codes), run after each settled nodes
 * change. Every check targets a real-world silent failure mined from support issues;
 * all warnings are one-shot per cause and stripped from production builds.
 */
@Injectable()
@FExecutionRegister(RunDevDiagnosticsRequest)
export class RunDevDiagnostics implements IExecution<RunDevDiagnosticsRequest, void> {
  private readonly _store = inject(FComponentsStore);
  private readonly _config = inject(F_FLOW_CONFIG, { optional: true });

  public handle(_: RunDevDiagnosticsRequest): void {
    if (!isFDevMode()) {
      return;
    }

    this._checkDetachedItems();
    this._checkInteractionsWithoutDraggable();
    this._checkHiddenConnectors();
    this._checkZeroSizeConnectors();
    this._checkNodePositionDrift();
    this._checkNestedNodes();
    this._checkDanglingParentIds();
  }

  /**
   * FF1004 — a registered node/group/connection whose host element is not attached to
   * the document was created by Angular but not projected into the canvas (nested
   * `@if`/`@for` without `ngProjectAs`): geometry collapses to 0×0 and nothing renders.
   */
  private _checkDetachedItems(): void {
    for (const node of this._store.nodes.getAll()) {
      if (!node.hostElement.isConnected) {
        const isGroup = node.hostElement.hasAttribute('fGroup');
        fWarnOnce(
          'FF1004',
          node.fId(),
          `${isGroup ? '[fGroup]' : '[fNode]'} "${node.fId()}" is rendered inside a template block that Angular does not project into <f-canvas> (usually nested @if/@for). Wrap the block with <ng-container ngProjectAs="${isGroup ? '[fGroups]' : '[fNodes]'}">.`,
        );
      }
    }

    for (const connection of this._store.connections.getAll()) {
      if (!connection.hostElement.isConnected) {
        fWarnOnce(
          'FF1004',
          connection.fId(),
          `<f-connection> "${connection.fId()}" is rendered inside a template block that Angular does not project into <f-canvas> (usually nested @if/@for). Wrap the block with <ng-container ngProjectAs="[fConnections]">.`,
        );
      }
    }
  }

  /**
   * FF1005 — interaction features are present while `fDraggable` is missing on
   * `<f-flow>`, so every pointer interaction is silently inert.
   */
  private _checkInteractionsWithoutDraggable(): void {
    if (this._store.fDraggable) {
      return;
    }

    for (const feature of this._detectInteractionFeatures()) {
      fWarnOnce(
        'FF1005',
        feature,
        `${feature} requires the fDraggable directive on <f-flow>; without it pointer interactions are disabled and no interaction events are emitted.`,
      );
    }
  }

  private _detectInteractionFeatures(): string[] {
    const features: string[] = [];

    if (this._store.instances.get(INSTANCES.SELECTION_AREA)) {
      features.push('<f-selection-area>');
    }
    if (this._store.connections.getForCreate()) {
      features.push('<f-connection-for-create>');
    }
    if (this._store.connections.getForSnap()) {
      features.push('<f-snap-connection>');
    }

    const host = this._store.flowHost;
    if (host?.querySelector('.f-drag-handle')) {
      features.push('[fDragHandle]');
    }
    if (host?.querySelector('.f-resize-handle')) {
      features.push('[fResizeHandle]');
    }
    if (host?.querySelector('.f-rotate-handle')) {
      features.push('[fRotateHandle]');
    }

    return features;
  }

  /**
   * FF1006 — a connector hidden with CSS (`display: none`) still registers, but its
   * geometry is a 0×0 point: connections attach to the wrong place or nowhere.
   */
  private _checkHiddenConnectors(): void {
    for (const connector of this._allConnectors()) {
      const host = connector.hostElement;
      if (host.isConnected && host.getClientRects().length === 0) {
        fWarnOnce(
          'FF1006',
          connector.fId(),
          `Connector "${connector.fId()}" is hidden with CSS (display: none?), so its geometry is a 0×0 point and connections cannot attach to it correctly. Conditionally render it instead of hiding it.`,
        );
      }
    }
  }

  /**
   * FF1010 — a rendered connector whose own box is zero/near-zero sized. The visual
   * dot is often drawn with `::before`/`::after`, but hit-testing and connection
   * geometry use the element's box, so drops land past the connector and fall back
   * to node-level connect (see issue #326). Threshold comes from
   * `provideFFlow({ diagnostics: { minConnectorSize } })`; `0` disables the check.
   */
  private _checkZeroSizeConnectors(): void {
    const threshold = this._config?.diagnostics?.minConnectorSize ?? DEFAULT_MIN_CONNECTOR_SIZE;
    if (threshold <= 0) {
      return;
    }

    for (const connector of this._allConnectors()) {
      const host = connector.hostElement;
      if (!host.isConnected || host.getClientRects().length === 0) {
        continue;
      }

      const { width, height } = host.getBoundingClientRect();
      if (width < threshold || height < threshold) {
        fWarnOnce(
          'FF1010',
          connector.fId(),
          `Connector "${connector.fId()}" is ${Math.round(width)}×${Math.round(height)}px. Hit-testing and connection geometry use the element's own box, so a dot drawn with ::before/::after is not enough — give the connector element itself a size (width/height).`,
        );
      }
    }
  }

  /**
   * FF1011 — a node whose rendered box diverges from its model position. The canvas
   * places the host at `fNodePosition`, so a drift means app CSS on the node host
   * (margin, left/top, an extra transform) or out-of-band positioning moved the
   * visuals; model-driven features (minimap, fitToScreen, auto-layout) keep using
   * the model position and disagree with what the user sees (see issue #331).
   * Threshold comes from `provideFFlow({ diagnostics: { maxNodePositionDrift } })`;
   * `0` disables the check.
   */
  private _checkNodePositionDrift(): void {
    const threshold =
      this._config?.diagnostics?.maxNodePositionDrift ?? DEFAULT_MAX_NODE_POSITION_DRIFT;
    if (threshold <= 0) {
      return;
    }

    const flowHost = this._store.flowHost;
    const transform = this._store.transform;
    if (!flowHost || !transform) {
      return;
    }

    const scale = transform.scale || 1;
    for (const node of this._store.nodes.getAll()) {
      const host = node.hostElement as HTMLElement;
      if (!host.isConnected || host.getClientRects().length === 0) {
        continue;
      }

      const rect = host.getBoundingClientRect();
      const renderedCenter = calculatePointerInFlow(
        { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
        flowHost,
        transform,
      );
      // Centers survive rotation (the host spins around its own center), so compare
      // them instead of AABB origins; sizes come from unscaled layout geometry.
      const width = typeof host.offsetWidth === 'number' ? host.offsetWidth : rect.width / scale;
      const height =
        typeof host.offsetHeight === 'number' ? host.offsetHeight : rect.height / scale;
      const driftX = renderedCenter.x - (node._position.x + width / 2);
      const driftY = renderedCenter.y - (node._position.y + height / 2);
      // Compared in on-screen pixels: at deep zoom-out a sub-pixel gBCR reading
      // divided by the scale would otherwise cross the threshold on its own.
      const drift = Math.max(Math.abs(driftX), Math.abs(driftY)) * scale;

      if (drift > threshold) {
        fWarnOnce(
          'FF1011',
          node.fId(),
          `${this._describe(node)} "${node.fId()}" is rendered ~${Math.round(drift)}px away from its fNodePosition (model x: ${Math.round(node._position.x)}, y: ${Math.round(node._position.y)}; rendered x: ${Math.round(renderedCenter.x - width / 2)}, y: ${Math.round(renderedCenter.y - height / 2)}). The minimap, fitToScreen and auto-layout read the model, so they place this node where fNodePosition says — not where CSS moved it. Fold the offset (margin/left/top/extra transform on the node host) into fNodePosition instead.`,
        );
      }
    }
  }

  private _allConnectors(): FConnectorBase[] {
    return [
      ...this._store.connectors.getAll(),
      ...this._store.outputs.getAll(),
      ...this._store.inputs.getAll(),
      ...this._store.outlets.getAll(),
    ];
  }

  /**
   * FF1007 — an `[fNode]`/`[fGroup]` element nested inside another node element: the
   * outer node wins the drag and bindings on the inner one never fire. Hierarchy is
   * id-based (`fNodeParentId`), not DOM-based.
   */
  private _checkNestedNodes(): void {
    for (const node of this._store.nodes.getAll()) {
      const outer = node.hostElement.parentElement?.closest('[fNode], [fGroup]');
      if (outer) {
        fWarnOnce(
          'FF1007',
          node.fId(),
          `[fNode]/[fGroup] "${node.fId()}" is nested inside another node element. Nodes must be siblings inside <f-canvas>; use fNodeParentId/fGroupParentId for hierarchy instead of DOM nesting.`,
        );
      }
    }
  }

  /**
   * FF1008 — `fNodeParentId`/`fGroupParentId` references an id that no rendered group
   * has, so hierarchy behaviors (containment, group drag, auto-size) silently do not
   * apply.
   */
  private _checkDanglingParentIds(): void {
    for (const node of this._store.nodes.getAll()) {
      const parentId = node.fParentId();
      if (parentId && !this._store.nodes.has(parentId)) {
        fWarnOnce(
          'FF1008',
          `${node.fId()}|${parentId}`,
          `${this._describe(node)} "${node.fId()}" references parent "${parentId}", but no node or group with that id is rendered, so hierarchy behaviors do not apply. Registered ids: ${this._registeredNodeIds()}.`,
        );
      }
    }
  }

  private _describe(node: FNodeBase): string {
    return node.hostElement.hasAttribute('fGroup') ? '[fGroup]' : '[fNode]';
  }

  private _registeredNodeIds(): string {
    const ids = this._store.nodes.getAll().map((x) => `"${x.fId()}"`);
    const preview = ids.slice(0, 15).join(', ');

    return ids.length > 15 ? `${preview} and ${ids.length - 15} more` : preview || '(none)';
  }
}
