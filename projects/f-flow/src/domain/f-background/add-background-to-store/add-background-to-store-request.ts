import { FBackgroundBase } from '../../../f-backgroud';

export class AddBackgroundToStoreRequest {
    static readonly fToken = Symbol('AddBackgroundToStoreRequest');

    constructor(
        public fBackground: FBackgroundBase,
    ) {
    }
}
