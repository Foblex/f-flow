import { inject, Injectable, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FMediator } from '@foblex/mediator';
import { IPoint, ITransformModel, Point, PointExtensions } from '@foblex/2d';
import { isValidEventTrigger } from '../../../domain';
import { IFConnectionFlow } from './i-f-connection-flow';
import { FComponentsStore } from '../../../f-storage';
import {
  FCreateConnectionSession,
  isDragBlocker,
  ResolveConnectableOutputForOutletRequest,
} from '../../../f-draggable';
import {
  FConnectorDirective,
  FSourceConnectorBase,
  getAllSourceConnectors,
  isOutletConnector,
} from '../../../f-connectors';
import {
  FEventTargetElement,
  getEventTargetElement,
} from '../../../utils/get-event-target-element';

const CLICK_MOVE_TOLERANCE = 3;

/**
 * Click-to-connect gesture: click a source connector to arm a connection, the preview
 * follows the cursor with no button held, click a connectable target to commit; clicking
 * anything else or pressing `Escape` cancels; clicking another source re-arms from it.
 *
 * Drag-to-connect stays available alongside — both gestures drive the same
 * {@link FCreateConnectionSession}, so preview, snapping, validation and the emitted
 * `fCreateConnection` event are identical. Install via
 * `provideFFlow(withConnectionFlow('click'))`.
 */
@Injectable()
export class FClickConnectFlow implements IFConnectionFlow {
  private readonly _document = inject(DOCUMENT);
  private readonly _ngZone = inject(NgZone, { optional: true });
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _session = inject(FCreateConnectionSession);

  private _pointerDownPosition: IPoint = PointExtensions.initialize();
  private _isArmed = false;
  private _dispose: (() => void) | null = null;
  private _disposeMove: (() => void) | null = null;

  private get _transform(): ITransformModel {
    return this._store.transform;
  }

  public initialize(): void {
    const run = () => {
      this._document.addEventListener('pointerdown', this._onPointerDown);
      this._document.addEventListener('click', this._onClick);
      this._document.addEventListener('keydown', this._onKeyDown);
    };
    this._ngZone ? this._ngZone.runOutsideAngular(run) : run();

    this._dispose = () => {
      this._document.removeEventListener('pointerdown', this._onPointerDown);
      this._document.removeEventListener('click', this._onClick);
      this._document.removeEventListener('keydown', this._onKeyDown);
    };
  }

  public destroy(): void {
    this._disarm();
    this._dispose?.();
    this._dispose = null;
  }

  private _onPointerDown = (event: PointerEvent) => {
    this._pointerDownPosition = PointExtensions.initialize(event.clientX, event.clientY);
  };

  /**
   * A "click" here is a true click: the pointer must not have traveled past the drag
   * threshold since pointer down, so completed drags never arm or commit a session.
   */
  private _onClick = (event: MouseEvent) => {
    const traveled =
      Math.abs(event.clientX - this._pointerDownPosition.x) +
      Math.abs(event.clientY - this._pointerDownPosition.y);
    if (traveled > CLICK_MOVE_TOLERANCE) {
      return;
    }

    const target = getEventTargetElement(event, 'f-flow');
    if (!target) {
      return;
    }
    if (!this._store.flowHost?.contains(target)) {
      return;
    }
    // Click-to-connect obeys the same public gates as the drag gesture: the
    // fDraggableDisabled input and the createConnection trigger of the active scheme.
    const draggable = this._store.fDraggable;
    if (!draggable || draggable.disabled) {
      return;
    }
    if (!this._isArmed && !isValidEventTrigger(event, draggable.fCreateConnectionTrigger)) {
      return;
    }
    if (isDragBlocker(target) || target.closest('[fLockedContext]')) {
      if (this._isArmed) {
        this._cancel();
      }

      return;
    }

    this._isArmed ? this._commitOrRearm(event) : this._arm(event, target);
  };

  private _onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this._isArmed) {
      this._cancel();
    }
  };

  private _onMouseMove = (event: MouseEvent) => {
    this._session.update(
      this._toCanvasSpace(PointExtensions.initialize(event.clientX, event.clientY)),
    );
  };

  private _arm(event: MouseEvent, target: FEventTargetElement): void {
    const source = this._resolveSource(target);
    if (!source) {
      return;
    }

    const clientPoint = PointExtensions.initialize(event.clientX, event.clientY);
    if (!this._session.begin(source, this._toCanvasSpace(clientPoint))) {
      return;
    }

    this._isArmed = true;
    this._document.addEventListener('mousemove', this._onMouseMove);
    this._disposeMove = () => this._document.removeEventListener('mousemove', this._onMouseMove);
  }

  private _commitOrRearm(event: MouseEvent): void {
    const clientPoint = PointExtensions.initialize(event.clientX, event.clientY);

    if (this._session.resolveTarget(clientPoint)) {
      this._session.complete(clientPoint);
      this._disarm();

      return;
    }

    // Clicking another source connector re-arms from it; anything else cancels.
    const target = getEventTargetElement(event, 'f-flow');
    const nextSource = target ? this._resolveSource(target) : undefined;
    this._cancel();
    if (nextSource && target) {
      this._arm(event, target);
    }
  }

  private _cancel(): void {
    this._session.cancel();
    this._disarm();
  }

  private _disarm(): void {
    this._isArmed = false;
    this._disposeMove?.();
    this._disposeMove = null;
  }

  /**
   * Resolves the source connector for a clicked element, applying the same start rules
   * as the drag path: `target`-type and disabled connectors cannot start, outlets
   * resolve to a connectable source of their node.
   */
  private _resolveSource(target: FEventTargetElement): FSourceConnectorBase | undefined {
    const connector =
      this._findUnifiedConnector(target) ??
      this._store.outlets.getAll().find((x) => x.hostElement.contains(target)) ??
      this._store.outputs.getAll().find((x) => x.hostElement.contains(target));

    if (!connector || connector.disabled()) {
      return undefined;
    }

    if (connector instanceof FConnectorDirective && connector.fConnectorType() === 'target') {
      return undefined;
    }

    if (isOutletConnector(connector)) {
      return this._resolveSourceForOutlet(connector);
    }

    return connector.canBeConnected ? (connector as FSourceConnectorBase) : undefined;
  }

  private _findUnifiedConnector(target: FEventTargetElement): FConnectorDirective | undefined {
    const connectorElement = target.closest('[fConnector]');

    return this._store.connectors
      .getAll()
      .find(
        (x): x is FConnectorDirective =>
          x instanceof FConnectorDirective && x.hostElement === connectorElement,
      );
  }

  private _resolveSourceForOutlet(outlet: FSourceConnectorBase): FSourceConnectorBase | undefined {
    const node = this._store.nodes.getAll().find((n) => n.isContains(outlet.hostElement));
    if (node && outlet instanceof FConnectorDirective) {
      outlet.setOutletSources(
        getAllSourceConnectors(this._store).filter((x) => node.isContains(x.hostElement)),
      );
      if (!outlet.canBeConnected) {
        return undefined;
      }
      if (outlet.fConnectionFromOutlet()) {
        return outlet;
      }
    }

    const source = this._mediator.execute<FSourceConnectorBase | undefined>(
      new ResolveConnectableOutputForOutletRequest(outlet),
    );

    return source?.canBeConnected ? source : undefined;
  }

  /** Same client → canvas-local conversion the drag path uses. */
  private _toCanvasSpace(clientPoint: IPoint): Point {
    const flowSpace = Point.fromPoint(clientPoint)
      .elementTransform(this._store.flowHost)
      .div(this._transform.scale);

    return flowSpace
      .mult(this._transform.scale)
      .sub(this._transform.position)
      .sub(this._transform.scaledPosition)
      .div(this._transform.scale);
  }
}
