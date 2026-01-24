import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ILine, Point } from '@foblex/2d';
import { F_CONNECTION_GRADIENT, FConnectionGradientBase } from './models';
import { F_CONNECTION_COMPONENTS_PARENT } from '../../models';
import { createGradientDomIdentifier } from '../../utils';

@Component({
  selector: 'linearGradient[fConnectionGradient]',
  templateUrl: './f-connection-gradient.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'f-component f-connection-gradient',
    '[attr.id]': 'gradientId',
  },
  providers: [{ provide: F_CONNECTION_GRADIENT, useExisting: FConnectionGradient }],
})
export class FConnectionGradient extends FConnectionGradientBase {
  private readonly _connection = inject(F_CONNECTION_COMPONENTS_PARENT);

  public get gradientId(): string {
    return createGradientDomIdentifier(
      this._connection.fId(),
      this._connection.fOutputId(),
      this._connection.fInputId(),
    );
  }

  public get stop1Element(): SVGStopElement {
    return this.hostElement.children.item(0) as SVGStopElement;
  }

  public get stop2Element(): SVGStopElement {
    return this.hostElement.children.item(1) as SVGStopElement;
  }

  public initialize(): void {
    this.stop1Element.setAttribute('offset', '0%');
    this.stop2Element.setAttribute('offset', '100%');
  }

  private _updateGradient(): void {
    this._setFromColor(this._connection.fStartColor());
    this._setToColor(this._connection.fEndColor());
  }

  private _setFromColor(color: string | undefined): void {
    this.stop1Element.setAttribute('stop-color', color || 'transparent');
  }

  private _setToColor(color: string | undefined): void {
    this.stop2Element.setAttribute('stop-color', color || 'transparent');
  }

  public override redraw(line: ILine): void {
    const x: number = line.point2.x - line.point1.x;
    const y: number = line.point2.y - line.point1.y;
    const distance: number = Math.sqrt(x * x + y * y) || 0.01;

    const from = new Point(0.5 - (0.5 * x) / distance, 0.5 - (0.5 * y) / distance);

    this.hostElement.setAttribute('x1', from.x.toString());
    this.hostElement.setAttribute('y1', from.y.toString());

    const to = new Point(0.5 + (0.5 * x) / distance, 0.5 + (0.5 * y) / distance);
    this.hostElement.setAttribute('x2', to.x.toString());
    this.hostElement.setAttribute('y2', to.y.toString());
    this._updateGradient();
  }
}
