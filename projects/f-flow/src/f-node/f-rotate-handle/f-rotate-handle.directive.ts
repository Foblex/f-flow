import {
  Directive,
} from "@angular/core";

@Directive({
  selector: "[fRotateHandle]",
  host: {
    class: `f-rotate-handle f-component`,
  },
})
export class FRotateHandleDirective {}
