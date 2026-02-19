import { inject, Injectable } from '@angular/core';
import { RotateNodePreparationRequest } from './rotate-node-preparation-request';
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
import { RotateNodeHandler } from '../rotate-node-handler';
import { DragHandlerInjector } from '../../infrastructure';
import {
  DragNodeConnectionHandlerBase,
  DragNodeConnectionSourceHandler,
  DragNodeConnectionTargetHandler,
} from '../../drag-node';
import { FConnectionBase } from '../../../f-connection-v2';

type TRotateConnectionHandler = {
  connection: DragNodeConnectionHandlerBase;
  connector: IPoint;
};

@Injectable()
@FExecutionRegister(RotateNodePreparationRequest)
export class RotateNodePreparation implements IExecution<RotateNodePreparationRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);
  private readonly _dragInjector = inject(DragHandlerInjector);

  private get _transform(): ITransformModel {
    return this._store.transform;
  }

  public handle(request: RotateNodePreparationRequest): void {
    if (!this._isPreparationAllowed(request)) {
      return;
    }

    const nodeOrGroup = this._findRotatableNode(request.event.targetElement);
    if (!nodeOrGroup) {
      return;
    }

    this._selectBeforeRotate(nodeOrGroup);

    const scale = this._transform.scale;
    this._dragContext.onPointerDownScale = scale;
    this._dragContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this._store.flowHost)
      .div(scale);

    const handler = this._dragInjector.createInstance(RotateNodeHandler);
    handler.initialize(
      nodeOrGroup,
      this._buildOutputConnectionHandlers(nodeOrGroup),
      this._buildInputConnectionHandlers(nodeOrGroup),
    );

    this._dragContext.draggableItems = [handler];
  }

  private _isPreparationAllowed({ event, fTrigger }: RotateNodePreparationRequest): boolean {
    return (
      this._dragContext.isEmpty() &&
      isRotateHandle(event.targetElement) &&
      isValidEventTrigger(event.originalEvent, fTrigger)
    );
  }

  private _findRotatableNode(target: HTMLElement): FNodeBase | undefined {
    for (const node of this._store.nodes.getAll()) {
      if (node.fDraggingDisabled()) {
        continue;
      }

      if (node.isContains(target)) {
        return node;
      }
    }

    return undefined;
  }

  private _selectBeforeRotate(node: FNodeBase): void {
    queueMicrotask(() => {
      this._mediator.execute<void>(new SelectAndUpdateNodeLayerRequest(node));
    });
  }

  private _buildInputConnectionHandlers(nodeOrGroup: FNodeBase): TRotateConnectionHandler[] {
    return this._mediator
      .execute<FConnectionBase[]>(new CalculateInputConnectionsRequest(nodeOrGroup))
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

  private _buildOutputConnectionHandlers(nodeOrGroup: FNodeBase): TRotateConnectionHandler[] {
    return this._mediator
      .execute<FConnectionBase[]>(new CalculateOutputConnectionsRequest(nodeOrGroup))
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
