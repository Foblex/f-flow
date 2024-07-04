import {
  ChangeDetectionStrategy,
  Component,
  ElementRef, Input, OnDestroy,
  OnInit
} from "@angular/core";
import {
  DomElementExtensions,
  IPoint,
  ITransformModel,
  PointExtensions,
  TransformModelExtensions
} from '@foblex/core';
import { F_BACKGROUND_PATTERN, IFBackgroundPattern } from '../domain';
import { startWith, Subject, Subscription } from 'rxjs';

let uniqueId: number = 0;

@Component({
  selector: "f-circle-pattern",
  template: ``,
  host: {
    '[attr.id]': 'id'
  },
  providers: [
    { provide: F_BACKGROUND_PATTERN, useExisting: FCirclePatternComponent }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FCirclePatternComponent implements OnInit, OnDestroy, IFBackgroundPattern {

  private _subscription$: Subscription = new Subscription();

  private _stateChanges: Subject<void> = new Subject<void>();

  public get hostElement(): HTMLElement {
    return this.elementReference.nativeElement;
  }

  @Input()
  public id: string = `f-pattern-${ uniqueId++ }`;


  private _color: string = 'rgba(0,0,0,0.1)';

  @Input()
  public set color(value: string) {
    this._color = value;
    this._stateChanges.next();
  }

  private _radius: number = 20;
  private _scaledRadius: number = 20;

  @Input()
  public set radius(value: number) {
    this._radius = value;
    this._stateChanges.next();
  }

  private _transform: ITransformModel = TransformModelExtensions.default();

  private _position: IPoint = PointExtensions.initialize();

  private _pattern!: SVGPatternElement;
  private _circle!: SVGCircleElement;

  constructor(
    private elementReference: ElementRef<HTMLElement>,
  ) {
    this.createPattern();
  }

  private createPattern(): void {
    this._pattern = DomElementExtensions.createSvgElement('pattern');
    this._pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    this.hostElement.appendChild(this._pattern);

    this._circle = DomElementExtensions.createSvgElement('circle');
    this._pattern.appendChild(this._circle);
  }

  public ngOnInit(): void {
    this._subscription$.add(this.subscribeToStateChanges());
  }

  private subscribeToStateChanges(): Subscription {
    return this._stateChanges.pipe(startWith(null)).subscribe(() => {
      this.redraw();
    });
  }

  private calculatePattern(): void {
    this._position.x = this._transform.position.x + this._transform.scaledPosition.x;
    this._position.y = this._transform.position.y + this._transform.scaledPosition.y;
    this._scaledRadius = this._radius * this._transform.scale;
  }

  private redraw(): void {
    this.calculatePattern();
    this.redrawPattern();
    this.redrawElement();
  }

  private redrawPattern(): void {
    this._pattern.setAttribute('x', `${ this._position.x }`);
    this._pattern.setAttribute('y', `${ this._position.y }`);
    this._pattern.setAttribute('width', `${ this._scaledRadius }`);
    this._pattern.setAttribute('height', `${ this._scaledRadius }`);
  }

  private redrawElement(): void {
    this._circle.setAttribute('fill', this._color);
    this._circle.setAttribute('cx', `${ this._scaledRadius / 2 }`);
    this._circle.setAttribute('cy', `${ this._scaledRadius / 2 }`);
    this._circle.setAttribute('r', `${ this._scaledRadius / this._radius }`);
  }

  public setTransform(transform: ITransformModel): void {
    this._transform = transform;
    this._stateChanges.next();
  }

  public ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
