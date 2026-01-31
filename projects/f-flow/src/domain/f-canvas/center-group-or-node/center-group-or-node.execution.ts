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
  private readonly _mediator = inject(FMediator);

  private get _transform(): ITransformModel {
    return this._store.transform;
  }

  public handle({ id, animated }: CenterGroupOrNodeRequest): void {
    const node = this._store.nodes.get(id);
    if (!node) {
      return;
    }

    this.toCenter(this._getNodeRect(node), this._getFlowRect(), node._position);

    this._mediator.execute(new RedrawCanvasWithAnimationRequest(animated));
  }

  public toCenter(fNodeRect: IRect, fFlowRect: IRect, position: IPoint): void {
    this._transform.scaledPosition = PointExtensions.initialize();
    this._transform.position = PointExtensions.initialize(
      (fFlowRect.width - fNodeRect.width) / 2 - position.x * this._transform.scale,
      (fFlowRect.height - fNodeRect.height) / 2 - position.y * this._transform.scale,
    );
  }

  private _getNodeRect(fNode: FNodeBase): IRect {
    return RectExtensions.fromElement(fNode.hostElement);
  }

  private _getFlowRect(): IRect {
    return RectExtensions.fromElement(this._store.flowHost);
  }
}
