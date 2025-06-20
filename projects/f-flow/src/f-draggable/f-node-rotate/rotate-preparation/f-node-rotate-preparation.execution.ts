import { inject, Injectable, Injector } from '@angular/core';
import { FNodeRotatePreparationRequest } from './f-node-rotate-preparation.request';
import { IPoint, IRect, ITransformModel, Point, RectExtensions } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import {
  CalculateInputConnectionsRequest, CalculateOutputConnectionsRequest, GetNormalizedElementRectRequest,
  isValidEventTrigger,
  SelectAndUpdateNodeLayerRequest,
} from '../../../domain';
import { FNodeBase, isRotateHandle } from '../../../f-node';
import { FNodeRotateDragHandler } from '../f-node-rotate.drag-handler';
import { BaseConnectionDragHandler, SourceConnectionDragHandler, TargetConnectionDragHandler } from '../../f-node-move';
import { FConnectionBase } from '../../../f-connection';

@Injectable()
@FExecutionRegister(FNodeRotatePreparationRequest)
export class FNodeRotatePreparationExecution implements IExecution<FNodeRotatePreparationRequest, void> {

  private readonly _fMediator = inject(FMediator);
  private readonly _fComponentsStore = inject(FComponentsStore);
  private readonly _fDraggableDataContext = inject(FDraggableDataContext);
  private readonly _injector = inject(Injector);

  private get _transform(): ITransformModel {
    return this._fComponentsStore.fCanvas!.transform;
  }

  private get _fHost(): HTMLElement {
    return this._fComponentsStore.fFlow!.hostElement;
  }

  private _fNode: FNodeBase | undefined;

  public handle(request: FNodeRotatePreparationRequest): void {
    if (!this._isValid(request) || !this._isValidTrigger(request)) {
      return;
    }

    this._selectAndUpdateNodeLayer();

    this._fDraggableDataContext.onPointerDownScale = this._transform.scale;
    this._fDraggableDataContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this._fHost).div(this._transform.scale);

    this._fDraggableDataContext.draggableItems = [
      new FNodeRotateDragHandler(
        this._injector,
        this._fNode!,
        this._calculateOutputConnectionsDragHandlers(),
        this._calculateInputConnectionsDragHandlers(),
      )
    ];
  }

  private _isValid(request: FNodeRotatePreparationRequest): boolean {
    return this._fDraggableDataContext.isEmpty()
      && isRotateHandle(request.event.targetElement)
      && this._isNodeCanBeDragged(this._getNode(request.event.targetElement));
  }

  private _isNodeCanBeDragged(fNode?: FNodeBase): boolean {
    return !!fNode && !fNode.fDraggingDisabled;
  }

  private _getNode(element: HTMLElement): FNodeBase | undefined {
    this._fNode = this._fComponentsStore
      .fNodes.find(x => x.isContains(element));
    return this._fNode;
  }

  private _isValidTrigger(request: FNodeRotatePreparationRequest): boolean {
    return isValidEventTrigger(request.event.originalEvent, request.fTrigger);
  }

  private _selectAndUpdateNodeLayer() {
    this._fMediator.execute(
      new SelectAndUpdateNodeLayerRequest(this._fNode!)
    );
  }

  private _calculateInputConnectionsDragHandlers(): {
    connection: BaseConnectionDragHandler,
    connector: IPoint,
  }[] {
    return this._fMediator.execute<FConnectionBase[]>(
      new CalculateInputConnectionsRequest(this._fNode!)
    ).map((x: FConnectionBase) => {
      const connector = this._fComponentsStore.fInputs.find((y) => y.fId === x.fInputId)!.hostElement;
      return {
        connection: new TargetConnectionDragHandler(this._injector, x),
        connector: this._fMediator.execute<IRect>(new GetNormalizedElementRectRequest(connector)).gravityCenter
      }
    });
  }

  private _calculateOutputConnectionsDragHandlers(): {
    connection: BaseConnectionDragHandler,
    connector: IPoint,
  }[] {
    return this._fMediator.execute<FConnectionBase[]>(
      new CalculateOutputConnectionsRequest(this._fNode!)
    ).map((x: FConnectionBase) => {
      const connector = this._fComponentsStore.fOutputs.find((y) => y.fId === x.fOutputId)!.hostElement;
      return {
        connection: new SourceConnectionDragHandler(this._injector, x),
        connector: this._fMediator.execute<IRect>(new GetNormalizedElementRectRequest(connector)).gravityCenter
      }
    });
  }
}
