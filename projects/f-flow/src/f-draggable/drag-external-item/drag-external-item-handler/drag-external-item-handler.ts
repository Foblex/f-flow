import { IPoint, IRect, ITransformModel, Point, RectExtensions } from '@foblex/2d';
import { BrowserService } from '@foblex/platform';
import { FMediator } from '@foblex/mediator';
import { Injector } from '@angular/core';
import { DragHandlerBase, FDragHandlerResult } from '../../infrastructure';
import { FDragExternalItemStartEventData } from '../f-drag-external-item-start-event-data';
import { FComponentsStore } from '../../../f-storage';
import { infinityMinMax } from '../../../utils';
import { ExternalRectConstraint } from '../constraints';
import { GetNormalizedElementRectRequest } from '../../../domain';
import { IDragExternalItemDragResult } from '../i-drag-external-item-drag-result';
import { DragExternalItemCreatePreviewRequest } from '../drag-external-item-create-preview';
import { DragExternalItemCreatePlaceholderRequest } from '../drag-external-item-create-placeholder';
import { FExternalItemBase } from '../../../f-external-item';

export class DragExternalItemHandler extends DragHandlerBase<unknown> {
  protected readonly type = 'external-item';
  protected readonly kind = 'drag-external-item';

  protected override data() {
    return new FDragExternalItemStartEventData(this._externalItem.data());
  }

  private readonly _result: FDragHandlerResult<IDragExternalItemDragResult>;
  private readonly _mediator: FMediator;
  private readonly _browser: BrowserService;
  private readonly _store: FComponentsStore;

  private _previewEl?: HTMLElement | SVGElement;
  private _placeholderEl?: HTMLElement | SVGElement;

  private _pointerDownRect: IRect = RectExtensions.initialize();

  private _originalParent?: Node;
  private _originalNextSibling?: ChildNode | null;
  private readonly _originalDisplay: string;

  private _applyConstraints: (delta: IPoint) => IPoint = (d) => d;

  constructor(
    injector: Injector,
    private readonly _externalItem: FExternalItemBase<unknown>,
  ) {
    super();

    this._store = injector.get(FComponentsStore);
    this._result = injector.get(FDragHandlerResult);
    this._mediator = injector.get(FMediator);
    this._browser = injector.get(BrowserService);

    this._originalDisplay = this._host.style.display;

    this._initConstraints(injector);
  }

  private get _host(): HTMLElement | SVGElement {
    return this._externalItem.hostElement;
  }

  /** Overlay root: fullscreenElement (if any) or document.body */
  private get _overlayRoot(): Element {
    return this._browser.document.fullscreenElement ?? this._browser.document.body;
  }

  private get _transform(): ITransformModel {
    return this._store.transform;
  }

  private _initConstraints(injector: Injector): void {
    const constraint = new ExternalRectConstraint(injector, this._getStartRect(), infinityMinMax());

    this._applyConstraints = (delta: IPoint) => constraint.limit(delta);
  }

  private _getStartRect(): IRect {
    return this._mediator.execute<IRect>(
      new GetNormalizedElementRectRequest(this._externalItem.hostElement),
    );
  }

  public override prepareDragSequence(): void {
    this._pointerDownRect = this._readAbsoluteRect(this._host);

    this._rememberOriginalPlacement();

    this._previewEl = this._createPreview();
    this._placeholderEl = this._createPlaceholder();

    // 1) Preview goes to overlay
    this._placePreviewIntoOverlay();

    // 2) Placeholder replaces original *in its parent*
    // 3) Original is moved into overlay (hidden) — this preserves current behavior
    this._swapOriginalWithPlaceholderAndMoveOriginalIntoOverlay();

    this._result.setData({
      preview: this._previewEl,
      fExternalItem: this._externalItem,
    });
  }

  private _rememberOriginalPlacement(): void {
    const parent = this._host.parentNode;
    if (!parent) {
      // possible if host already detached
      this._originalParent = undefined;
      this._originalNextSibling = null;

      return;
    }

    this._originalParent = parent;
    this._originalNextSibling = this._host.nextSibling;
  }

  private _createPreview(): HTMLElement | SVGElement {
    const el = this._mediator.execute<HTMLElement>(
      new DragExternalItemCreatePreviewRequest(this._externalItem),
    );

    if (this._externalItem.previewMatchSize()) {
      this._matchSize(el as HTMLElement, this._pointerDownRect);
    }

    el.style.transform = _translate(this._pointerDownRect);

    return el;
  }

  private _createPlaceholder(): HTMLElement | SVGElement {
    return this._mediator.execute<HTMLElement>(
      new DragExternalItemCreatePlaceholderRequest(this._externalItem),
    );
  }

  private _placePreviewIntoOverlay(): void {
    // Ensure it is in overlay root (fullscreen or body)
    this._overlayRoot.appendChild(this._previewEl!);
  }

  private _swapOriginalWithPlaceholderAndMoveOriginalIntoOverlay(): void {
    const parent = this._originalParent;
    const placeholder = this._placeholderEl;

    if (!parent || !placeholder) return;

    // Replace original in its parent with placeholder
    const detachedOriginal = parent.replaceChild(placeholder, this._host);

    // Keep original alive but out of layout (current behavior): move to overlay and hide
    this._overlayRoot.appendChild(detachedOriginal);
    (this._host as HTMLElement).style.display = 'none';
  }

  public override onPointerMove(delta: IPoint): void {
    if (!this._previewEl) return;

    const constrained = this._applyConstraints(delta);

    // delta from flow space -> screen space (mult by scale)
    const screenDelta = Point.fromPoint(constrained).mult(this._transform.scale);

    const next = Point.fromPoint(this._pointerDownRect).add(screenDelta);
    this._previewEl.style.transform = _translate(next);
  }

  public override onPointerUp(): void {
    // Remove preview
    if (this._previewEl && this._previewEl.parentNode) {
      this._previewEl.parentNode.removeChild(this._previewEl);
    }

    // Restore original back into its place, remove placeholder
    this._restoreOriginalInParent();

    // Restore display
    (this._host as HTMLElement).style.display = this._originalDisplay || 'block';

    // cleanup refs
    this._previewEl = undefined;
    this._placeholderEl = undefined;
    this._originalParent = undefined;
    this._originalNextSibling = null;
  }

  private _restoreOriginalInParent(): void {
    const parent = this._originalParent;
    const placeholder = this._placeholderEl;

    if (!parent || !placeholder) return;

    // placeholder is currently in parent; swap back
    if (placeholder.parentNode === parent) {
      parent.replaceChild(this._host, placeholder);

      return;
    }

    // fallback: if placeholder somehow moved, re-insert original at remembered position
    if (this._originalNextSibling && this._originalNextSibling.parentNode === parent) {
      parent.insertBefore(this._host, this._originalNextSibling);
    } else {
      parent.appendChild(this._host);
    }
  }

  private _matchSize(target: HTMLElement, rect: IRect): void {
    target.style.width = `${rect.width}px`;
    target.style.height = `${rect.height}px`;
  }

  private _readAbsoluteRect(el: Element): IRect {
    const rect = el.getBoundingClientRect();

    // page offsets (works for most cases). if you ever support visualViewport, can refine.
    const scrollTop =
      this._browser.window.pageYOffset || this._browser.document.documentElement.scrollTop;
    const scrollLeft =
      this._browser.window.pageXOffset || this._browser.document.documentElement.scrollLeft;

    return RectExtensions.initialize(
      rect.left + scrollLeft,
      rect.top + scrollTop,
      rect.width,
      rect.height,
    );
  }
}

function _translate({ x, y }: IPoint): string {
  return `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
}
