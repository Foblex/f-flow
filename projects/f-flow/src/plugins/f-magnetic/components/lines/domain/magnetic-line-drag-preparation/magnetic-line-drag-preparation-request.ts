import { IPointerEvent } from '../../../../../../drag-toolkit';

export class MagneticLineDragPreparationRequest {
  static readonly fToken = Symbol('MagneticLineDragPreparationRequest');
  constructor(public readonly event: IPointerEvent) {}
}
