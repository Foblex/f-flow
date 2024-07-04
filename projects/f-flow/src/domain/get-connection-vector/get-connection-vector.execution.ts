import { IPoint, IRect, IVector, Point, RectExtensions } from '@foblex/core';
import { GetConnectionVectorRequest } from './get-connection-vector.request';
import { Injectable } from '@angular/core';
import { EFConnectionBehavior } from '../../f-connection';
import { EFConnectableSide } from '../../f-connectors';
import { FExecutionRegister, IExecution } from '../../infrastructure';

@Injectable()
@FExecutionRegister(GetConnectionVectorRequest)
export class GetConnectionVectorExecution implements IExecution<GetConnectionVectorRequest, IVector> {

  private behaviorHandlers = {

    [ EFConnectionBehavior.FLOATING.toString() ]: this.floatingBehavior,

    [ EFConnectionBehavior.FIXED_CENTER.toString() ]: this.fixedCenterBehavior,

    [ EFConnectionBehavior.FIXED.toString() ]: this.fixedOutboundBehaviour,
  }

  public handle(payload: GetConnectionVectorRequest): IVector {
    return this.behaviorHandlers[ payload.behavior ](payload);
  }

  private floatingBehavior(payload: GetConnectionVectorRequest): IVector {
    const fromResult = RectExtensions.intersectionWithVector(payload.outputRect, payload.outputRect.gravityCenter, payload.inputRect.gravityCenter);
    const toResult = RectExtensions.intersectionWithVector(payload.inputRect, payload.outputRect.gravityCenter, payload.inputRect.gravityCenter);

    return {
      point1: fromResult ? fromResult[ 1 ] : payload.outputRect.gravityCenter,
      point2: toResult ? toResult[ 0 ] : payload.inputRect.gravityCenter,
    }
  }

  private fixedCenterBehavior(payload: GetConnectionVectorRequest): IVector {
    return {
      point1: payload.outputRect.gravityCenter,
      point2: payload.inputRect.gravityCenter,
    }
  }

  private fixedOutboundBehaviour(payload: GetConnectionVectorRequest): IVector {
    const point1 = positionFixedOutbound[ payload.outputSide === EFConnectableSide.AUTO ? EFConnectableSide.BOTTOM : payload.outputSide ](payload.outputRect);
    const point2 = positionFixedOutbound[ payload.inputSide === EFConnectableSide.AUTO ? EFConnectableSide.TOP : payload.inputSide ](payload.inputRect);

    return {
      point1: point1,
      point2: point2,
    }
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




