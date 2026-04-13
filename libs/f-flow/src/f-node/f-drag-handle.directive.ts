import {
  Directive,
} from "@angular/core";

@Directive({
  selector: "[fDragHandle]",
  host: {
    class: "f-drag-handle f-component",
  },
})
export class FDragHandleDirective {}
