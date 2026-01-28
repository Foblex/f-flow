import { BrowserService } from '@foblex/platform';

type MagneticLineRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const MAGNETIC_LINE_RECT_KEYS: (keyof MagneticLineRect)[] = ['left', 'top', 'width', 'height'];

export class MagneticLineElement {
  private readonly _element: HTMLElement;

  constructor(browser: BrowserService, hostElement: HTMLElement, className = 'f-magnetic-line') {
    this._element = browser.document.createElement('div');
    this._element.classList.add(className);
    this._element.style.position = 'absolute';
    this._element.style.display = 'none';

    hostElement.appendChild(this._element);
  }

  public show(): void {
    this._element.style.display = 'block';
  }

  public hide(): void {
    this._element.style.display = 'none';
  }

  public render(rect: Partial<MagneticLineRect>): void {
    for (const key of MAGNETIC_LINE_RECT_KEYS) {
      const value = rect[key];
      if (value != null) {
        this._element.style[key as never] = `${value}px`;
      }
    }
  }

  public clearRect(): void {
    for (const key of MAGNETIC_LINE_RECT_KEYS) {
      this._element.style.removeProperty(key);
    }
  }

  public destroy(): void {
    this._element.remove();
  }
}
