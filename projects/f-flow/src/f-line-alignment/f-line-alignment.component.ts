import {
  Component,
  ElementRef,
  inject,
  input,
  numberAttribute,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { F_LINE_ALIGNMENT, FLineAlignmentBase } from './f-line-alignment-base';
import { FMediator } from '@foblex/mediator';
import {
  INSTANCES,
  RegisterPluginInstanceRequest,
  RemovePluginInstanceRequest,
} from '../f-storage';

@Component({
  selector: 'f-line-alignment',
  template: '',
  styleUrls: ['./f-line-alignment.component.scss'],
  exportAs: 'fComponent',
  host: {
    'class': 'f-line-alignment f-component',
  },
  providers: [{ provide: F_LINE_ALIGNMENT, useExisting: FLineAlignmentComponent }],
})
export class FLineAlignmentComponent extends FLineAlignmentBase implements OnInit, OnDestroy {
  public override readonly fAlignThreshold = input(10, { transform: numberAttribute });

  private readonly _mediator = inject(FMediator);

  public ngOnInit(): void {
    this._mediator.execute(new RegisterPluginInstanceRequest(INSTANCES.MAGNETIC_LINES, this));
  }

  public ngOnDestroy(): void {
    this._mediator.execute(new RemovePluginInstanceRequest(INSTANCES.MAGNETIC_LINES));
  }
}
