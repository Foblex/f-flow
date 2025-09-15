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
  ],
})
export class ConnectionContent {
  protected readonly positions: KeyValue<string, number>[] = [
    { key: '10%', value: 0.1 },
    { key: '25%', value: 0.25 },
    { key: '30%', value: 0.3 },
    { key: '50%', value: 0.5 },
    { key: '75%', value: 0.75 },
    { key: '100%', value: 1 },
  ];
  protected readonly position = model<number>(0.5);

  protected readonly aligns: KeyValue<string, PolylineContentAlign>[] = [
    { key: 'None', value: PolylineContentAlign.NONE },
    { key: 'Along', value: PolylineContentAlign.ALONG },
  ];
  protected readonly align = model<PolylineContentAlign>(PolylineContentAlign.NONE);

  protected readonly offsets: KeyValue<string, number>[] = [
    { key: '0px', value: 0 },
    { key: '-25px', value: -25 },
    { key: '25px', value: 25 },
    { key: '-50px', value: -50 },
    { key: '50px', value: 50 },
  ];
  protected readonly offset = signal(0);

  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }
}
