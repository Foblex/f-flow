import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'background-example',
  styleUrls: ['./background-example.component.scss'],
  templateUrl: './background-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, MatFormField, MatLabel, MatOption, MatSelectModule],
})
export class BackgroundExampleComponent {
  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  public background = 'circle';

  public backgroundOptions = ['circle', 'rect', 'none'];

  public onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }
}
