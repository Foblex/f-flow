import { IPoint } from '@foblex/core';

export class CalculateConnectionCenterRequest {

    constructor(
        public points: IPoint[],
    ) {
    }
}
