import {
  Directive,
} from "@angular/core";

@Directive({
  standalone: false,
  selector: "[fDragBlocker]",
  host: {
    class: `f-drag-blocker`,
  },
})
export class FDragBlockerDirective {}

