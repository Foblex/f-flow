import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import { FCanvasComponent, FCreateConnectionEvent, FFlowModule } from '@foblex/flow';
import { FCheckboxComponent, FToolbarComponent } from '@foblex/m-render';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'connector-outlet',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FCheckboxComponent, MatIcon, FToolbarComponent],
})
export class Example {
  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  public connections: { from: string; to: string }[] = [];

  public isConnectionFromOutlet: boolean = false;

  private readonly _changeDetectorRef = inject(ChangeDetectorRef);

  public onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }

  public onCreateConnection(event: FCreateConnectionEvent): void {
    if (!event.fInputId) {
      return;
    }
    this.connections.push({ from: event.fOutputId, to: event.fInputId });
  }

  public onDeleteConnections(): void {
    this.connections = [];
    this._changeDetectorRef.detectChanges();
  }

  public onConnectionFromOutletChange(checked: boolean): void {
    this.isConnectionFromOutlet = checked;
  }
}
