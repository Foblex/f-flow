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
    if(!PointExtensions.isEqual(this._position, value)) {
      this._position = value;
      this.redraw();
      this.refresh();
    }
  }
  public override get position(): IPoint {
    return this._position;
  }
  @Output('fGroupPositionChange')
  public override positionChange = new EventEmitter<IPoint>();


  @Input('fGroupRotate')
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

  @Output('fGroupRotateChange')
  public override rotateChange = new EventEmitter<number>();


  @Input('fGroupSize')
  public override set size(value: ISize) {
    if(!this.size || !SizeExtensions.isEqual(this._size!, value)) {
      this._size = value;
      this.redraw();
      this.refresh()
    }
  }
  public override get size(): ISize {
    return this._size!;
  }
  @Output('fGroupSizeChange')
  public override sizeChange = new EventEmitter<IRect>();

  @Input({ alias: 'fGroupDraggingDisabled', transform: booleanAttribute })
  public override fDraggingDisabled: boolean = false;

  @Input({ alias: 'fGroupSelectionDisabled', transform: booleanAttribute })
  public override fSelectionDisabled: boolean = false;

  @Input({ transform: booleanAttribute })
  public override fIncludePadding: boolean = true;

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

  public refresh(): void {
    this.stateChanges.notify();
  }

  public ngOnDestroy(): void {
    this._fMediator.execute<void>(new RemoveNodeFromStoreRequest(this));
  }
}
