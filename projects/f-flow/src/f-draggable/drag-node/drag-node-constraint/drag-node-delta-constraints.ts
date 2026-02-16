import { IPoint } from '@foblex/2d';
import { GridSnapper } from './grid-snapper';
import { DeltaClamp, IDeltaClampResult } from './delta-clamp';
import { Injector } from '@angular/core';
import { IDragNodeDeltaConstraintsResult } from './i-drag-node-delta-constraints-result';
import { FComponentsStore } from '../../../f-storage';
import { IDragNodeDeltaConstraints } from './i-drag-node-delta-constraints';

function _createClampResult(): IDeltaClampResult {
  return {
    value: { x: 0, y: 0 },
    overflow: { x: 0, y: 0 },
    edges: { left: false, right: false, top: false, bottom: false },
  };
}

export class DragNodeDeltaConstraints {
  private readonly _snapper: GridSnapper;

  private readonly _hardClamp: DeltaClamp;
  private readonly _hardResult: IDeltaClampResult = _createClampResult();

  private readonly _softClamps: DeltaClamp[] = [];
  private readonly _softResults: IDeltaClampResult[] = [];

  constructor(injector: Injector, pointerDown: IPoint, limits: IDragNodeDeltaConstraints) {
    const dnd = injector.get(FComponentsStore).fDraggable!;
    this._snapper = new GridSnapper(dnd, pointerDown);

    this._hardClamp = new DeltaClamp(limits.hard, 0.5);

    for (const soft of limits.soft) {
      this._softClamps.push(new DeltaClamp(soft.limits, 0.5));
      this._softResults.push(_createClampResult());
    }
  }

  public apply(delta: IPoint, forceSnap: boolean = false): IDragNodeDeltaConstraintsResult {
    const snapped = this._snapper.snap(delta, forceSnap);

    this._hardClamp.applyInto(snapped, this._hardResult);

    const hardDelta = {
      x: this._hardResult.value.x,
      y: this._hardResult.value.y,
    };

    for (let i = 0; i < this._softClamps.length; i++) {
      this._softClamps[i].applyInto(hardDelta, this._softResults[i]);
    }

    return { hardDelta, soft: this._softResults };
  }

  public finalize(delta: IPoint): IDragNodeDeltaConstraintsResult {
    return this.apply(delta, true);
  }
}
