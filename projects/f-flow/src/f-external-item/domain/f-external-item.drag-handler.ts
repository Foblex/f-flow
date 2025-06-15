import {IPoint, IRect, Point, RectExtensions} from '@foblex/2d';
import {
  FExternalItemBase,
  FExternalItemCreatePlaceholderRequest,
  FExternalItemCreatePreviewRequest,
  IFExternalItemDragResult
} from '../../f-external-item';
import {FDragHandlerResult, IFDragHandler, PointBoundsLimiter} from '../../f-draggable';
import {BrowserService} from '@foblex/platform';
import {FMediator} from '@foblex/mediator';
import {Injector} from '@angular/core';
import {FComponentsStore} from "../../f-storage";
import {GetNormalizedElementRectRequest} from "../../domain";
import {infinityMinMax} from "../../utils";

export class FExternalItemDragHandler implements IFDragHandler {

  public fEventType = 'external-item';
  public fData: any;

  private readonly _fResult: FDragHandlerResult<IFExternalItemDragResult>;
  private readonly _fMediator: FMediator;
  private readonly _fBrowser: BrowserService;
  private readonly _fComponentStore: FComponentsStore;

  private _preview: HTMLElement | SVGElement | undefined;
  private _placeholder: HTMLElement | SVGElement | undefined;
  private _onPointerDownRect: IRect = RectExtensions.initialize();
  private readonly _fBoundsLimiter: PointBoundsLimiter;


  private get _fItemHost(): HTMLElement | SVGElement {
    return this._fExternalItem.hostElement;
  }

  private get _body(): Element {
    return this._fBrowser.document.fullscreenElement ?? this._fBrowser.document.body;
  }

  constructor(
    _injector: Injector,
    private _fExternalItem: FExternalItemBase,
  ) {
    this.fData = {fData: _fExternalItem.fData};
    this._fResult = _injector.get(FDragHandlerResult);
    this._fMediator = _injector.get(FMediator);
    this._fBrowser = _injector.get(BrowserService);
    this._fComponentStore = _injector.get(FComponentsStore);

    this._fBoundsLimiter = new PointBoundsLimiter(
      _injector, this._getStartPoint(), infinityMinMax()
    );
  }

  private _getStartPoint(): IPoint {
    return this._fMediator.execute<IRect>(
      new GetNormalizedElementRectRequest(this._fExternalItem.hostElement)
    );
  }

  public prepareDragSequence(): void {
    this._onPointerDownRect = this._getExternalItemRect();

    this._createAndAppendPreview();
    this._createAndAppendPlaceholder();

    this._setFResultData();
  }

  private _createAndAppendPreview(): void {
    this._preview = this._fMediator.execute<HTMLElement>(
      new FExternalItemCreatePreviewRequest(this._fExternalItem)
    );
    if (this._fExternalItem.fPreviewMatchSize) {
      this._matchElementSize(this._preview, this._onPointerDownRect);
    }
    this._preview!.style.transform = setTransform(this._onPointerDownRect);
    this._body.appendChild(this._preview);
  }

  private _createAndAppendPlaceholder(): void {
    this._placeholder = this._fMediator.execute<HTMLElement>(
      new FExternalItemCreatePlaceholderRequest(this._fExternalItem)
    );

    this._body.appendChild(this._fItemHost.parentElement!.replaceChild(this._placeholder!, this._fItemHost));
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
    const scrollTop = this._fBrowser.window.pageYOffset || this._fBrowser.document.documentElement.scrollTop;
    const scrollLeft = this._fBrowser.window.pageXOffset || this._fBrowser.document.documentElement.scrollLeft;
    const offsetTop = rect.top + scrollTop;
    const offsetLeft = rect.left + scrollLeft;
    return RectExtensions.initialize(offsetLeft, offsetTop, rect.width, rect.height);
  }

  public onPointerMove(difference: IPoint): void {
    const adjustCellSize = this._fComponentStore.fDraggable?.fCellSizeWhileDragging ?? false;
    const differenceWithRestrictions = this._fBoundsLimiter.limit(difference, adjustCellSize);

    const position = Point.fromPoint(this._onPointerDownRect).add(differenceWithRestrictions);
    this._preview!.style.transform = setTransform(position);
  }

  public onPointerUp(): void {
    this._body.removeChild(this._preview!);

    this._placeholder!.parentElement!.replaceChild(this._fItemHost, this._placeholder!);
  }
}

function setTransform({x, y}: IPoint): string {
  return `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
}

