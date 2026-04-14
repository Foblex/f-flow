import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { F_MAGNETIC_RECTS, FMagneticRectsBase } from './f-magnetic-rects-base';
import { FMediator } from '@foblex/mediator';
import {
  INSTANCES,
  RegisterPluginInstanceRequest,
  RemovePluginInstanceRequest,
} from '../f-storage';

@Component({
  selector: 'f-magnetic-rects',
  template: '',
  styleUrls: ['./f-magnetic-rects.scss'],
  host: {
    'class': 'f-magnetic-rects f-component',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [{ provide: F_MAGNETIC_RECTS, useExisting: FMagneticRects }],
})
export class FMagneticRects extends FMagneticRectsBase implements OnInit, OnDestroy {
  public override readonly alignThreshold = input(100, {
    transform: numberAttribute,
  });

  public override readonly spacingThreshold = input(100, {
    transform: numberAttribute,
  });

  private readonly _mediator = inject(FMediator);

  public ngOnInit(): void {
    this._mediator.execute(new RegisterPluginInstanceRequest(INSTANCES.MAGNETIC_RECTS, this));
  }

  public ngOnDestroy(): void {
    this._mediator.execute(new RemovePluginInstanceRequest(INSTANCES.MAGNETIC_RECTS));
  }
}
