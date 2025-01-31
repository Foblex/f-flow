import { IPoint, IRect, Point, PointExtensions, RectExtensions } from '@foblex/2d';
import { FExternalItemBase } from '../../f-external-item';
import { fInject, IFDragHandler } from '../../f-draggable';
import { BrowserService } from '@foblex/platform';
import { deepCloneNode } from '@foblex/utils';

export class ExternalItemDragHandler implements IFDragHandler {

  private _fBrowser = fInject(BrowserService);

  public placeholder: HTMLElement | SVGElement | undefined;

  private onPointerDownRect: IRect = RectExtensions.initialize();

  private difference: IPoint = PointExtensions.initialize();

  constructor(
    public externalItem: FExternalItemBase,
  ) {
  }

  private getStyle(position: IPoint): string {
    return `position: absolute; left: 0; top: 0; transform: translate(${ position.x }px, ${ position.y }px)`;
  }

  public prepareDragSequence(): void {
    this.onPointerDownRect = this.getExternalItemRect();
    this.placeholder = deepCloneNode(this.externalItem.hostElement);
    this.placeholder.setAttribute('style', this.getStyle(Point.fromPoint(this.onPointerDownRect)));
    this._fBrowser.document.body.appendChild(this.placeholder);
  }

  private getExternalItemRect(): IRect {
    const rect = this.externalItem.hostElement.getBoundingClientRect();
    const scrollTop = this._fBrowser.window.pageYOffset || this._fBrowser.document.documentElement.scrollTop;
    const scrollLeft = this._fBrowser.window.pageXOffset || this._fBrowser.document.documentElement.scrollLeft;
    const offsetTop = rect.top + scrollTop;
    const offsetLeft = rect.left + scrollLeft;
    return RectExtensions.initialize(offsetLeft, offsetTop, rect.width, rect.height);
  }

  public onPointerMove(difference: IPoint): void {
    this.difference = difference;
    const position = Point.fromPoint(this.onPointerDownRect).add(this.difference);
    this.placeholder!.setAttribute('style', this.getStyle(position));
  }

  public onPointerUp(): void {
    this._fBrowser.document.body.removeChild(this.placeholder!);
  }
}
