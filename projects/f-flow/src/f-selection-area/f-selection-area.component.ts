import { Component, ElementRef, OnInit } from '@angular/core';
import { F_SELECTION_AREA, FSelectionAreaBase } from './f-selection-area-base';
import { ISelectionAreaRect } from './domain';
import { FDraggableDataContext } from '../f-draggable';

@Component({
  selector: "f-selection-area",
  template: ``,
  styleUrls: [ './f-selection-area.component.scss' ],
  host: {
    'class': 'f-selection-area f-component'
  },
  providers: [
    { provide: F_SELECTION_AREA, useExisting: FSelectionAreaComponent }
  ],
})
export class FSelectionAreaComponent extends FSelectionAreaBase implements OnInit {

  public override get hostElement(): HTMLElement {
    return this.elementReference.nativeElement;
  }

  constructor(
      private elementReference: ElementRef<HTMLElement>,
      private fDraggableDataContext: FDraggableDataContext
  ) {
    super();
  }

  public ngOnInit(): void {
    this.fDraggableDataContext.fSelectionArea = this;
    this.hostElement.style.display = 'none';
  }

  public override hide(): void {
    this.hostElement.style.display = 'none';
  }

  public override show(): void {
    this.hostElement.style.display = 'block';
  }

  public override draw(object: ISelectionAreaRect): void {
    const style = this.hostElement.style;
    style.left = object.left + 'px';
    style.top = object.top + 'px';
    style.width = object.width + 'px';
    style.height = object.height + 'px';
  }
}
