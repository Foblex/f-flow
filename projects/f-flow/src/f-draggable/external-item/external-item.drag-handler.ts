import { DomElementExtensions, IPoint, IRect, Point, PointExtensions, RectExtensions } from '@foblex/core';
import { IDraggableItem } from '../i-draggable-item';
import { EFDraggableType } from '../e-f-draggable-type';
import { FExternalItemBase } from '../../f-external-item';

export class ExternalItemDragHandler implements IDraggableItem {

  public readonly type = EFDraggableType.PALETTE_ITEM;

  public placeholder: HTMLElement | SVGElement | undefined;

  private onPointerDownRect: IRect = RectExtensions.initialize();

  private difference: IPoint = PointExtensions.initialize();

  constructor(
    public externalItem: FExternalItemBase
  ) {
  }

  private getStyle(position: IPoint): string {
    return `position: absolute; left: 0; top: 0; transform: translate(${ position.x }px, ${ position.y }px)`;
  }

  public initialize(): void {
    this.onPointerDownRect = this.getExternalItemRect();
    this.placeholder = DomElementExtensions.deepCloneNode(this.externalItem.hostElement);
    this.placeholder.setAttribute('style', this.getStyle(Point.fromPoint(this.onPointerDownRect)));
    document.body.appendChild(this.placeholder);
  }

  private getExternalItemRect(): IRect {
    const rect = this.externalItem.hostElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
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
    document.body.removeChild(this.placeholder!);
  }
}
