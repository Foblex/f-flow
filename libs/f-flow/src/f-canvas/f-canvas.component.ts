import {
  afterNextRender,
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
  untracked,
  viewChild,
} from '@angular/core';
import { F_CANVAS, FCanvasBase } from './models';
import { IPoint, PointExtensions, TransformModelExtensions } from '@foblex/2d';
import { FCanvasChangeEvent } from './models';
import { FMediator } from '@foblex/mediator';
import { EFCanvasLayer } from './enums';
import { resolveLayerOrder } from './layers';
import { F_CANVAS_CONFIG } from './utils';
import {
  AddCanvasToStoreRequest,
  CenterGroupOrNodeRequest,
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
  WaitForConnectionsRenderedRequest,
} from '../domain';
import { FComponentsStore, NotifyTransformChangedRequest } from '../f-storage';
import { FFlowBase } from '../f-flow';
import { F_DEFAULT_LAYER_ORDER } from './constants';

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
  providers: [{ provide: F_CANVAS, useExisting: FCanvasComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FCanvasComponent extends FCanvasBase implements OnInit, OnDestroy {
  private readonly _mediator = inject(FMediator);
  private readonly _components = inject(FComponentsStore);
  private readonly _injector = inject(Injector);
  private readonly _config = inject(F_CANVAS_CONFIG, { optional: true });

  private _flowId: string | undefined;

  public override fCanvasChange = output<FCanvasChangeEvent>();

  public readonly position = input<IPoint, IPoint | null | undefined>(
    PointExtensions.initialize(),
    { transform: PointExtensions.castToPoint },
  );
  public readonly scale = input<number, unknown>(1, { transform: numberAttribute });
  public readonly debounceTime = input<number, unknown>(0, { transform: numberAttribute });
  public override debounce = computed(() => (this.debounceTime() < 0 ? 0 : this.debounceTime()));

  /**
   * Stacking order of the built-in layers (groups, connections, nodes),
   * read bottom to top. The first entry sits underneath, the last entry
   * sits on top. Defaults to the order shipped before v18.6:
   * `[GROUPS, CONNECTIONS, NODES]`.
   *
   * When `withFCanvas({ layers })` is provided in the component's
   * injector, this input falls back to that value; passing `fLayers`
   * directly always wins. Missing layers are appended in their default
   * position so every canvas renders all three regardless of input.
   */
  public readonly fLayers = input<EFCanvasLayer[] | undefined>(undefined);

  protected readonly resolvedLayers = computed<EFCanvasLayer[]>(() => {
    const fromInput = this.fLayers();
    if (fromInput && fromInput.length > 0) {
      return resolveLayerOrder(fromInput);
    }
    if (this._config?.layers) {
      return resolveLayerOrder(this._config.layers);
    }

    return [...F_DEFAULT_LAYER_ORDER];
  });

  protected readonly groupsZIndex = computed(() => this._zIndexFor(EFCanvasLayer.GROUPS));
  protected readonly connectionsZIndex = computed(() => this._zIndexFor(EFCanvasLayer.CONNECTIONS));
  protected readonly nodesZIndex = computed(() => this._zIndexFor(EFCanvasLayer.NODES));

  private _zIndexFor(layer: EFCanvasLayer): number {
    // +1 so every layer has a non-zero z-index and creates a real
    // stacking context for its descendants.
    return this.resolvedLayers().indexOf(layer) + 1;
  }

  public override fGroupsContainer =
    viewChild.required<ElementRef<HTMLElement>>('fGroupsContainer');
  public override fNodesContainer = viewChild.required<ElementRef<HTMLElement>>('fNodesContainer');
  public override fConnectionsContainer =
    viewChild.required<ElementRef<HTMLElement>>('fConnectionsContainer');

  public get flowId(): string {
    return this._flowId || '';
  }

  public ngOnInit(): void {
    this._flowId = this._mediator.execute<FFlowBase>(new GetFlowRequest()).fId();
    this._mediator.execute(new AddCanvasToStoreRequest(this));
    this._positionChange();
    this._scaleChange();
    super.subscribeOnCanvasChange();
  }

  private _positionChange(): void {
    effect(
      () => {
        const position = this.position();
        untracked(() => {
          this._mediator.execute(new InputCanvasPositionRequest(this.transform, position));
        });
      },
      { injector: this._injector },
    );
  }

  private _scaleChange(): void {
    effect(
      () => {
        const scale = this.scale();
        untracked(() => {
          this._mediator.execute(new InputCanvasScaleRequest(this.transform, scale));
        });
      },
      { injector: this._injector },
    );
  }

  /**
   * Redraws the canvas by applying the current transformation.
   */
  public override redraw(): void {
    this._mediator.execute(new SetBackgroundTransformRequest(this.transform));
    this.hostElement.style.removeProperty('transition');
    this.hostElement.style.transform = TransformModelExtensions.toString(this.transform);
    this._mediator.execute(new NotifyTransformChangedRequest());
  }

  /**
   * Redraws the canvas with an animation effect.
   * This method applies a CSS transition to the canvas element,
   * allowing for a smooth visual update of the canvas's transformation.
   */
  public override redrawWithAnimation(): void {
    this._mediator.execute(new SetBackgroundTransformRequest(this.transform));
    this.hostElement.style.transition = `transform ${isMobile() ? 80 : 150}ms ease-in-out`;
    this.hostElement.style.transform = TransformModelExtensions.toString(this.transform);
    transitionEnd(this.hostElement, () => this.redraw());
  }

  /**
   * Centers the specified group or node on the canvas.
   * @param groupOrNodeId - The ID of the group or node to center.
   * @param animated - If true, the centering will be animated; otherwise, it will be instantaneous.
   */
  public centerGroupOrNode(groupOrNodeId: string, animated: boolean = true): void {
    this._afterRedraw(() => {
      this._mediator.execute(new CenterGroupOrNodeRequest(groupOrNodeId, animated));
    });
  }

  /**
   * Fits the canvas to the screen by adjusting the scale and position.
   * @param padding - paddings from the bounds of the canvas
   * @param animated - If true, the fit will be animated; otherwise, it will be instantaneous.
   */
  public fitToScreen(
    padding: IPoint = PointExtensions.initialize(),
    animated: boolean = true,
  ): void {
    this._afterRedraw(() => {
      this._mediator.execute(new FitToFlowRequest(padding, animated));
    });
  }

  /**
   * Resets the scale and center all nodes and groups on the canvas.
   * This method is used to restore the canvas to its default scale and position,
   * allowing users to quickly return to a standard view of the canvas content.
   * @param animated - If true, the reset will be animated; otherwise, it will be instantaneous.
   * This is useful for providing a smooth user experience when resetting the view.
   */
  public resetScaleAndCenter(animated: boolean = true): void {
    this._afterRedraw(() => {
      this._mediator.execute(new ResetScaleAndCenterRequest(animated));
    });
  }

  /**
   *  Gets the current scale of the canvas.
   */
  public getScale(): number {
    return this.transform.scale || 1;
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
   * Resets the scale of the canvas to its default value.
   * This method is used to restore the canvas to its original scale.
   */
  public override resetScale(): void {
    this._mediator.execute(new ResetScaleRequest());
  }

  public ngOnDestroy(): void {
    this._mediator.execute(new RemoveCanvasFromStoreRequest());
  }

  private _afterRedraw(callback: () => void): void {
    this._mediator.execute(
      new WaitForConnectionsRenderedRequest(
        this._components.connectionsRevision,
        this._components.nodesRevision,
        () => afterNextRender(callback, { injector: this._injector }),
        this.destroyRef,
      ),
    );
  }
}
