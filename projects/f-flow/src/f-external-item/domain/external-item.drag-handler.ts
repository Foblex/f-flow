import { DomElementExtensions, IPoint, IRect, Point, PointExtensions, RectExtensions } from '@foblex/core';
import { FExternalItemBase } from '../../f-external-item';
import { IDraggableItem } from '../../f-draggable';
import { BrowserService } from '@foblex/platform';

export class ExternalItemDragHandler implements IDraggableItem {

  public placeholder: HTMLElement | SVGElement | undefined;

  private onPointerDownRect: IRect = RectExtensions.initialize();

  private difference: IPoint = PointExtensions.initialize();

  constructor(
    public externalItem: FExternalItemBase,
    private fBrowser: BrowserService
  ) {
  }

  private getStyle(position: IPoint): string {
    return `position: absolute; left: 0; top: 0; transform: translate(${ position.x }px, ${ position.y }px)`;
  }

  public initialize(): void {
    this.onPointerDownRect = this.getExternalItemRect();
    this.placeholder = DomElementExtensions.deepCloneNode(this.externalItem.hostElement);
    this.placeholder.setAttribute('style', this.getStyle(Point.fromPoint(this.onPointerDownRect)));
    this.fBrowser.document.body.appendChild(this.placeholder);
  }

  private getExternalItemRect(): IRect {
    const rect = this.externalItem.hostElement.getBoundingClientRect();
    const scrollTop = this.fBrowser.window.pageYOffset || this.fBrowser.document.documentElement.scrollTop;
    const scrollLeft = this.fBrowser.window.pageXOffset || this.fBrowser.document.documentElement.scrollLeft;
    const offsetTop = rect.top + scrollTop;
    const offsetLeft = rect.left + scrollLeft;
    return RectExtensions.initialize(offsetLeft, offsetTop, rect.width, rect.height);
  }

  public move(difference: IPoint): void {
    this.difference = difference;
    const position = Point.fromPoint(this.onPointerDownRect).add(this.difference);
    this.placeholder!.setAttribute('style', this.getStyle(position));
  }

  public complete(): void {
    this.fBrowser.document.body.removeChild(this.placeholder!);
  }
}
