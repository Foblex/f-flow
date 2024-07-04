import { IPoint } from '@foblex/core';

export class CalculateCenterBetweenPointsRequest {

    constructor(
        public source: IPoint,
        public target: IPoint,
    ) {
    }
}
