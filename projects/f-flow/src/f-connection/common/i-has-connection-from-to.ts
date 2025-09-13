import { Signal } from '@angular/core';

export interface IHasConnectionFromTo {
  fId: Signal<string>;

  fOutputId: Signal<string>;

  fInputId: Signal<string>;
}
