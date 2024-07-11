import { ILine, IPoint, IRect, Line, Point } from '@foblex/core';
import { GetConnectionLineRequest } from './get-connection-line.request';
import { Injectable } from '@angular/core';
import { EFConnectionBehavior } from '../../f-connection';
import { EFConnectableSide } from '../../f-connectors';
import { FExecutionRegister, IExecution } from '../../infrastructure';
import { IntersectionFinder, IRoundedRect } from '../intersections';

@Injectable()
@FExecutionRegister(GetConnectionLineRequest)
export class GetConnectionLineExecution implements IExecution<GetConnectionLineRequest, ILine> {

  private behaviorHandlers = {

    [ EFConnectionBehavior.FLOATING.toString() ]: this.floatingBehavior,

    [ EFConnectionBehavior.FIXED_CENTER.toString() ]: this.fixedCenterBehavior,

    [ EFConnectionBehavior.FIXED.toString() ]: this.fixedOutboundBehaviour,
  }

  public handle(payload: GetConnectionLineRequest): ILine {
    return this.behaviorHandlers[ payload.behavior ](payload);
  }

  private floatingBehavior(payload: GetConnectionLineRequest): ILine {
    const fromResult = IntersectionFinder.getIntersections(payload.outputRect.gravityCenter, payload.inputRect.gravityCenter, payload.outputRect)[ 0 ];
    const toResult = IntersectionFinder.getIntersections(payload.inputRect.gravityCenter, payload.outputRect.gravityCenter, payload.inputRect)[ 0 ];
    return new Line(
      fromResult ? fromResult : payload.outputRect.gravityCenter,
      toResult ? toResult : payload.inputRect.gravityCenter
    );
  }

  private fixedCenterBehavior(payload: GetConnectionLineRequest): ILine {
    return new Line(
      payload.outputRect.gravityCenter,
      payload.inputRect.gravityCenter
    );
  }

  private fixedOutboundBehaviour(payload: GetConnectionLineRequest): ILine {
    return new Line(
      positionFixedOutbound[ payload.outputSide === EFConnectableSide.AUTO ? EFConnectableSide.BOTTOM : payload.outputSide ](payload.outputRect as IRoundedRect),
      positionFixedOutbound[ payload.inputSide === EFConnectableSide.AUTO ? EFConnectableSide.TOP : payload.inputSide ](payload.inputRect as IRoundedRect)
    );
  }
}

const positionFixedOutbound = {
  [ EFConnectableSide.TOP ]: (rect: IRect): IPoint => {
    const result = new Point();
    result.y = rect.y;
    result.x = rect.x + rect.width / 2;
    return result;
  },
  [ EFConnectableSide.BOTTOM ]: (rect: IRect): IPoint => {
    const result = new Point();
    result.y = rect.y + rect.height;
    result.x = rect.x + rect.width / 2;
    return result;
  },
  [ EFConnectableSide.LEFT ]: (rect: IRect): IPoint => {
    const result = new Point();
    result.x = rect.x;
    result.y = rect.y + rect.height / 2;
    return result;
  },
  [ EFConnectableSide.RIGHT ]: (rect: IRect): IPoint => {
    const result = new Point();
    result.x = rect.x + rect.width;
    result.y = rect.y + rect.height / 2;
    return result;
  },
};




