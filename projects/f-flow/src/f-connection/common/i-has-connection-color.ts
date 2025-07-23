import {InputSignal} from "@angular/core";

export interface IHasConnectionColor {

  fStartColor: InputSignal<string>;

  fEndColor: InputSignal<string>;
}
