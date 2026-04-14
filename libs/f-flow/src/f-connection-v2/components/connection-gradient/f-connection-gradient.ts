import { Component, input } from '@angular/core';
import { F_CONNECTION_GRADIENT, FConnectionGradientBase } from './models';

@Component({
  selector: 'f-connection-gradient',
  template: '',
  standalone: true,
  host: {
    style: 'display: none;',
  },
  providers: [{ provide: F_CONNECTION_GRADIENT, useExisting: FConnectionGradient }],
})
export class FConnectionGradient extends FConnectionGradientBase {
  public override readonly fStartColor = input.required<string>();
  public override readonly fEndColor = input.required<string>();
}
