import { ISize, ITransformModel } from '@foblex/2d';
import { BrowserService } from '@foblex/platform';
import { MagneticLineElement } from './magnetic-line-element';

export class MagneticLinesRenderer {
  private readonly _horizontal: MagneticLineElement;
  private readonly _vertical: MagneticLineElement;

  constructor(browser: BrowserService, hostElement: HTMLElement) {
    this._horizontal = new MagneticLineElement(browser, hostElement);
    this._vertical = new MagneticLineElement(browser, hostElement);

    this.hideAll();
  }

  public renderVertical(x: number, size: ISize, transform: ITransformModel): void {
    this._vertical.show();
    this._vertical.render({
      left: x * transform.scale + transform.position.x + transform.scaledPosition.x,
      top: 0,
      width: 1,
      height: size.height,
    });
  }

  public renderHorizontal(y: number, size: ISize, transform: ITransformModel): void {
    this._horizontal.show();
    this._horizontal.render({
      left: 0,
      top: y * transform.scale + transform.position.y + transform.scaledPosition.y,
      width: size.width,
      height: 1,
    });
  }

  public hideVertical(): void {
    this._vertical.hide();
  }

  public hideHorizontal(): void {
    this._horizontal.hide();
  }

  public hideAll(): void {
    this._vertical.hide();
    this._horizontal.hide();
  }
}
