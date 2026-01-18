import { Directive, effect, inject, Injector, input, OnInit, untracked } from '@angular/core';
import { NotifyDataChangedRequest } from '../../../f-storage';
import { FMediator } from '@foblex/mediator';
import { castToEnum } from '@foblex/utils';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { F_CONNECTION_CONTENT, FConnectionContentBase } from './models';
import { PolylineContentAlign } from './utils';

/**
 * Directive for placing custom user content (text, icons, buttons, etc.)
 * along a connection line.
 *
 * It allows you to specify the position along the connection,
 * shift the content sideways (perpendicular to the path),
 * apply a margin near the edges, and control orientation.
 *
 * ### Usage examples
 *
 * ```html
 * <!-- Text centered on the connection -->
 * <div fConnectionContent [position]="0.5">
 *   Hello
 * </div>
 *
 * <!-- Button near the start of the connection, shifted upward by 12px -->
 * <button fConnectionContent [position]="0.2" [offset]="-12">
 *   +
 * </button>
 *
 * <!-- Icon at the end of the connection, with 6px margin and rotated along the path -->
 * <span fConnectionContent [position]="1" [margin]="6" align="along">
 *   ⮕
 * </span>
 * ```
 */
@Directive({
  selector: '[fConnectionContent]',
  standalone: true,
  host: {
    'class': 'f-connection-content',
  },
  providers: [{ provide: F_CONNECTION_CONTENT, useExisting: FConnectionContent, multi: true }],
})
export class FConnectionContent extends FConnectionContentBase implements OnInit {
  private readonly _mediator = inject(FMediator);
  private readonly _injector = inject(Injector);

  public override readonly position = input<number, unknown>(0.5, {
    transform: (x) => {
      const v = coerceNumberProperty(x);

      return v < 0 ? 0 : v > 1 ? 1 : v;
    },
  });

  public override readonly offset = input<number, unknown>(0, {
    transform: (x) => coerceNumberProperty(x),
  });

  public override readonly align = input<PolylineContentAlign, unknown>(PolylineContentAlign.NONE, {
    transform: (x) => castToEnum<PolylineContentAlign>(x, 'align', PolylineContentAlign),
  });

  public ngOnInit(): void {
    this._listenChanges();
  }

  private _listenChanges(): void {
    effect(
      () => {
        this.offset();
        this.position();
        this.align();
        untracked(() => this._mediator.execute(new NotifyDataChangedRequest()));
      },
      { injector: this._injector },
    );
  }
}
