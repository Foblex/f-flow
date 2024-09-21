import { Injectable } from '@angular/core';
import { CenterGroupOrNodeRequest } from './center-group-or-node-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { IPoint, IRect, ITransformModel, PointExtensions, RectExtensions } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';
import { FNodeBase } from '../../../f-node';
import { F_CANVAS_ANIMATION_DURATION } from '../../../domain';

@Injectable()
@FExecutionRegister(CenterGroupOrNodeRequest)
export class CenterGroupOrNodeExecution implements IExecution<CenterGroupOrNodeRequest, void> {

  private get transform(): ITransformModel {
    return this.fComponentsStore.fCanvas!.transform;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
  ) {
  }

  public handle(request: CenterGroupOrNodeRequest): void {
    const fNode = this.getNode(request.id);
    if (!fNode) {
      return;
    }

    this.toCenter(this.getNodeRect(fNode), this.getFlowRect(), fNode.position);

    request.animated ? this.fComponentsStore.fCanvas!.redrawWithAnimation() : this.fComponentsStore.fCanvas!.redraw();
    this.fComponentsStore.fCanvas!.emitCanvasChangeEvent();
    setTimeout(() => this.fComponentsStore.componentDataChanged(), F_CANVAS_ANIMATION_DURATION);
  }

  public toCenter(fNodeRect: IRect, fFlowRect: IRect, position: IPoint): void {
    this.transform.scaledPosition = PointExtensions.initialize();
    this.transform.position = PointExtensions.initialize(
      (fFlowRect.width - fNodeRect.width) / 2 - position.x * this.transform.scale,
      (fFlowRect.height - fNodeRect.height) / 2 - position.y * this.transform.scale
    );
  }

  private getNode(id: string): FNodeBase | undefined {
    return this.fComponentsStore.fNodes.find((x) => x.fId === id);
  }

  private getNodeRect(fNode: FNodeBase): IRect {
    return RectExtensions.fromElement(fNode.hostElement);
  }

  private getFlowRect(): IRect {
    return RectExtensions.fromElement(this.fComponentsStore.fFlow!.hostElement);
  }
}
