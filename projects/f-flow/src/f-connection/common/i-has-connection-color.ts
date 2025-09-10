import { Signal } from "@angular/core";

export interface IHasConnectionColor {

  fStartColor: Signal<string>;

  fEndColor: Signal<string>;
}
