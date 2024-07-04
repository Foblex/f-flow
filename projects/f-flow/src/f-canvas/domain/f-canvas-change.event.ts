import { IPoint } from '@foblex/core';

export class FCanvasChangeEvent {
    constructor(
        public readonly position: IPoint,
        public readonly scale: number,
    ) {
    }
}
