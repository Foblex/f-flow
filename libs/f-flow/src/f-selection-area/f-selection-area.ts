import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FSelectionAreaBase } from './f-selection-area-base';
import { FMediator } from '@foblex/mediator';
import { FEventTrigger } from '../domain';
import {
  INSTANCES,
  RegisterPluginInstanceRequest,
  RemovePluginInstanceRequest,
} from '../f-storage';
import {
  F_DEFAULT_CONTROL_SCHEME,
  FControlSchemeController,
} from '../plugins/interaction/f-control-scheme';

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
  private readonly _controlScheme = inject(FControlSchemeController, { optional: true });

  private _trigger: FEventTrigger | undefined;

  /**
   * Overrides when the selection rectangle activates. Defaults to the active control
   * scheme's `selection` gesture — see `withControlScheme(...)`.
   */
  @Input()
  public set fTrigger(value: FEventTrigger) {
    this._trigger = value;
  }

  public get fTrigger(): FEventTrigger {
    return this._trigger ?? (this._controlScheme?.scheme() ?? F_DEFAULT_CONTROL_SCHEME).selection;
  }

  public ngOnInit(): void {
    this._mediator.execute(new RegisterPluginInstanceRequest(INSTANCES.SELECTION_AREA, this));
    super.initialize();
  }

  public ngOnDestroy(): void {
    this._mediator.execute(new RemovePluginInstanceRequest(INSTANCES.SELECTION_AREA));
  }
}
