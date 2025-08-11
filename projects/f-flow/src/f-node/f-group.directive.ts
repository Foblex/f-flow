import {
  AfterViewInit, booleanAttribute, DestroyRef,
  Directive,
  ElementRef,
  inject, input,
  Input, model,
  OnDestroy,
  OnInit, output,
  Renderer2,
} from "@angular/core";
import {IRect, ISize, PointExtensions, SizeExtensions} from '@foblex/2d';
import {F_NODE, FNodeBase} from './f-node-base';
import {NotifyTransformChangedRequest} from '../f-storage';
import {FMediator} from '@foblex/mediator';
import {BrowserService} from '@foblex/platform';
import {IHasHostElement} from '../i-has-host-element';
import {AddNodeToStoreRequest, UpdateNodeWhenStateOrSizeChangedRequest, RemoveNodeFromStoreRequest} from '../domain';

let uniqueId: number = 0;

@Directive({
  selector: "[fGroup]",
  exportAs: "fComponent",
  host: {
    '[attr.data-f-group-id]': 'fId()',
    class: "f-group f-component",
    '[class.f-group-dragging-disabled]': 'fDraggingDisabled()',
    '[class.f-group-selection-disabled]': 'fSelectionDisabled()',
  },
  providers: [
    {provide: F_NODE, useExisting: FGroupDirective}
  ],
})
export class FGroupDirective extends FNodeBase
  implements OnInit, AfterViewInit, IHasHostElement, OnDestroy {

  private readonly _destroyRef = inject(DestroyRef);
  private readonly _mediator = inject(FMediator);

  public override readonly fId = input<string>(`f-group-${uniqueId++}`, {alias: 'fGroupId'});

  public override readonly fParentId = input<string | null | undefined>(null, {
    alias: 'fGroupParentId',
  });

  public override readonly position = model(PointExtensions.initialize(), {
    alias: 'fGroupPosition',
  });

  @Input('fGroupSize')
  public override set size(value: ISize) {
    if (!this.size || !SizeExtensions.isEqual(this._size!, value)) {
      this._size = value;
      this.redraw();
      this.refresh()
    }
  }

  public override get size(): ISize {
    return this._size!;
  }

  public override sizeChange = output<IRect>({alias: 'fGroupSizeChange'});

  @Input('fGroupRotate')
  public override set rotate(value: number) {
    if (this._rotate !== value) {
      this._rotate = value;
      this.redraw();
      this.refresh();
    }
  }

  public override get rotate(): number {
    return this._rotate;
  }

  public override rotateChange = output<number>({alias: 'fGroupRotateChange'});

  public override readonly fConnectOnNode = input(true, {
    transform: booleanAttribute,
  });

  public override readonly fMinimapClass = input<string[] | string>([]);

  public override readonly fDraggingDisabled = input(false, {
    alias: 'fGroupDraggingDisabled',
    transform: booleanAttribute,
  });

  public override readonly fSelectionDisabled = input(false, {
    alias: 'fGroupSelectionDisabled',
    transform: booleanAttribute,
  });

  public override readonly fIncludePadding = input(true, {
    transform: booleanAttribute,
  });

  constructor(
    elementReference: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private fBrowser: BrowserService
  ) {
    super(elementReference.nativeElement);
    super.positionChanges();
  }

  public ngOnInit(): void {
    this.setStyle('position', 'absolute');
    this.setStyle('transform-origin', 'center');
    this.setStyle('user-select', 'none');
    this.setStyle('pointer-events', 'all');
    this.setStyle('left', '0');
    this.setStyle('top', '0');
    super.redraw();

    this._mediator.execute<void>(new AddNodeToStoreRequest(this));
  }

  protected override setStyle(styleName: string, value: string) {
    this.renderer.setStyle(this.hostElement, styleName, value);
  }

  public override redraw(): void {
    super.redraw();
    this._mediator.execute(new NotifyTransformChangedRequest());
  }

  public ngAfterViewInit(): void {
    if (!this.fBrowser.isBrowser()) {
      return;
    }
    this._listenStateSizeChanges();
  }

  private _listenStateSizeChanges(): void {
    this._mediator.execute<void>(new UpdateNodeWhenStateOrSizeChangedRequest(this, this._destroyRef));
  }

  public refresh(): void {
    this.stateChanges.notify();
  }

  public ngOnDestroy(): void {
    this._mediator.execute<void>(new RemoveNodeFromStoreRequest(this));
  }
}
