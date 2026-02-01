import { inject, Injectable, Injector } from '@angular/core';
import { FNodeRotatePreparationRequest } from './f-node-rotate-preparation.request';
import { IPoint, IRect, ITransformModel, Point } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import {
  CalculateInputConnectionsRequest,
  CalculateOutputConnectionsRequest,
  GetNormalizedElementRectRequest,
  isValidEventTrigger,
  SelectAndUpdateNodeLayerRequest,
} from '../../../domain';
import { FNodeBase, isRotateHandle } from '../../../f-node';
import { FNodeRotateDragHandler } from '../f-node-rotate.drag-handler';
import {
  DragNodeConnectionHandlerBase,
  DragNodeConnectionSourceHandler,
  DragNodeConnectionTargetHandler,
} from '../../f-node-move';
import { FConnectionBase } from '../../../f-connection-v2';
import { DragHandlerInjector } from '../../infrastructure';

@Injectable()
@FExecutionRegister(FNodeRotatePreparationRequest)
export class FNodeRotatePreparationExecution
  implements IExecution<FNodeRotatePreparationRequest, void>
{
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);
  private readonly _injector = inject(Injector);
  private readonly _dragInjector = inject(DragHandlerInjector);

  private get _transform(): ITransformModel {
    return this._store.transform;
  }

  private get _flowHost(): HTMLElement {
    return this._store.flowHost;
  }

  private _fNode: FNodeBase | undefined;

  public handle(request: FNodeRotatePreparationRequest): void {
    if (!this._isValid(request) || !this._isValidTrigger(request)) {
      return;
    }

    this._selectAndUpdateNodeLayer();

    this._dragContext.onPointerDownScale = this._transform.scale;
    this._dragContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this._flowHost)
      .div(this._transform.scale);

    this._dragContext.draggableItems = [
      new FNodeRotateDragHandler(
        this._injector,
        this._fNode!,
        this._calculateOutputConnectionsDragHandlers(),
        this._calculateInputConnectionsDragHandlers(),
      ),
    ];
  }

  private _isValid(request: FNodeRotatePreparationRequest): boolean {
    return (
      this._dragContext.isEmpty() &&
      isRotateHandle(request.event.targetElement) &&
      this._isNodeCanBeDragged(this._getNode(request.event.targetElement))
    );
  }

  private _isNodeCanBeDragged(fNode?: FNodeBase): boolean {
    return !!fNode && !fNode.fDraggingDisabled();
  }

  private _getNode(element: HTMLElement): FNodeBase | undefined {
    this._fNode = this._store.nodes.getAll().find((x) => x.isContains(element));

    return this._fNode;
  }

  private _isValidTrigger(request: FNodeRotatePreparationRequest): boolean {
    return isValidEventTrigger(request.event.originalEvent, request.fTrigger);
  }

  private _selectAndUpdateNodeLayer() {
    this._mediator.execute(new SelectAndUpdateNodeLayerRequest(this._fNode!));
  }

  private _calculateInputConnectionsDragHandlers(): {
    connection: DragNodeConnectionHandlerBase;
    connector: IPoint;
  }[] {
    return this._mediator
      .execute<FConnectionBase[]>(new CalculateInputConnectionsRequest(this._fNode!))
      .map((x) => {
        const connectorHost = this._store.inputs.require(x.fInputId())?.hostElement;
        const handler = this._dragInjector.get(DragNodeConnectionTargetHandler);
        handler.initialize(x);

        return {
          connection: handler,
          connector: this._mediator.execute<IRect>(
            new GetNormalizedElementRectRequest(connectorHost),
          ).gravityCenter,
        };
      });
  }

  private _calculateOutputConnectionsDragHandlers(): {
    connection: DragNodeConnectionHandlerBase;
    connector: IPoint;
  }[] {
    return this._mediator
      .execute<FConnectionBase[]>(new CalculateOutputConnectionsRequest(this._fNode!))
      .map((x) => {
        const connectorHost = this._store.outputs.require(x.fOutputId())?.hostElement;

        const handler = this._dragInjector.get(DragNodeConnectionSourceHandler);
        handler.initialize(x);

        return {
          connection: handler,
          connector: this._mediator.execute<IRect>(
            new GetNormalizedElementRectRequest(connectorHost),
          ).gravityCenter,
        };
      });
  }
}
