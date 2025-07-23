import {ChangeDetectionStrategy, Component, ViewChild} from '@angular/core';
import {
  F_CONNECTION_BUILDERS,
  FCanvasComponent,
  FFlowModule,
  IFConnectionBuilder,
  IFConnectionBuilderRequest,
  IFConnectionBuilderResponse
} from '@foblex/flow';
import {IPoint, PointExtensions} from '@foblex/2d';

class OffsetStraightBuilder implements IFConnectionBuilder {

  public handle(request: IFConnectionBuilderRequest): IFConnectionBuilderResponse {
    const {source, target} = request;
    const path = `M ${source.x} ${source.y} L ${source.x + 20} ${source.y} L ${target.x - 20} ${target.y} L ${target.x} ${target.y}`;

    return {
      path,
      connectionCenter: {x: 0, y: 0},
      penultimatePoint: PointExtensions.initialize(target.x - 20, target.y),
      secondPoint: PointExtensions.initialize(source.x + 20, source.y)
    };
  }
}

class CircleConnectionBuilder implements IFConnectionBuilder {

  public handle(request: IFConnectionBuilderRequest): IFConnectionBuilderResponse {
    const {source, target} = request;
    const d = this.getD(request);
    const path = `M ${source.x} ${source.y} S${d.x} ${d.y} ${target.x} ${target.y}`;
    return {path, connectionCenter: {x: 0, y: 0}, penultimatePoint: d, secondPoint: d};
  }

  private getD(request: IFConnectionBuilderRequest): IPoint {
    const offset: number = request.offset;
    const cx: number = (request.source.x + request.radius + request.target.x) / 2;
    const cy: number = (request.source.y + request.radius + request.target.y) / 2;
    const dx: number = cx + (offset * (request.source.y - request.target.y)) / Math.sqrt(Math.pow(request.source.x - request.target.x, 2) + Math.pow(request.source.y - request.target.y, 2)) || cx;
    const dy: number = cy - (offset * (request.source.x - request.target.x)) / Math.sqrt(Math.pow(request.source.x - request.target.x, 2) + Math.pow(request.source.y - request.target.y, 2)) || cy;

    return {x: dx, y: dy};
  }
}

const connectionBuilders = {
  ['offset_straight']: new OffsetStraightBuilder(),
  ['circle']: new CircleConnectionBuilder()
};

@Component({
  selector: 'custom-connection-type',
  styleUrls: ['./custom-connection-type.component.scss'],
  templateUrl: './custom-connection-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [
    {provide: F_CONNECTION_BUILDERS, useValue: connectionBuilders}
  ],
  imports: [
    FFlowModule
  ]
})
export class CustomConnectionTypeComponent {

  @ViewChild(FCanvasComponent, {static: true})
  public fCanvas!: FCanvasComponent;

  public onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }
}
