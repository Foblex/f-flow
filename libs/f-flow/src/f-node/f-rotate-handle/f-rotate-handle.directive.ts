import {
  Directive,
} from "@angular/core";

@Directive({
  standalone: false,
  selector: "[fRotateHandle]",
  host: {
    class: `f-rotate-handle f-component`,
  },
})
export class FRotateHandleDirective {}
