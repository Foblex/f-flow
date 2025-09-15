import { Directive, effect, ElementRef, inject, Injector, input, OnInit, untracked } from '@angular/core';
import { NotifyDataChangedRequest } from '../../f-storage';
import { FMediator } from '@foblex/mediator';
import { castToEnum } from '@foblex/utils';
import { IPolylineContent, PolylineContentAlign } from './polyline-content-engine';

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
})
export class FConnectionContent implements OnInit, IPolylineContent {
  private readonly _mediator = inject(FMediator);
  private readonly _injector = inject(Injector);

  /**
   * The host DOM element to which the directive is applied.
   * Used internally for positioning calculations.
   */
  public readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;

  /**
   * Position along the connection.
   *
   * A normalized value in the range `0..1`:
   * - `0` — at the start of the connection,
   * - `1` — at the end of the connection,
   * - `0.5` — at the middle of the connection (default).
   */
  public readonly position = input<number, number>(0.5, {
    transform: (v) => (v < 0 ? 0 : v > 1 ? 1 : v),
  });

  /**
   * Perpendicular offset from the connection line (in pixels).
   *
   * - Positive values shift the element to the right
   *   relative to the line direction.
   * - Negative values shift it to the left.
   * - Default: `0` (no shift).
   */
  public readonly offset = input<number>(0);

  /**
   * Controls the orientation (rotation) of the content relative to the connection.
   *
   * Possible values:
   * - `'none'` — no rotation (default).
   * - `'along'` — aligned along the path (tangent).
   */
  public readonly align = input<PolylineContentAlign, unknown>(PolylineContentAlign.NONE, {
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
