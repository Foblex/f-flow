import {
  booleanAttribute,
  Directive,
  effect,
  inject,
  input,
  Injector,
  OnInit,
  untracked,
  OnDestroy,
} from '@angular/core';
import { F_NODE } from '../../../../f-node/f-node-base';
import { FReflowIgnoreRegistry } from './f-reflow-ignore-registry';

/**
 * Anchors the host `<f-node>` / `<f-group>` in place during reflow.
 * The node never receives a primary shift even if mode and scope would
 * otherwise pick it as a candidate, but it stays visible to the
 * collision resolver so:
 *
 * - **STOP** clamps neighbouring shifts against this anchor.
 * - **CHAIN_PUSH** treats the anchor as an obstacle to push past — the
 *   cascade can still absorb it if a primary shift physically collides
 *   with it.
 *
 * ```html
 * <div fNode fReflowIgnore>sticky annotation</div>
 * ```
 *
 * Reads as a boolean attribute; ignored when the reflow feature is not
 * registered (the registry is an optional inject).
 */
@Directive({
  selector: '[fReflowIgnore]',
  standalone: true,
})
export class FReflowIgnore implements OnInit, OnDestroy {
  public readonly fReflowIgnore = input(true, {
    transform: booleanAttribute,
  });

  private readonly _registry = inject(FReflowIgnoreRegistry);
  private readonly _node = inject(F_NODE);
  private readonly _injector = inject(Injector);

  public ngOnInit(): void {
    effect(
      () => {
        const id = this._node.fId();
        const shouldIgnore = this.fReflowIgnore();

        untracked(() => {
          if (shouldIgnore) {
            this._registry.add(id);
          } else {
            this._registry.remove(id);
          }
        });
      },
      { injector: this._injector },
    );
  }

  public ngOnDestroy(): void {
    this._registry.remove(this._node.fId());
  }
}
