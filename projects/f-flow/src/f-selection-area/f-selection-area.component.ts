import { Component, ElementRef, inject, Input, OnInit } from '@angular/core';
import { FSelectionAreaBase } from './f-selection-area-base';
import { F_BEFORE_MAIN_PLUGIN, IFDragAndDropPlugin } from '../f-draggable';
import { IRect } from '@foblex/2d';
import { FMediator } from '@foblex/mediator';
import { SelectionAreaFinalizeRequest, SelectionAreaPreparationRequest } from './domain';
import { FEventTrigger, FTriggerEvent } from '../domain';
import { IPointerEvent } from "../drag-toolkit";

@Component({
  selector: "f-selection-area",
  template: ``,
  styleUrls: [ './f-selection-area.component.scss' ],
  host: {
    'class': 'f-selection-area f-component',
  },
  providers: [
    { provide: F_BEFORE_MAIN_PLUGIN, useExisting: FSelectionAreaComponent },
  ],
})
export class FSelectionAreaComponent extends FSelectionAreaBase implements OnInit, IFDragAndDropPlugin {

  private _fMediator = inject(FMediator);
  private _elementReference = inject(ElementRef);

  @Input()
  public fTrigger: FEventTrigger = (event: FTriggerEvent) => {
    return event.shiftKey;
  };

  public override get hostElement(): HTMLElement {
    return this._elementReference.nativeElement;
  }

  public ngOnInit(): void {
    this.hostElement.style.display = 'none';
  }

  public override hide(): void {
    this.hostElement.style.display = 'none';
  }

  public override show(): void {
    this.hostElement.style.display = 'block';
  }

  public override draw(object: IRect): void {
    const style = this.hostElement.style;
    style.left = object.x + 'px';
    style.top = object.y + 'px';
    style.width = object.width + 'px';
    style.height = object.height + 'px';
  }

  public onPointerDown(event: IPointerEvent): void {
    this._fMediator.execute(new SelectionAreaPreparationRequest(event, this, this.fTrigger));
  }

  public onPointerUp(event: IPointerEvent): void {
    this._fMediator.execute(new SelectionAreaFinalizeRequest(event));
  }
}
