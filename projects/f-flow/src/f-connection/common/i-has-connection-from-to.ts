import { Signal } from "@angular/core";

export interface IHasConnectionFromTo {

  fId: Signal<string>

  fOutputId: string;

  fInputId: string;
}
