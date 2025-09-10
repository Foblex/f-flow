import { IPoint } from "@foblex/2d";
import { SnapToGrid } from "./snap-to-grid";
import { IConstraintResult, RectConstraint } from "./rect-constraint";
import { Injector } from "@angular/core";
import { IDragLimits } from "../create-drag-model-from-selection";

export interface IConstraintSummary {
  hardDifference: IPoint;
  soft: IConstraintResult[];
}

export class DragConstraintPipeline {
  private readonly _snapper: SnapToGrid;
  private readonly _hardConstraint: RectConstraint;
  private readonly _softConstraints: RectConstraint[] = [];

  constructor(
    injector: Injector,
    pointerDown: IPoint,
    limits: IDragLimits,
  ) {
    this._snapper = new SnapToGrid(injector, pointerDown);
    this._hardConstraint = new RectConstraint(limits.hard);
    this._initSoftConstraints(limits);
  }

  private _initSoftConstraints(limits: IDragLimits): void {
    for (const soft of limits.soft) {
      this._softConstraints.push(new RectConstraint(soft.limits));
    }
  }

  public apply(difference: IPoint, adjustCellSize: boolean = false): IConstraintSummary {
    const snapped = this._snapper.snap(difference, adjustCellSize);
    const hardDifference = this._hardConstraint.apply(snapped).value;

    return {
      hardDifference,
      soft: this._softConstraints.map(c => c.apply(hardDifference)),
    };
  }

  public finalize(difference: IPoint): IConstraintSummary {
    return this.apply(difference, true);
  }
}
