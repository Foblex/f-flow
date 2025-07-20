import {
  ChangeDetectionStrategy,
  Component, computed, effect,
  ElementRef,
  inject,
  Injector,
  input, numberAttribute,
  OnDestroy,
  OnInit,
  output,
  viewChild,
} from "@angular/core";
import {
  FCanvasBase, F_CANVAS
} from './f-canvas-base';
import { IPoint, PointExtensions, TransformModelExtensions } from '@foblex/2d';
import {
  FCanvasChangeEvent,
} from './domain';
import { FMediator } from '@foblex/mediator';
import {
  AddCanvasToStoreRequest,
  CenterGroupOrNodeRequest,
  FitToFlowRequest, GetFlowRequest,
  InputCanvasPositionRequest,
  InputCanvasScaleRequest, isMobile, RemoveCanvasFromStoreRequest,
  ResetScaleAndCenterRequest, ResetScaleRequest, SetBackgroundTransformRequest, transitionEnd, UpdateScaleRequest,
} from '../domain';
import { NotifyTransformChangedRequest } from '../f-storage';
import { Deprecated } from '../domain';
import { FFlowBase } from '../f-flow';

@Component({
  selector: 'f-canvas',
  templateUrl: './f-canvas.component.html',
  styleUrls: [ './f-canvas.component.scss' ],
  standalone: true,
  host: {
    'class': 'f-component f-canvas',
  },
  providers: [
    { provide: F_CANVAS, useExisting: FCanvasComponent }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FCanvasComponent extends FCanvasBase implements OnInit, OnDestroy {

  private readonly _fMediator = inject(FMediator);
  private readonly _elementReference = inject(ElementRef);
  private readonly _injector = inject(Injector);

  private _flowId: string | undefined;

  public override fCanvasChange = output<FCanvasChangeEvent>();

  public readonly position = input<IPoint, IPoint | null | undefined>(PointExtensions.initialize(), { transform: PointExtensions.castToPoint });
  public readonly scale = input<number, unknown>(1, { transform: numberAttribute });
  public readonly debounceTime = input<number, unknown>(0, { transform: numberAttribute });
  public override debounce = computed(() => this.debounceTime() < 0 ? 0 : this.debounceTime());

  public override get hostElement(): HTMLElement {
    return this._elementReference.nativeElement;
  }

  public override fGroupsContainer = viewChild.required<ElementRef<HTMLElement>>('fGroupsContainer');
  public override fNodesContainer = viewChild.required<ElementRef<HTMLElement>>('fNodesContainer');
  public override fConnectionsContainer = viewChild.required<ElementRef<HTMLElement>>('fConnectionsContainer');

  public get flowId(): string {
    return this._flowId!;
  }

  public ngOnInit(): void {
    this._flowId = this._fMediator.execute<FFlowBase>(new GetFlowRequest()).fId();
    this._fMediator.execute(new AddCanvasToStoreRequest(this));
    this._positionChange();
    this._scaleChange();
    super.subscribeOnCanvasChange();
  }

  private _positionChange(): void {
    effect(() => {
      this._fMediator.execute(new InputCanvasPositionRequest(this.transform, this.position()));
    }, { injector: this._injector });
  }

  private _scaleChange(): void {
    effect(() => {
      this._fMediator.execute(new InputCanvasScaleRequest(this.transform, this.scale()));
    }, { injector: this._injector });
  }

  public override redraw(): void {
    this._fMediator.execute(new SetBackgroundTransformRequest(this.transform));
    this.hostElement.setAttribute("style", `transform: ${ TransformModelExtensions.toString(this.transform) }`);
    this._fMediator.execute(new NotifyTransformChangedRequest());
  }

  public override redrawWithAnimation(): void {
    this._fMediator.execute(new SetBackgroundTransformRequest(this.transform));
    this.hostElement.setAttribute("style", `transition: transform ${ isMobile() ? 80 : 150 }ms ease-in-out; transform: ${ TransformModelExtensions.toString(this.transform) }`);
    transitionEnd(this.hostElement, () => this.redraw());
  }

  public centerGroupOrNode(id: string, animated: boolean = true): void {
    setTimeout(() => this._fMediator.execute(new CenterGroupOrNodeRequest(id, animated)));
  }

  public fitToScreen(toCenter: IPoint = PointExtensions.initialize(), animated: boolean = true): void {
    setTimeout(() => this._fMediator.execute(new FitToFlowRequest(toCenter, animated)));
  }

  public resetScaleAndCenter(animated: boolean = true): void {
    setTimeout(() => this._fMediator.execute(new ResetScaleAndCenterRequest(animated)));
  }

  public getScale(): number {
    return this.transform.scale || 1;
  }

  /**
   *  @deprecated Method "setZoom" is deprecated. Use "setScale" instead. This method will be removed in version 18.0.0.`,
   */
  @Deprecated('setScale')
  public setZoom(scale: number, toPosition: IPoint = PointExtensions.initialize()): void {
    this.setScale(scale, toPosition);
  }

  public override setScale(scale: number, toPosition: IPoint = PointExtensions.initialize()): void {
    this._fMediator.execute(new UpdateScaleRequest(scale, toPosition));
  }

  /**
   *  @deprecated Method "resetZoom" is deprecated. Use "resetScale" instead. This method will be removed in version 18.0.0.`,
   */
  @Deprecated('resetScale')
  public resetZoom(): void {
    this.resetScale();
  }

  public override resetScale(): void {
    this._fMediator.execute(new ResetScaleRequest());
  }

  public ngOnDestroy(): void {
    this._fMediator.execute(new RemoveCanvasFromStoreRequest());
  }
}
