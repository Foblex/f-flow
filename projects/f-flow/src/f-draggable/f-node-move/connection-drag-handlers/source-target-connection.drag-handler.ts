import { BaseConnectionDragHandler } from './base-connection.drag-handler';
import { FConnectionBase } from '../../../f-connection';
import { IPoint } from '@foblex/2d';

export class SourceTargetConnectionDragHandler extends BaseConnectionDragHandler {

  private readonly _callTracker = new Map<string, boolean>();

  constructor(fConnection: FConnectionBase) {
    super(fConnection);
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

