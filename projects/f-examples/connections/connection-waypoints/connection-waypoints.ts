import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FCanvasComponent, FConnectionWaypointsChangedEvent, FFlowModule } from '@foblex/flow';
import { FCheckboxComponent } from '@foblex/m-render';

@Component({
  selector: 'connection-waypoints',
  styleUrls: ['./connection-waypoints.scss'],
  templateUrl: './connection-waypoints.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FCheckboxComponent],
})
export class ConnectionWaypoints {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected waypointsStraight = [
    { x: 50, y: 60 },
    { x: 100, y: 0 },
    { x: 150, y: 30 },
  ];
  protected waypointsSegment = [
    { x: 120, y: 100 },
    { x: 300, y: 150 },
  ];
  protected waypointsBezier = [
    { x: 50, y: 350 },
    { x: 100, y: 400 },
    { x: 150, y: 350 },
  ];
  protected waypointsAdaptiveCurve = [
    { x: 50, y: 450 },
    { x: 100, y: 500 },
    { x: 150, y: 550 },
    { x: 200, y: 500 },
  ];

  protected readonly waypointsVisibility = signal(true);
  protected readonly waypointsOn = signal(true);

  protected loaded(): void {
    this._canvas()?.fitToScreen({ x: 100, y: 100 }, false);
  }

  protected changed({ connectionId, waypoints }: FConnectionWaypointsChangedEvent): void {
    console.log('Connection waypoints changed', connectionId, waypoints);
  }

  protected toggleWaypointsVisibility(): void {
    this.waypointsVisibility.update((x) => !x);
  }

  protected toggleWaypointsOn(): void {
    this.waypointsOn.update((x) => !x);
  }
}
