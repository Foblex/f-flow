import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  numberAttribute,
  OnInit,
  viewChild,
} from '@angular/core';
import {
  F_BACKGROUND_PATTERN,
  FChannel,
  FChannelHub,
  FFlowModule,
  IFBackgroundPattern,
  notifyOnStart,
} from '@foblex/flow';
import {
  ITransformModel,
  PointExtensions,
  SizeExtensions,
  TransformModelExtensions,
} from '@foblex/2d';

@Component({
  selector: 'custom-background-example',
  templateUrl: './custom-background-example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule],
  providers: [{ provide: F_BACKGROUND_PATTERN, useExisting: FlowBackground }],
})
export class FlowBackground implements OnInit, IFBackgroundPattern {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _elementReference = inject(ElementRef);

  private readonly _stateChanges = new FChannel();

  public get hostElement(): HTMLElement {
    return this._elementReference.nativeElement;
  }

  public readonly size = input(80, { transform: numberAttribute });
  public readonly circleSize = input(16, { transform: numberAttribute });

  private _transform = TransformModelExtensions.default();

  private _position = PointExtensions.initialize();

  private _size = SizeExtensions.initialize(this.size(), this.size());
  private _radius = this.circleSize();

  private readonly _circlePattern = viewChild<ElementRef<SVGPatternElement>>('circlePattern');
  private readonly _circlePatternCircle = viewChild<ElementRef<SVGCircleElement>>('circle');

  private readonly _rectPattern = viewChild<ElementRef<SVGPatternElement>>('rectPattern');

  public ngOnInit(): void {
    this._listenStateChanges();
  }

  private _listenStateChanges(): void {
    new FChannelHub(this._stateChanges)
      .pipe(notifyOnStart())
      .listen(this._destroyRef, () => this._redraw());
  }

  private _redraw(): void {
    this._calculatePattern();
    this._redrawPattern();
  }

  private _calculatePattern(): void {
    this._position.x = this._transform.position.x + this._transform.scaledPosition.x;
    this._position.y = this._transform.position.y + this._transform.scaledPosition.y;
    this._size = SizeExtensions.initialize(
      this.size() * this._transform.scale,
      this.size() * this._transform.scale,
    );
    this._radius = this.circleSize() * this._transform.scale;
  }

  private _redrawPattern(): void {
    this._redrawRectPattern();
    this._redrawCirclePattern();
  }

  private _redrawRectPattern(): void {
    this._rectPattern()?.nativeElement.setAttribute('x', `${this._position.x}`);
    this._rectPattern()?.nativeElement.setAttribute('y', `${this._position.y}`);
    this._rectPattern()?.nativeElement.setAttribute('width', `${this._size.width}`);
    this._rectPattern()?.nativeElement.setAttribute('height', `${this._size.height}`);
  }

  private _redrawCirclePattern(): void {
    this._circlePattern()?.nativeElement.setAttribute('width', `${this._radius}`);
    this._circlePattern()?.nativeElement.setAttribute('height', `${this._radius}`);
    this._redrawCircleElement();
  }

  private _redrawCircleElement(): void {
    this._circlePatternCircle()?.nativeElement.setAttribute('r', `${this._transform.scale}`);
    this._circlePatternCircle()?.nativeElement.setAttribute('cx', `${this._transform.scale / 2}`);
    this._circlePatternCircle()?.nativeElement.setAttribute('cy', `${this._transform.scale / 2}`);
  }

  public setTransform(transform: ITransformModel): void {
    this._transform = transform;
    this._refresh();
  }

  private _refresh(): void {
    this._stateChanges.notify();
  }
}
