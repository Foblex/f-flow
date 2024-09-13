import { IPoint } from '@foblex/2d';

export class CalculateCenterBetweenPointsRequest {

    constructor(
        public source: IPoint,
        public target: IPoint,
    ) {
    }
}
