import {
  booleanAttribute,
  Component,
  inject,
  numberAttribute,
  OnDestroy,
  OnInit,
  input,
} from '@angular/core';
import { FMediator } from '@foblex/mediator';
import { FAutoPanBase } from './f-auto-pan-base';
import {
  INSTANCES,
  RegisterPluginInstanceRequest,
  RemovePluginInstanceRequest,
} from '../f-storage';

@Component({
  selector: 'f-auto-pan',
  template: ``,
  standalone: true,
  host: {
    class: 'f-auto-pan f-component',
    style: 'display: none;',
  },
})
export class FAutoPan extends FAutoPanBase implements OnInit, OnDestroy {
  private readonly _mediator = inject(FMediator);

  public override fEdgeThreshold = input(20, {
    transform: (value: unknown) => numberAttribute(value, 20),
  });

  public override fSpeed = input(8, {
    transform: (value: unknown) => numberAttribute(value, 8),
  });

  public override fAcceleration = input(false, {
    transform: (value: unknown) => booleanAttribute(value),
  });

  public ngOnInit(): void {
    this._mediator.execute(new RegisterPluginInstanceRequest(INSTANCES.AUTO_PAN, this));
  }

  public ngOnDestroy(): void {
    this._mediator.execute(new RemovePluginInstanceRequest(INSTANCES.AUTO_PAN));
  }
}
