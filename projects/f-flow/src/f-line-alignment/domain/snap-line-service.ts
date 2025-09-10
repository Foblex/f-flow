import { ISize, ITransformModel } from '@foblex/2d';
import { SnapLineElement } from './snap-line-element';
import { BrowserService } from '@foblex/platform';

export class SnapLineService {
  private readonly _horizontalLine: SnapLineElement;
  private readonly _verticalLine: SnapLineElement;

  constructor(browser: BrowserService, hostElement: HTMLElement) {
    this._horizontalLine = new SnapLineElement(browser, hostElement);
    this._verticalLine = new SnapLineElement(browser, hostElement);
    this._horizontalLine.hide();
    this._verticalLine.hide();
  }

  public drawVerticalLine(x: number, size: ISize, transform: ITransformModel): void {
    this._verticalLine.show();
    this._verticalLine.draw({
      left: x * transform.scale + transform.position.x + transform.scaledPosition.x,
      top: 0,
      width: 1,
      height: size.height,
    });
  }

  public drawHorizontalLine(y: number, size: ISize, transform: ITransformModel): void {
    this._horizontalLine.show();
    this._horizontalLine.draw({
      left: 0,
      top: y * transform.scale + transform.position.y + transform.scaledPosition.y,
      width: size.width,
      height: 1,
    });
  }

  public hideVerticalLine(): void {
    this._verticalLine.hide();
  }

  public hideHorizontalLine(): void {
    this._horizontalLine.hide();
  }
}
