import { IPoint } from '@foblex/2d';

export class CalculateConnectionCenterRequest {

    constructor(
        public points: IPoint[],
    ) {
    }
}
