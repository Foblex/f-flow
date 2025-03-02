import {
  AfterViewInit, booleanAttribute, DestroyRef,
  Directive,
  ElementRef,
  EventEmitter, inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from "@angular/core";
import { IPoint, IRect, ISize, PointExtensions, SizeExtensions } from '@foblex/2d';
import { BrowserService } from '@foblex/platform';
import { NotifyTransformChangedRequest } from '../f-storage';
import { FMediator } from '@foblex/mediator';
import { F_NODE, FNodeBase } from './f-node-base';
import { IHasHostElement } from '../i-has-host-element';
import { AddNodeToStoreRequest, UpdateNodeWhenStateOrSizeChangedRequest, RemoveNodeFromStoreRequest } from '../domain';

let uniqueId: number = 0;

@Directive({
  selector: "[fNode]",
  exportAs: "fComponent",
  host: {
    '[attr.data-f-node-id]': 'fId',
    class: "f-node f-component",
    '[class.f-node-dragging-disabled]': 'fDraggingDisabled',
    '[class.f-node-selection-disabled]': 'fSelectionDisabled',
  },
  providers: [
    { provide: F_NODE, useExisting: FNodeDirective }
  ],
})
export class FNodeDirective extends FNodeBase implements OnInit, AfterViewInit, IHasHostElement, OnDestroy {

  @Input('fNodeId')
  public override fId: string = `f-node-${ uniqueId++ }`;

  @Input('fNodeParentId')
  public override fParentId: string | null | undefined = null;

  @Input('fNodePosition')
  public override set position(value: IPoint) {
    if(!PointExtensions.isEqual(this._position, value)) {
      this._position = value;
      this.redraw();
      this.refresh();
    }
  }

  public override get position(): IPoint {
    return this._position;
  }

  @Output('fNodePositionChange')
  public override positionChange: EventEmitter<IPoint> = new EventEmitter<IPoint>();

  @Input('fNodeSize')
  public override set size(value: ISize) {
    if(!this.size || !SizeExtensions.isEqual(this._size!, value)) {
      this._size = value;
      this.redraw();
      this.refresh()
    }
  }

  @Input('fNodeRotate')
  public override set rotate(value: number) {
    if(this._rotate !== value) {
      this._rotate = value;
      this.redraw();
      this.refresh();
    }
  }
  public override get rotate(): number {
    return this._rotate;
  }

  @Output('fNodeRotateChange')
  public override rotateChange = new EventEmitter<number>();


  public override get size(): ISize {
    return this._size!;
  }

  @Output('fNodeSizeChange')
  public override sizeChange: EventEmitter<IRect> = new EventEmitter<IRect>();

  @Input({ alias: 'fNodeDraggingDisabled', transform: booleanAttribute })
  public override fDraggingDisabled: boolean = false;

  @Input({ alias: 'fNodeSelectionDisabled', transform: booleanAttribute })
  public override fSelectionDisabled: boolean = false;

  @Input({ transform: booleanAttribute })
  public override fIncludePadding: boolean = true;

  //Add ability to connect to first connectable input if node is at pointer position
  @Input({ transform: booleanAttribute })
  public override fConnectOnNode: boolean = true;

  private readonly _destroyRef = inject(DestroyRef);
  private readonly _fMediator = inject(FMediator);

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

    this._fMediator.execute<void>(new AddNodeToStoreRequest(this));
  }

  protected override setStyle(styleName: string, value: string) {
    this.renderer.setStyle(this.hostElement, styleName, value);
  }

  public override redraw(): void {
    super.redraw();
    this._fMediator.execute(new NotifyTransformChangedRequest());
  }

  public ngAfterViewInit(): void {
    if(!this.fBrowser.isBrowser()) {
      return;
    }
    this._listenStateSizeChanges();
  }

  private _listenStateSizeChanges(): void {
    this._fMediator.execute<void>(new UpdateNodeWhenStateOrSizeChangedRequest(this, this._destroyRef));
  }

  public override refresh(): void {
    this.stateChanges.notify();
  }

  public ngOnDestroy(): void {
    this._fMediator.execute<void>(new RemoveNodeFromStoreRequest(this));
  }
}
