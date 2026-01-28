import { Component, inject, input, numberAttribute, OnDestroy, OnInit } from '@angular/core';
import { FMediator } from '@foblex/mediator';
import { F_MAGNETIC_LINES, FMagneticLinesBase } from './domain';
import { AddMagneticToStoreRequest, RemoveMagneticFromStoreRequest } from '../../domain';

@Component({
  selector: 'f-magnetic-lines',
  template: '',
  styleUrls: ['./f-magnetic-lines.scss'],
  standalone: true,
  host: {
    'class': 'f-magnetic-lines f-component',
  },
  providers: [{ provide: F_MAGNETIC_LINES, useExisting: FMagneticLines }],
})
export class FMagneticLines extends FMagneticLinesBase implements OnInit, OnDestroy {
  public override readonly threshold = input(10, { transform: numberAttribute });

  private readonly _mediator = inject(FMediator);

  public ngOnInit(): void {
    this._mediator.execute(new AddMagneticToStoreRequest(this, F_MAGNETIC_LINES.toString()));
  }

  public ngOnDestroy(): void {
    this._mediator.execute(new RemoveMagneticFromStoreRequest(F_MAGNETIC_LINES.toString()));
  }
}
