import {
  Directive,
} from "@angular/core";

@Directive({
  selector: "[fDragBlocker]",
  host: {
    class: `f-drag-blocker`,
  },
})
export class FDragBlockerDirective {}

