import { inject, Injectable } from '@angular/core';
import { CenterGroupOrNodeRequest } from './center-group-or-node-request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { IPoint, IRect, ITransformModel, PointExtensions, RectExtensions } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';
import { FNodeBase } from '../../../f-node';
import { RedrawCanvasWithAnimationRequest } from '../../../domain';

/**
 * Execution that centers a group or a node inside the flow.
 */
@Injectable()
@FExecutionRegister(CenterGroupOrNodeRequest)
export class CenterGroupOrNodeExecution implements IExecution<CenterGroupOrNodeRequest, void> {

  private readonly _store = inject(FComponentsStore);
  private readonly _fMediator = inject(FMediator);

  private get _transform(): ITransformModel {
    return this._store.fCanvas!.transform;
  }

  public handle(request: CenterGroupOrNodeRequest): void {
    const fNode = this._getNode(request.id);
    if (!fNode) {
      return;
    }

    this.toCenter(this._getNodeRect(fNode), this._getFlowRect(), fNode._position);

    this._fMediator.execute(new RedrawCanvasWithAnimationRequest(request.animated));
  }

  public toCenter(fNodeRect: IRect, fFlowRect: IRect, position: IPoint): void {
    this._transform.scaledPosition = PointExtensions.initialize();
    this._transform.position = PointExtensions.initialize(
      (fFlowRect.width - fNodeRect.width) / 2 - position.x * this._transform.scale,
      (fFlowRect.height - fNodeRect.height) / 2 - position.y * this._transform.scale,
    );
  }

  private _getNode(id: string): FNodeBase | undefined {
    return this._store.fNodes.find((x) => x.fId() === id);
  }

  private _getNodeRect(fNode: FNodeBase): IRect {
    return RectExtensions.fromElement(fNode.hostElement);
  }

  private _getFlowRect(): IRect {
    return RectExtensions.fromElement(this._store.fFlow!.hostElement);
  }
}
