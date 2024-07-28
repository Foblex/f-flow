import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  F_CONNECTION_BUILDERS,
  FFlowModule,
  IFConnectionBuilder,
  IFConnectionBuilderRequest,
  IFConnectionBuilderResponse
} from '@foblex/flow';


class OffsetStraightBuilder implements IFConnectionBuilder {

  public handle(request: IFConnectionBuilderRequest): IFConnectionBuilderResponse {
    const { source, target } = request;
    const path = `M ${ source.x } ${ source.y } L ${ source.x + 20 } ${ source.y } L ${ target.x - 20 } ${ target.y } L ${ target.x } ${ target.y }`;

    return { path, connectionCenter: { x: 0, y: 0 } };
  }
}

const connectionBuilders = {
  [ 'offset_straight' ]: new OffsetStraightBuilder()
};


@Component({
  selector: 'provide-connection-type',
  styleUrls: [ './provide-connection-type.component.scss' ],
  templateUrl: './provide-connection-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [
    { provide: F_CONNECTION_BUILDERS, useValue: connectionBuilders }
  ],
  imports: [
    FFlowModule
  ]
})
export class ProvideConnectionTypeComponent {

}
