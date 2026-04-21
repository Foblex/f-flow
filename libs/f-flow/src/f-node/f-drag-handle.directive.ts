import {
  Directive,
} from "@angular/core";

@Directive({
  standalone: false,
  selector: "[fDragHandle]",
  host: {
    class: "f-drag-handle f-component",
  },
})
export class FDragHandleDirective {}
