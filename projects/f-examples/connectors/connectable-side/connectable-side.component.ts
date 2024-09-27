import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { EFConnectableSide, FCanvasComponent, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'connectable-side',
  styleUrls: [ './connectable-side.component.scss' ],
  templateUrl: './connectable-side.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class ConnectableSideComponent {

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  public connections: { from: string, to: string }[] = [];

  public outputSide: EFConnectableSide = EFConnectableSide.RIGHT;
  public inputSide: EFConnectableSide = EFConnectableSide.TOP;

  public onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }

  public onSwitchSides(): void {
    const array = Object.values(EFConnectableSide);
    const autoIndex = array.indexOf(EFConnectableSide.AUTO);
    array.splice(autoIndex, 1);
    const outputIndex = array.indexOf(this.outputSide);
    const inputIndex = array.indexOf(this.inputSide);
    this.outputSide = array[(outputIndex + 1) % array.length];
    this.inputSide = array[(inputIndex + 1) % array.length];
  }
}
