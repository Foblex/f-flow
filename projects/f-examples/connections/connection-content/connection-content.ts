import { ChangeDetectionStrategy, Component, model, signal, viewChild } from '@angular/core';
import {
  PolylineContentAlign,
  FCanvasComponent,
  FConnectionContent,
  FFlowModule,
} from '@foblex/flow';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { KeyValue } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExampleSelect, ExampleToolbar } from '@portal-ui';

@Component({
  selector: 'connection-content',
  styleUrls: ['./connection-content.scss'],
  templateUrl: './connection-content.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    FConnectionContent,
    FormsModule,
    ExampleToolbar,
    ExampleSelect,
  ],
})
export class ConnectionContent {
  protected readonly positions: KeyValue<number, string>[] = [
    { key: 0.1, value: '10%' },
    { key: 0.25, value: '25%' },
    { key: 0.3, value: '30%' },
    { key: 0.5, value: '50%' },
    { key: 0.75, value: '75%' },
    { key: 1, value: '100%' },
  ];
  protected readonly position = model<number>(0.5);

  protected readonly aligns: KeyValue<PolylineContentAlign, string>[] = [
    { key: PolylineContentAlign.NONE, value: 'None' },
    { key: PolylineContentAlign.ALONG, value: 'Along' },
  ];
  protected readonly align = model<PolylineContentAlign>(PolylineContentAlign.NONE);

  protected readonly offsets: KeyValue<number, string>[] = [
    { key: 0, value: '0px' },
    { key: -25, value: '-25px' },
    { key: 25, value: '25px' },
    { key: -50, value: '-50px' },
    { key: 50, value: '50px' },
  ];
  protected readonly offset = signal(0);

  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }
}
