import { Component, inject, input, numberAttribute, OnDestroy, OnInit } from '@angular/core';
import { F_MAGNETIC_LINES, FMagneticLinesBase } from './f-magnetic-lines-base';
import { FMediator } from '@foblex/mediator';
import {
  INSTANCES,
  RegisterPluginInstanceRequest,
  RemovePluginInstanceRequest,
} from '../f-storage';

@Component({
  selector: 'f-magnetic-lines',
  template: '',
  styleUrls: ['./f-magnetic-lines.scss'],
  host: {
    'class': 'f-magnetic-lines f-component',
  },
  standalone: true,
  providers: [{ provide: F_MAGNETIC_LINES, useExisting: FMagneticLines }],
})
export class FMagneticLines extends FMagneticLinesBase implements OnInit, OnDestroy {
  public override readonly threshold = input(10, { transform: numberAttribute });

  private readonly _mediator = inject(FMediator);

  public ngOnInit(): void {
    this._mediator.execute(new RegisterPluginInstanceRequest(INSTANCES.MAGNETIC_LINES, this));
  }

  public ngOnDestroy(): void {
    this._mediator.execute(new RemovePluginInstanceRequest(INSTANCES.MAGNETIC_LINES));
  }
}
