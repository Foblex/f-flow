import { CalculateConnectionLineByBehaviorRequest } from './calculate-connection-line-by-behavior-request';
import { Injectable } from '@angular/core';
import { EFConnectionBehavior } from '../../../f-connection';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ILine } from '@foblex/2d';
import { floatingBehavior } from './floating-behavior';
import { fixedCenterBehavior } from './fixed-center-behavior';
import { fixedOutboundBehavior } from './fixed-outbound-behavior';

/**
 * Execution that calculates the connection line based on the behavior.
 */
@Injectable()
@FExecutionRegister(CalculateConnectionLineByBehaviorRequest)
export class CalculateConnectionLineByBehavior
  implements IExecution<CalculateConnectionLineByBehaviorRequest, ILine>
{
  private _handlers = {
    [EFConnectionBehavior.FLOATING.toString()]: floatingBehavior,

    [EFConnectionBehavior.FIXED_CENTER.toString()]: fixedCenterBehavior,

    [EFConnectionBehavior.FIXED.toString()]: fixedOutboundBehavior,
  };

  public handle(payload: CalculateConnectionLineByBehaviorRequest): ILine {
    return this._handlers[payload.behavior](payload);
  }
}
