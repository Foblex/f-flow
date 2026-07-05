import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RunDevDiagnosticsRequest } from './run-dev-diagnostics-request';
import { FComponentsStore, INSTANCES } from '../../../f-storage';
import { fWarnOnce, isFDevMode } from '../../f-diagnostics';
import { FNodeBase } from '../../../f-node';
import { FConnectorBase } from '../../../f-connectors';

/**
 * Dev-mode misconfiguration checks (`FFxxxx` codes), run after each settled nodes
 * change. Every check targets a real-world silent failure mined from support issues;
 * all warnings are one-shot per cause and stripped from production builds.
 */
@Injectable()
@FExecutionRegister(RunDevDiagnosticsRequest)
export class RunDevDiagnostics implements IExecution<RunDevDiagnosticsRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle(_: RunDevDiagnosticsRequest): void {
    if (!isFDevMode()) {
      return;
    }

    this._checkDetachedItems();
    this._checkInteractionsWithoutDraggable();
    this._checkHiddenConnectors();
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
    const connectors: FConnectorBase[] = [
      ...this._store.connectors.getAll(),
      ...this._store.outputs.getAll(),
      ...this._store.inputs.getAll(),
      ...this._store.outlets.getAll(),
    ];

    for (const connector of connectors) {
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
