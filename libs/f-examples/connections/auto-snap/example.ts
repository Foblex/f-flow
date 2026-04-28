import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import {
  FCanvasComponent,
  FCreateConnectionEvent,
  FFlowModule,
  FZoomDirective,
} from '@foblex/flow';
import { FToolbarComponent } from '@foblex/m-render';

@Component({
  selector: 'auto-snap',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FZoomDirective, FToolbarComponent],
})
export class Example {
  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  public connections: { outputId: string; inputId: string }[] = [];

  private readonly _changeDetectorRef = inject(ChangeDetectorRef);

  public addConnection(event: FCreateConnectionEvent): void {
    if (!event.fInputId) {
      return;
    }
    this.connections.push({ outputId: event.fOutputId, inputId: event.fInputId });
    this._changeDetectorRef.detectChanges();
  }

  public onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }

  public onDeleteConnections(): void {
    this.connections = [];
    this._changeDetectorRef.detectChanges();
  }
}
