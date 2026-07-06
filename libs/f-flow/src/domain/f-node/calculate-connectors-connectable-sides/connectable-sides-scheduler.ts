import { inject, Injectable } from '@angular/core';
import { FMediator } from '@foblex/mediator';
import type { FNodeBase } from '../../../f-node/f-node-base';
import { FComponentsStore } from '../../../f-storage/f-components-store';
import { CalculateConnectorsConnectableSidesRequest } from './calculate-connectors-connectable-sides-request';

const DEBOUNCE_TIME_MS = 3;

/**
 * Debounces connectable-side recalculation for all nodes through ONE timer.
 * Every node used to own a clearTimeout+setTimeout pair re-armed on each
 * redraw — a multi-node drag churned N timers per pointer event. Nodes are
 * collected into a set and flushed together 3ms after the last redraw.
 */
@Injectable()
export class ConnectableSidesScheduler {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

  private readonly _pending = new Set<FNodeBase>();
  private _timer: ReturnType<typeof setTimeout> | null = null;

  public schedule(node: FNodeBase): void {
    this._pending.add(node);

    if (this._timer !== null) {
      clearTimeout(this._timer);
    }
    this._timer = setTimeout(() => {
      this._timer = null;
      this._flush();
    }, DEBOUNCE_TIME_MS);
  }

  private _flush(): void {
    for (const node of this._pending) {
      // A node destroyed while queued must not be recalculated.
      if (this._store.nodes.get(node.fId()) === node) {
        this._mediator.execute<void>(new CalculateConnectorsConnectableSidesRequest(node));
      }
    }
    this._pending.clear();
  }
}
