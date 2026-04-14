import { BrowserService } from '@foblex/platform';

export class MagneticRectElement {
  private readonly _element: HTMLElement;

  private _isVisible = false;

  private _left = Number.NaN;
  private _top = Number.NaN;
  private _width = Number.NaN;
  private _height = Number.NaN;

  constructor(browser: BrowserService, hostElement: HTMLElement, className = 'f-rect') {
    this._element = browser.document.createElement('div');
    this._element.classList.add(className);

    const style = this._element.style;
    style.position = 'absolute';
    style.display = 'none';
    style.boxSizing = 'border-box';
    style.pointerEvents = 'none';

    hostElement.appendChild(this._element);
  }

  public show(): void {
    if (this._isVisible) {
      return;
    }

    this._isVisible = true;
    this._element.style.display = 'block';
  }

  public hide(): void {
    if (!this._isVisible) {
      return;
    }

    this._isVisible = false;
    this._element.style.display = 'none';
  }

  public render(left: number, top: number, width: number, height: number): void {
    const style = this._element.style;

    if (left !== this._left) {
      this._left = left;
      style.left = left + 'px';
    }

    if (top !== this._top) {
      this._top = top;
      style.top = top + 'px';
    }

    if (width !== this._width) {
      this._width = width;
      style.width = width + 'px';
    }

    if (height !== this._height) {
      this._height = height;
      style.height = height + 'px';
    }
  }

  public clearRect(): void {
    this._left = Number.NaN;
    this._top = Number.NaN;
    this._width = Number.NaN;
    this._height = Number.NaN;

    const style = this._element.style;
    style.removeProperty('left');
    style.removeProperty('top');
    style.removeProperty('width');
    style.removeProperty('height');
  }

  public destroy(): void {
    this._element.remove();
  }
}
