import { ChangeDetectionStrategy, Component, ElementRef, Inject } from "@angular/core";
import { ILine, Point } from '@foblex/2d';
import { F_CONNECTION_IDENTIFIERS } from '../f-connection-identifiers';
import { IHasConnectionFromTo } from '../i-has-connection-from-to';
import { IHasConnectionColor } from '../i-has-connection-color';
import { F_CONNECTION } from '../f-connection.injection-token';
import { CONNECTION_GRADIENT, IConnectionGradient } from './i-connection-gradient';

@Component({
  selector: "linearGradient[fConnectionGradient]",
  templateUrl: "./f-connection-gradient.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "f-component f-connection-gradient",
    '[attr.id]': 'gradientId'
  },
  providers: [ { provide: CONNECTION_GRADIENT, useExisting: FConnectionGradientComponent } ],
})
export class FConnectionGradientComponent implements IConnectionGradient {

  public get gradientId(): string {
    return F_CONNECTION_IDENTIFIERS.gradientId(
      this.base.fId + this.base.fOutputId + this.base.fInputId
    );
  }

  public get hostElement(): SVGLinearGradientElement {
    return this.elementReference.nativeElement;
  }

  public get stop1Element(): SVGStopElement {
    return this.elementReference.nativeElement.children.item(0) as SVGStopElement;
  }

  public get stop2Element(): SVGStopElement {
    return this.elementReference.nativeElement.children.item(1) as SVGStopElement;
  }

  constructor(
    private elementReference: ElementRef<SVGLinearGradientElement>,
    @Inject(F_CONNECTION) private base: IHasConnectionColor & IHasConnectionFromTo,
  ) {
  }

  public initialize(): void {
    this.stop1Element.setAttribute('offset', '0%');
    this.stop2Element.setAttribute('offset', '100%');
  }

  private updateGradient(): void {
    this.setFromColor(this.base.fStartColor);
    this.setToColor(this.base.fEndColor);
  }

  private setFromColor(color: string | undefined): void {
    this.stop1Element.setAttribute('stop-color', color || 'transparent');
  }

  private setToColor(color: string | undefined): void {
    this.stop2Element.setAttribute('stop-color', color || 'transparent');
  }

  public redraw(line: ILine): void {
    const x: number = line.point2.x - line.point1.x;
    const y: number = line.point2.y - line.point1.y;
    const distance: number = Math.sqrt(x * x + y * y) || 0.01;

    const from = new Point(0.5 - (0.5 * x) / distance, 0.5 - (0.5 * y) / distance);

    this.hostElement.setAttribute('x1', from.x.toString());
    this.hostElement.setAttribute('y1', from.y.toString());

    const to = new Point(0.5 + (0.5 * x) / distance, 0.5 + (0.5 * y) / distance);
    this.hostElement.setAttribute('x2', to.x.toString());
    this.hostElement.setAttribute('y2', to.y.toString());
    this.updateGradient();
  }
}

