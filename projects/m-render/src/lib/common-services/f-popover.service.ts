import { DestroyRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class FPopoverService {

  private popover = new BehaviorSubject<string | null>(null);

  public get popover$(): Observable<string | null> {
    return this.popover.asObservable();
  }

  public show(message: string): void {
    this.popover.next(message);
    setTimeout(() => this.popover.next(null), 2000);
  }

  public dispose(destroyRef: DestroyRef): void {
    destroyRef.onDestroy(() => {
      this.popover.next(null);
      this.popover.complete();
    });
  }
}
