import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  numberAttribute,
  OnDestroy,
  OnInit,
  output,
  viewChild,
} from "@angular/core";
import { F_CANVAS, FCanvasBase } from './f-canvas-base';
import { IPoint, PointExtensions, TransformModelExtensions } from '@foblex/2d';
import { FCanvasChangeEvent } from './domain';
import { FMediator } from '@foblex/mediator';
import {
  AddCanvasToStoreRequest,
  CenterGroupOrNodeRequest,
  Deprecated,
  FitToFlowRequest,
  GetFlowRequest,
  InputCanvasPositionRequest,
  InputCanvasScaleRequest,
  isMobile,
  RemoveCanvasFromStoreRequest,
  ResetScaleAndCenterRequest,
  ResetScaleRequest,
  SetBackgroundTransformRequest,
  transitionEnd,
  UpdateScaleRequest,
} from '../domain';
import { NotifyTransformChangedRequest } from '../f-storage';
import { FFlowBase } from '../f-flow';

/**
 * Component representing a canvas in the F-Flow framework.
 * It handles the rendering of nodes, connections, and groups,
 * as well as user interactions such as zooming and panning.
 * It extends the FCanvasBase class and implements OnInit and OnDestroy lifecycle hooks.
 * It provides methods to manipulate the canvas, such as centering nodes or groups,
 * fitting the canvas to the screen, and resetting the scale.
 * It also emits events when the canvas changes, allowing other components to react to these changes.
 */
@Component({
  selector: 'f-canvas',
  templateUrl: './f-canvas.component.html',
  styleUrls: ['./f-canvas.component.scss'],
  standalone: true,
  host: {
    'class': 'f-component f-canvas',
  },
  providers: [
    { provide: F_CANVAS, useExisting: FCanvasComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FCanvasComponent extends FCanvasBase implements OnInit, OnDestroy {

  private readonly _mediator = inject(FMediator);
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
    this._flowId = this._mediator.execute<FFlowBase>(new GetFlowRequest()).fId();
    this._mediator.execute(new AddCanvasToStoreRequest(this));
    this._positionChange();
    this._scaleChange();
    super.subscribeOnCanvasChange();
  }

  private _positionChange(): void {
    effect(() => {
      this._mediator.execute(new InputCanvasPositionRequest(this.transform, this.position()));
    }, { injector: this._injector });
  }

  private _scaleChange(): void {
    effect(() => {
      this._mediator.execute(new InputCanvasScaleRequest(this.transform, this.scale()));
    }, { injector: this._injector });
  }

  /**
   * Redraws the canvas by applying the current transformation.
   */
  public override redraw(): void {
    this._mediator.execute(new SetBackgroundTransformRequest(this.transform));
    this.hostElement.setAttribute("style", `transform: ${TransformModelExtensions.toString(this.transform)}`);
    this._mediator.execute(new NotifyTransformChangedRequest());
  }

  /**
   * Redraws the canvas with an animation effect.
   * This method applies a CSS transition to the canvas element,
   * allowing for a smooth visual update of the canvas's transformation.
   */
  public override redrawWithAnimation(): void {
    this._mediator.execute(new SetBackgroundTransformRequest(this.transform));
    this.hostElement.setAttribute("style", `transition: transform ${isMobile() ? 80 : 150}ms ease-in-out; transform: ${TransformModelExtensions.toString(this.transform)}`);
    transitionEnd(this.hostElement, () => this.redraw());
  }

  /**
   * Centers the specified group or node on the canvas.
   * @param groupOrNodeId - The ID of the group or node to center.
   * @param animated - If true, the centering will be animated; otherwise, it will be instantaneous.
   */
  public centerGroupOrNode(groupOrNodeId: string, animated: boolean = true): void {
    setTimeout(() => this._mediator.execute(new CenterGroupOrNodeRequest(groupOrNodeId, animated)));
  }

  /**
   * Fits the canvas to the screen by adjusting the scale and position.
   * @param padding - paddings from the bounds of the canvas
   * @param animated - If true, the fit will be animated; otherwise, it will be instantaneous.
   */
  public fitToScreen(padding: IPoint = PointExtensions.initialize(), animated: boolean = true): void {
    setTimeout(() => this._mediator.execute(new FitToFlowRequest(padding, animated)));
  }

  /**
   * Resets the scale and center all nodes and groups on the canvas.
   * This method is used to restore the canvas to its default scale and position,
   * allowing users to quickly return to a standard view of the canvas content.
   * @param animated - If true, the reset will be animated; otherwise, it will be instantaneous.
   * This is useful for providing a smooth user experience when resetting the view.
   */
  public resetScaleAndCenter(animated: boolean = true): void {
    setTimeout(() => this._mediator.execute(new ResetScaleAndCenterRequest(animated)));
  }

  /**
   *  Gets the current scale of the canvas.
   */
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

  /**
   * Sets the scale of the canvas to a specified value.
   * This method is used to zoom in or out of the canvas,
   * allowing users to adjust the view of the canvas content.
   * @param scale - The scale factor to set for the canvas.
   * @param toPosition - The position to which the canvas should be centered after scaling.
   */
  public override setScale(scale: number, toPosition: IPoint = PointExtensions.initialize()): void {
    this._mediator.execute(new UpdateScaleRequest(scale, toPosition));
  }

  /**
   *  @deprecated Method "resetZoom" is deprecated. Use "resetScale" instead. This method will be removed in version 18.0.0.`,
   */
  @Deprecated('resetScale')
  public resetZoom(): void {
    this.resetScale();
  }

  /**
   * Resets the scale of the canvas to its default value.
   * This method is used to restore the canvas to its original scale.
   */
  public override resetScale(): void {
    this._mediator.execute(new ResetScaleRequest());
  }

  public ngOnDestroy(): void {
    this._mediator.execute(new RemoveCanvasFromStoreRequest());
  }
}
