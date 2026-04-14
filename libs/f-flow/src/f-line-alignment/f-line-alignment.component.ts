import { Component, inject, input, numberAttribute, OnDestroy, OnInit } from '@angular/core';
import { FMediator } from '@foblex/mediator';
import {
  INSTANCES,
  RegisterPluginInstanceRequest,
  RemovePluginInstanceRequest,
} from '../f-storage';
import { F_MAGNETIC_LINES, FMagneticLinesBase } from '../f-magnetic-lines';

/**
 * @deprecated Use `f-magnetic-lines` instead.
 * Will be removed in v19.0.0.
 */
@Component({
  selector: 'f-line-alignment',
  template: '',
  styleUrls: ['./f-line-alignment.component.scss'],
  exportAs: 'fComponent',
  host: {
    'class': 'f-line-alignment f-component',
  },
  providers: [{ provide: F_MAGNETIC_LINES, useExisting: FLineAlignmentComponent }],
})
export class FLineAlignmentComponent extends FMagneticLinesBase implements OnInit, OnDestroy {
  public override readonly threshold = input(10, {
    transform: numberAttribute,
    alias: 'fAlignThreshold',
  });

  private readonly _mediator = inject(FMediator);

  public ngOnInit(): void {
    this._mediator.execute(new RegisterPluginInstanceRequest(INSTANCES.MAGNETIC_LINES, this));
  }

  public ngOnDestroy(): void {
    this._mediator.execute(new RemovePluginInstanceRequest(INSTANCES.MAGNETIC_LINES));
  }
}
