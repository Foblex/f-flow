import { ITransformModel } from '@foblex/2d';
import { BrowserService } from '@foblex/platform';
import { IMagneticGapRect } from './i-magnetic-gap-rect';
import { MagneticRectElement } from './magnetic-rect-element';

export class MagneticRectsRenderer {
  private readonly _pool: MagneticRectElement[] = [];

  private _activeCount = 0;

  constructor(
    private readonly _browser: BrowserService,
    private readonly _hostElement: HTMLElement,
    private readonly _className = 'f-rect',
  ) {}

  public draw(rects: IMagneticGapRect[], transform: ITransformModel): void {
    const scale = transform.scale;
    const offsetX = transform.position.x + transform.scaledPosition.x;
    const offsetY = transform.position.y + transform.scaledPosition.y;

    for (let i = 0; i < rects.length; i++) {
      const magneticRect = this._getOrCreate(i);
      const rect = rects[i];

      magneticRect.show();
      magneticRect.render(
        rect.left * scale + offsetX,
        rect.top * scale + offsetY,
        rect.width * scale,
        rect.height * scale,
      );
    }

    for (let i = rects.length; i < this._activeCount; i++) {
      this._pool[i].hide();
    }

    this._activeCount = rects.length;
  }

  public hideAll(): void {
    for (let i = 0; i < this._activeCount; i++) {
      this._pool[i].hide();
    }

    this._activeCount = 0;
  }

  public destroy(): void {
    for (const item of this._pool) {
      item.destroy();
    }

    this._pool.length = 0;
    this._activeCount = 0;
  }

  private _getOrCreate(index: number): MagneticRectElement {
    if (index < this._pool.length) {
      return this._pool[index];
    }

    const item = new MagneticRectElement(this._browser, this._hostElement, this._className);

    this._pool.push(item);

    return item;
  }
}
