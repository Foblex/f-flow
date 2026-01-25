import {
  contentChild,
  contentChildren,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  Signal,
  untracked,
  viewChild,
} from '@angular/core';
import { ILine, IPoint, LineExtensions, PointExtensions } from '@foblex/2d';
import {
  ICanChangeVisibility,
  ISelectable,
  mixinChangeSelection,
  mixinChangeVisibility,
} from '../../mixins';
import { ConnectionLineBuilder, EFConnectionBehavior, EFConnectionConnectableSide } from '../utils';
import { EFConnectableSide, EFConnectionType } from '../enums';
import {
  ConnectionContentLayoutEngine,
  F_CONNECTION_CONTENT,
  F_CONNECTION_DRAG_HANDLE_END,
  F_CONNECTION_DRAG_HANDLE_START,
  F_CONNECTION_GRADIENT,
  F_CONNECTION_PATH,
  F_CONNECTION_SELECTION,
  F_CONNECTION_WAYPOINTS,
  FConnectionContentBase,
} from '../components';

const MIXIN_BASE = mixinChangeSelection(
  mixinChangeVisibility(
    class {
      constructor(public hostElement: HTMLElement) {}
    },
  ),
);

@Directive()
export abstract class FConnectionBase
  extends MIXIN_BASE
  implements ISelectable, ICanChangeVisibility
{
  private readonly _fConnectionBuilder = inject(ConnectionLineBuilder);

  public abstract override fId: Signal<string>;

  public readonly fStartColor = input<string>('black');

  public readonly fEndColor = input<string>('black');

  public abstract fOutputId: Signal<string>;

  public abstract fInputId: Signal<string>;

  public abstract fRadius: number;

  public abstract fOffset: number;

  protected path: string = '';

  public line = LineExtensions.initialize();

  public readonly fReassignableStart: Signal<boolean> = signal(false);

  public readonly fDraggingDisabled: Signal<boolean> = signal(false);

  public override readonly fSelectionDisabled: Signal<boolean> = signal(false);

  public abstract boundingElement: HTMLElement | SVGElement;

  public abstract fBehavior: EFConnectionBehavior;

  public abstract fType: EFConnectionType | string;

  public readonly fDefs = viewChild.required<ElementRef<SVGDefsElement>>('defs');

  public readonly fPath = viewChild.required(F_CONNECTION_PATH);

  public readonly fGradient = viewChild.required(F_CONNECTION_GRADIENT);

  public readonly fDragHandleStart = viewChild(F_CONNECTION_DRAG_HANDLE_START);

  public readonly fDragHandleEnd = viewChild.required(F_CONNECTION_DRAG_HANDLE_END);

  public readonly fSelection = viewChild.required(F_CONNECTION_SELECTION);

  public readonly fContents = contentChildren(F_CONNECTION_CONTENT, {
    descendants: true,
  });

  public readonly fWaypoints = contentChild(F_CONNECTION_WAYPOINTS);

  public readonly fInputSide: Signal<EFConnectionConnectableSide> = signal(
    EFConnectionConnectableSide.DEFAULT,
  );

  private _sourceSide = EFConnectableSide.AUTO;

  public readonly fOutputSide: Signal<EFConnectionConnectableSide> = signal(
    EFConnectionConnectableSide.DEFAULT,
  );

  private _targetSide = EFConnectableSide.AUTO;

  private _penultimatePoint = PointExtensions.initialize();
  private _secondPoint = PointExtensions.initialize();

  protected constructor() {
    super(inject(ElementRef<HTMLElement>).nativeElement);
    this._listenWaypointsChanges();
  }

  private _listenWaypointsChanges(): void {
    effect(() => {
      this.fWaypoints();
      untracked(() => {
        this.setLine(this.line);
        this.redraw();
      });
    });
  }

  public initialize(): void {
    this.fPath().initialize();
    this.fGradient().initialize();
    this.redraw();
  }

  public isContains(element: HTMLElement | SVGElement): boolean {
    return (
      (this.hostElement.firstChild?.lastChild as HTMLElement).contains(element) ||
      Array.from(this.fContents()?.values() ?? []).some((x) => x.hostElement?.contains(element)) ||
      this.fWaypoints()?.hostElement?.contains(element)
    );
  }

  public setLine({ point1, point2 }: ILine): void {
    this.line = LineExtensions.initialize(point1, point2);

    const { path, points, penultimatePoint, secondPoint, candidates } = this._getPathResult(
      point1,
      point2,
    );

    this.path = path;
    this._penultimatePoint = penultimatePoint || point1;
    this._secondPoint = secondPoint || point2;
    this.fWaypoints()?.candidates.set(candidates || []);

    new ConnectionContentLayoutEngine().layout(points || [], this._contents());
  }

  private _contents(): FConnectionContentBase[] {
    return Array.from(this.fContents()?.values() ?? []);
  }

  private _getPathResult(source: IPoint, target: IPoint) {
    return this._fConnectionBuilder.handle({
      type: this.fType,
      payload: {
        source,
        sourceSide: this._sourceSide,
        target,
        targetSide: this._targetSide,
        radius: this.fRadius,
        offset: this.fOffset,
        waypoints: this.fWaypoints()?.waypoints() || [],
      },
    });
  }

  public override markChildrenAsSelected(): void {
    this.fPath().select();
  }

  public override unmarkChildrenAsSelected(): void {
    this.fPath().deselect();
  }

  public redraw(): void {
    this.fPath().setPath(this.path);
    this.fSelection().setPath(this.path);
    this.fGradient().redraw(this.line);
    this.fDragHandleEnd().redraw(this._penultimatePoint, this.line.point2);
    this.fDragHandleStart()?.redraw(this._secondPoint, this.line.point1);
  }

  /**
   * Applies the resolved sides to the connection. Don't call this method directly; it's used internally.
   *
   * @param sourceSide The resolved side for the source element.
   * @param targetSide The resolved side for the target element.
   */
  public _applyResolvedSidesToConnection(
    sourceSide: EFConnectableSide,
    targetSide: EFConnectableSide,
  ): void {
    this._sourceSide = sourceSide;
    this._targetSide = targetSide;
  }
}
