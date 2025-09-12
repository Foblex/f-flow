import { IPoint, IRect, ITransformModel, Point, RectExtensions } from '@foblex/2d';
import {
  ExternalRectConstraint,
  FExternalItemBase,
  FExternalItemCreatePlaceholderRequest,
  FExternalItemCreatePreviewRequest,
  IFExternalItemDragResult,
} from '../../f-external-item';
import { FDragHandlerResult, IFDragHandler } from '../../f-draggable';
import { BrowserService } from '@foblex/platform';
import { FMediator } from '@foblex/mediator';
import { Injector } from '@angular/core';
import { FComponentsStore } from "../../f-storage";
import { GetNormalizedElementRectRequest } from "../../domain";
import { infinityMinMax } from "../../utils";

export class FExternalItemDragHandler implements IFDragHandler {

  public fEventType = 'external-item';
  public fData: any;

  private readonly _fResult: FDragHandlerResult<IFExternalItemDragResult>;
  private readonly _mediator: FMediator;
  private readonly _browser: BrowserService;
  private readonly _store: FComponentsStore;

  private _preview: HTMLElement | SVGElement | undefined;
  private _placeholder: HTMLElement | SVGElement | undefined;
  private _onPointerDownRect: IRect = RectExtensions.initialize();

  private get _fItemHost(): HTMLElement | SVGElement {
    return this._fExternalItem.hostElement;
  }

  private get _body(): Element {
    return this._browser.document.fullscreenElement ?? this._browser.document.body;
  }

  private get _transform(): ITransformModel {
    return this._store.fCanvas!.transform;
  }

  private readonly _fItemHostDisplay: string | undefined;

  private _applyConstraints: (difference: IPoint) => IPoint = (difference) => difference;

  constructor(
    injector: Injector,
    private _fExternalItem: FExternalItemBase,
  ) {
    this._store = injector.get(FComponentsStore);
    this._fResult = injector.get(FDragHandlerResult);
    this._mediator = injector.get(FMediator);
    this._browser = injector.get(BrowserService);
    this.fData = { fData: _fExternalItem.fData };
    this._initializeConstraints(injector);
    this._fItemHostDisplay = this._fItemHost.style.display;
  }

  private _initializeConstraints(injector: Injector): void {
    const constraint = new ExternalRectConstraint(injector, this._getStartPoint(), infinityMinMax())
    this._applyConstraints = (difference: IPoint): IPoint => {
      return constraint.limit(difference);
    }
  }

  private _getStartPoint(): IPoint {
    return this._mediator.execute<IRect>(
      new GetNormalizedElementRectRequest(this._fExternalItem.hostElement),
    );
  }

  public prepareDragSequence(): void {
    this._onPointerDownRect = this._getExternalItemRect();

    this._createAndAppendPreview();
    this._createAndAppendPlaceholder();

    this._setFResultData();
  }

  private _createAndAppendPreview(): void {
    this._preview = this._mediator.execute<HTMLElement>(
      new FExternalItemCreatePreviewRequest(this._fExternalItem),
    );
    if (this._fExternalItem.fPreviewMatchSize) {
      this._matchElementSize(this._preview, this._onPointerDownRect);
    }
    this._preview!.style.transform = setTransform(this._onPointerDownRect);
    this._body.appendChild(this._preview);
  }

  private _createAndAppendPlaceholder(): void {
    this._placeholder = this._mediator.execute<HTMLElement>(
      new FExternalItemCreatePlaceholderRequest(this._fExternalItem),
    );
    this._body.appendChild(this._fItemHost.parentElement!.replaceChild(this._placeholder!, this._fItemHost));
    this._fItemHost.style.display = 'none';
  }

  private _matchElementSize(target: HTMLElement, sourceRect: IRect): void {
    target.style.width = `${sourceRect.width}px`;
    target.style.height = `${sourceRect.height}px`;
  }

  private _setFResultData(): void {
    this._fResult.setData({
      preview: this._preview,
      fExternalItem: this._fExternalItem,
    });
  }

  private _getExternalItemRect(): IRect {
    const rect = this._fExternalItem.hostElement.getBoundingClientRect();
    const scrollTop = this._browser.window.pageYOffset || this._browser.document.documentElement.scrollTop;
    const scrollLeft = this._browser.window.pageXOffset || this._browser.document.documentElement.scrollLeft;
    const offsetTop = rect.top + scrollTop;
    const offsetLeft = rect.left + scrollLeft;

    return RectExtensions.initialize(offsetLeft, offsetTop, rect.width, rect.height);
  }

  public onPointerMove(difference: IPoint): void {

    const differenceWithRestrictions = Point.fromPoint(this._applyConstraints(difference))
      .mult(this._transform.scale);

    const position = Point.fromPoint(this._onPointerDownRect).add(differenceWithRestrictions);
    this._preview!.style.transform = setTransform(position);
  }

  public onPointerUp(): void {
    this._body.removeChild(this._preview!);

    this._placeholder!.parentElement!.replaceChild(this._fItemHost, this._placeholder!);
    this._fItemHost.style.display = this._fItemHostDisplay ?? 'block';
  }
}

function setTransform({ x, y }: IPoint): string {
  return `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
}

