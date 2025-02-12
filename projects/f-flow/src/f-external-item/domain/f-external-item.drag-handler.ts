import { IPoint, IRect, Point, RectExtensions } from '@foblex/2d';
import {
  FExternalItemBase,
  FExternalItemCreatePlaceholderRequest,
  FExternalItemCreatePreviewRequest,
  IFExternalItemDragResult
} from '../../f-external-item';
import { FDragHandlerResult, fInject, IFDragHandler } from '../../f-draggable';
import { BrowserService } from '@foblex/platform';
import { FMediator } from '@foblex/mediator';

export class FExternalItemDragHandler implements IFDragHandler {

  public fEventType = 'external-item';
  public fData: any;

  private _fResult = fInject(FDragHandlerResult<IFExternalItemDragResult>);

  private _fMediator = fInject(FMediator);
  private _fBrowser = fInject(BrowserService);

  private _preview: HTMLElement | SVGElement | undefined;
  private _placeholder: HTMLElement | SVGElement | undefined;
  private _onPointerDownRect: IRect = RectExtensions.initialize();

  private get _fItemHost(): HTMLElement | SVGElement {
    return this._fExternalItem.hostElement;
  }

  constructor(
    private _fExternalItem: FExternalItemBase,
  ) {
    this.fData = { fData: _fExternalItem.fData };
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
    this._fBrowser.document.body.appendChild(this._preview);
  }

  private _createAndAppendPlaceholder(): void {
    this._placeholder = this._fMediator.execute<HTMLElement>(
      new FExternalItemCreatePlaceholderRequest(this._fExternalItem)
    );

    this._fBrowser.document.body.appendChild(this._fItemHost.parentElement!.replaceChild(this._placeholder!, this._fItemHost));
  }

  private _matchElementSize(target: HTMLElement, sourceRect: IRect): void {
    target.style.width = `${ sourceRect.width }px`;
    target.style.height = `${ sourceRect.height }px`;
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
    const position = Point.fromPoint(this._onPointerDownRect).add(difference);
    this._preview!.style.transform = setTransform(position);
  }

  public onPointerUp(): void {
    this._fBrowser.document.body.removeChild(this._preview!);

    this._placeholder!.parentElement!.replaceChild(this._fItemHost, this._placeholder!);
  }
}

function setTransform({ x, y }: IPoint): string {
  return `translate3d(${ Math.round(x) }px, ${ Math.round(y) }px, 0)`;
}

