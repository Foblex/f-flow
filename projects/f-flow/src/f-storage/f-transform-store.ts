import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class FTransformStore {

  public readonly changes: Subject<void> = new Subject<void>();
}
