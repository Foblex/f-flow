import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FSelectionAreaBase } from './f-selection-area-base';
import { FMediator } from '@foblex/mediator';
import { FEventTrigger, FTriggerEvent } from '../domain';
import {
  INSTANCES,
  RegisterPluginInstanceRequest,
  RemovePluginInstanceRequest,
} from '../f-storage';

@Component({
  selector: 'f-selection-area',
  template: ``,
  styleUrls: ['./f-selection-area.scss'],
  standalone: true,
  host: {
    'class': 'f-selection-area f-component',
  },
})
export class FSelectionArea extends FSelectionAreaBase implements OnInit, OnDestroy {
  private readonly _mediator = inject(FMediator);

  @Input()
  public fTrigger: FEventTrigger = (event: FTriggerEvent) => {
    return event.shiftKey;
  };

  public ngOnInit(): void {
    this._mediator.execute(new RegisterPluginInstanceRequest(INSTANCES.SELECTION_AREA, this));
    super.initialize();
  }

  public ngOnDestroy(): void {
    this._mediator.execute(new RemovePluginInstanceRequest(INSTANCES.ZOOM));
  }
}
