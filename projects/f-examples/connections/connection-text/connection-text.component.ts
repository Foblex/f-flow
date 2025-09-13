import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'connection-text',
  styleUrls: ['./connection-text.component.scss'],
  templateUrl: './connection-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, MatFormField, MatLabel, MatOption, MatSelect],
})
export class ConnectionTextComponent {
  protected offsetOptions: string[] = ['10', '25%', '30', '50%', '75', '100%'];

  protected fTextStartOffset: string = '50%';

  @ViewChild(FCanvasComponent, { static: true })
  protected fCanvas!: FCanvasComponent;

  protected onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }
}
