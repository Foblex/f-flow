import { BaseConnectionDragHandler } from './base-connection.drag-handler';
import { IPoint } from '@foblex/2d';
import { Injector } from '@angular/core';
import { FConnectionBase } from '../../../f-connection-v2';

export class SourceTargetConnectionDragHandler extends BaseConnectionDragHandler {
  private readonly _callTracker = new Map<string, boolean>();

  constructor(injector: Injector, fConnection: FConnectionBase) {
    super(injector, fConnection);
  }

  public override setSourceDifference(difference: IPoint) {
    super.setSourceDifference(difference);
    this._checkAndTriggerAction();
  }

  public override setTargetDifference(difference: IPoint) {
    super.setTargetDifference(difference);
    this._checkAndTriggerAction();
  }

  private _checkAndTriggerAction() {
    if ([...this._callTracker.values()].every(Boolean)) {
      this._callTracker.clear();
      this.redraw();
    }
  }
}
