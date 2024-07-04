import { Observable } from 'rxjs';

export interface IHasStateChanges {

  stateChanges: Observable<void>;
}
