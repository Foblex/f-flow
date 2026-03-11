import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  Injector,
  InputSignal,
  OnInit,
  untracked,
} from '@angular/core';
import { ILine, Point } from '@foblex/2d';
import { F_CONNECTION_COMPONENTS_PARENT } from '../../../../../models';
import { createGradientDomIdentifier } from '../../../../../utils';
import { FConnectionGradientBase } from '../../../models';

@Directive({})
export abstract class FConnectionGradientRendererBase implements OnInit {
  private readonly _connection = inject(F_CONNECTION_COMPONENTS_PARENT);
  private readonly _hostElement = inject(ElementRef<SVGLinearGradientElement>).nativeElement;
  private readonly _injector = inject(Injector);
  private readonly _hostAttributes = new Map<string, string>();
  private _startColor?: string;
  private _endColor?: string;

  public abstract gradient: InputSignal<FConnectionGradientBase>;

  public readonly gradientId = computed(() => createGradientDomIdentifier(this._connection.fId()));

  public ngOnInit(): void {
    this._listenColorChanges();
  }

  private _listenColorChanges(): void {
    effect(
      () => {
        this.gradient().fStartColor();
        this.gradient().fEndColor();
        untracked(() => {
          this._updateGradient();
        });
      },
      { injector: this._injector },
    );
  }

  public get stop1Element(): SVGStopElement {
    return this._hostElement.children.item(0) as SVGStopElement;
  }

  public get stop2Element(): SVGStopElement {
    return this._hostElement.children.item(1) as SVGStopElement;
  }

  public redraw(line: ILine): void {
    const x: number = line.point2.x - line.point1.x;
    const y: number = line.point2.y - line.point1.y;
    const distance: number = Math.sqrt(x * x + y * y) || 0.01;

    const from = new Point(0.5 - (0.5 * x) / distance, 0.5 - (0.5 * y) / distance);

    this._setHostAttribute('x1', from.x.toString());
    this._setHostAttribute('y1', from.y.toString());

    const to = new Point(0.5 + (0.5 * x) / distance, 0.5 + (0.5 * y) / distance);
    this._setHostAttribute('x2', to.x.toString());
    this._setHostAttribute('y2', to.y.toString());
    this._updateGradient();
  }

  private _updateGradient(): void {
    const gradient = this.gradient();
    this._setFromColor(gradient.fStartColor());
    this._setToColor(gradient.fEndColor());
  }

  private _setFromColor(color: string | undefined): void {
    const nextColor = color || 'transparent';
    if (this._startColor === nextColor) {
      return;
    }
    this._startColor = nextColor;
    this.stop1Element.setAttribute('stop-color', nextColor);
    this.stop1Element.style.setProperty('stop-color', nextColor);
  }

  private _setToColor(color: string | undefined): void {
    const nextColor = color || 'transparent';
    if (this._endColor === nextColor) {
      return;
    }
    this._endColor = nextColor;
    this.stop2Element.setAttribute('stop-color', nextColor);
    this.stop2Element.style.setProperty('stop-color', nextColor);
  }

  private _setHostAttribute(name: string, value: string): void {
    if (this._hostAttributes.get(name) === value) {
      return;
    }
    this._hostAttributes.set(name, value);
    this._hostElement.setAttribute(name, value);
  }
}
