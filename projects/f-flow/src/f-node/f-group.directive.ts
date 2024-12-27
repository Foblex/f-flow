import {
  AfterViewInit, DestroyRef,
  Directive,
  ElementRef,
  EventEmitter, inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from "@angular/core";
import { IPoint, IRect, ISize, PointExtensions } from '@foblex/2d';
import { F_NODE, FNodeBase } from './f-node-base';
import { NotifyTransformChangedRequest } from '../f-storage';
import { FMediator } from '@foblex/mediator';
import { BrowserService } from '@foblex/platform';
import { IHasHostElement } from '../i-has-host-element';
import { AddNodeToStoreRequest, UpdateNodeWhenStateOrSizeChangedRequest, RemoveNodeFromStoreRequest } from '../domain';

let uniqueId: number = 0;

@Directive({
  selector: "[fGroup]",
  exportAs: "fComponent",
  host: {
    '[attr.data-f-group-id]': 'fId',
    class: "f-group f-component",
    '[class.f-group-dragging-disabled]': 'fDraggingDisabled',
    '[class.f-group-selection-disabled]': 'fSelectionDisabled',
  },
  providers: [
    { provide: F_NODE, useExisting: FGroupDirective }
  ],
})
export class FGroupDirective extends FNodeBase
  implements OnInit, AfterViewInit, IHasHostElement, OnDestroy {

  @Input('fGroupId')
  public override fId: string = `f-group-${ uniqueId++ }`;

  @Input('fGroupParentId')
  public override fParentId: string | null | undefined = null;

  @Input('fGroupPosition')
  public override set position(value: IPoint) {
    this._position = PointExtensions.castToPoint(value);
    this.refresh();
  }
  public override get position(): IPoint {
    return this._position;
  }
  @Output('fGroupPositionChange')
  public override positionChange: EventEmitter<IPoint> = new EventEmitter<IPoint>();

  @Input('fGroupSize')
  public override set size(value: ISize) {
    this._size = value;
    this.refresh();
  }
  public override get size(): ISize {
    return this._size!;
  }
  @Output('fGroupSizeChange')
  public override sizeChange: EventEmitter<IRect> = new EventEmitter<IRect>();

  @Input('fGroupDraggingDisabled')
  public override fDraggingDisabled: boolean = false;

  @Input('fGroupSelectionDisabled')
  public override fSelectionDisabled: boolean = false;

  @Input()
  public override fIncludePadding: boolean = true;

  @Input()
  public override fConnectOnNode: boolean = true;

  private _destroyRef = inject(DestroyRef);
  private _fMediator = inject(FMediator);

  constructor(
    elementReference: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private fBrowser: BrowserService
  ) {
    super(elementReference.nativeElement);
  }

  public ngOnInit(): void {
    this.setStyle('position', 'absolute');
    this.setStyle('transform-origin', 'center');
    this.setStyle('user-select', 'none');
    this.setStyle('pointer-events', 'all');
    this.setStyle('left', '0');
    this.setStyle('top', '0');
    super.redraw();

    this._fMediator.send<void>(new AddNodeToStoreRequest(this));
  }

  protected override setStyle(styleName: string, value: string) {
    this.renderer.setStyle(this.hostElement, styleName, value);
  }

  public override redraw(): void {
    super.redraw();
    this._fMediator.send(new NotifyTransformChangedRequest());
  }

  public ngAfterViewInit(): void {
    if(!this.fBrowser.isBrowser()) {
      return;
    }
    this._listenStateSizeChanges();
  }

  private _listenStateSizeChanges(): void {
    this._fMediator.send<void>(new UpdateNodeWhenStateOrSizeChangedRequest(this, this._destroyRef));
  }

  public refresh(): void {
    this.stateChanges.notify();
  }

  public ngOnDestroy(): void {
    this._fMediator.send<void>(new RemoveNodeFromStoreRequest(this));
  }
}
