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

  private get transform(): ITransformModel {
    return this._store.fCanvas!.transform;
  }

  public handle(request: CenterGroupOrNodeRequest): void {
    const fNode = this.getNode(request.id);
    if (!fNode) {
      return;
    }

    this.toCenter(this.getNodeRect(fNode), this.getFlowRect(), fNode._position);

    this._fMediator.execute(new RedrawCanvasWithAnimationRequest(request.animated));
  }

  public toCenter(fNodeRect: IRect, fFlowRect: IRect, position: IPoint): void {
    this.transform.scaledPosition = PointExtensions.initialize();
    this.transform.position = PointExtensions.initialize(
      (fFlowRect.width - fNodeRect.width) / 2 - position.x * this.transform.scale,
      (fFlowRect.height - fNodeRect.height) / 2 - position.y * this.transform.scale,
    );
  }

  private getNode(id: string): FNodeBase | undefined {
    return this._store.fNodes.find((x) => x.fId() === id);
  }

  private getNodeRect(fNode: FNodeBase): IRect {
    return RectExtensions.fromElement(fNode.hostElement);
  }

  private getFlowRect(): IRect {
    return RectExtensions.fromElement(this._store.fFlow!.hostElement);
  }
}
