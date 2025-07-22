import { IPoint, IRect, ITransformModel, PointExtensions } from '@foblex/2d';
import { IFDragHandler } from '../f-drag-handler';
import { FNodeBase } from '../../f-node';
import { FDraggableDataContext } from '../f-draggable-data-context';
import { FComponentsStore } from '../../f-storage';
import { BaseConnectionDragHandler } from '../f-node-move';
import {
  calculateDifferenceAfterRotation,
} from './calculate-difference-after-rotation';
import { GetNormalizedElementRectRequest } from '../../domain';
import { FMediator } from '@foblex/mediator';
import { Injector } from '@angular/core';

export class FNodeRotateDragHandler implements IFDragHandler {

  private readonly _fComponentsStore: FComponentsStore;
  private readonly _fMediator: FMediator;
  private readonly _fDraggableDataContext: FDraggableDataContext;

  public fEventType = 'node-rotate';
  public fData: any;

  private _initialRotationToX: number = 0;
  private readonly _startRotation: number = 0;

  private _onDownPoint!: IPoint;
  private _fNodeRect!: IRect;

  private get _transform(): ITransformModel {
    return this._fComponentsStore.fCanvas!.transform;
  }

  constructor(
    _injector: Injector,
    private _fNode: FNodeBase,
    private _fSourceHandlers: {
      connection: BaseConnectionDragHandler,
      connector: IPoint,
    }[],
    private _fTargetHandlers: {
      connection: BaseConnectionDragHandler,
      connector: IPoint,
    }[],
  ) {
    this._startRotation = this._fNode.rotate;
    this.fData = {
      fNodeId: _fNode.fId(),
    };

    this._fComponentsStore = _injector.get(FComponentsStore);
    this._fMediator = _injector.get(FMediator);
    this._fDraggableDataContext = _injector.get(FDraggableDataContext);
  }

  public prepareDragSequence(): void {
    this._fNodeRect = this._getOriginalNodeRect();
    this._onDownPoint = this._calculateDownPoint();
    this._initialRotationToX = this._calculateAngleBetweenVectors(this._onDownPoint) - this._startRotation;
  }

  private _getOriginalNodeRect(): IRect {
    return this._fMediator.execute<IRect>(new GetNormalizedElementRectRequest(this._fNode!.hostElement));
  }

  private _calculateDownPoint(): IPoint {
    return PointExtensions.sub(
      this._fDraggableDataContext.onPointerDownPosition,
      PointExtensions.sum(this._transform.position, this._transform.scaledPosition)
    );
  }

  private _calculateAngleBetweenVectors(position: IPoint): number {
    return Math.atan2(
      position.y - this._fNodeRect.gravityCenter.y,
      position.x - this._fNodeRect.gravityCenter.x
    ) * (180 / Math.PI);
  }

  public onPointerMove(difference: IPoint): void {
    const position = PointExtensions.sum(this._onDownPoint, difference);
    const rotation = this._calculateAngleBetweenVectors(position) - this._initialRotationToX;
    this._updateNodeRendering(rotation);

    this._fSourceHandlers.forEach((x) => {
      x.connection.setSourceDifference(
        this._calculateDifferenceAfterRotation(x.connector, rotation)
      )
    });
    this._fTargetHandlers.forEach((x) => {
      x.connection.setTargetDifference(
        this._calculateDifferenceAfterRotation(x.connector, rotation)
      );
    });
  }

  private _updateNodeRendering(rotation: number): void {
    this._fNode.updateRotate(rotation);
    this._fNode.redraw();
  }

  private _calculateDifferenceAfterRotation(position: IPoint, rotation: number): IPoint {
    return calculateDifferenceAfterRotation(
      position,
      rotation - this._startRotation,
      this._fNodeRect.gravityCenter
    )
  }

  public onPointerUp(): void {
    this._fNode.rotateChange.emit(this._fNode.rotate);
  }
}
