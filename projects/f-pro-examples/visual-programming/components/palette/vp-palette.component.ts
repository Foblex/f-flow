import {
  ChangeDetectionStrategy, Component,
} from '@angular/core';
import { FFlowModule } from '@foblex/flow';
import { ENodeType } from '../../domain';
import { NODE_CONFIGURATION } from '../../domain';

@Component({
  selector: 'vp-palette',
  templateUrl: './vp-palette.component.html',
  styleUrls: [ './vp-palette.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FFlowModule,
  ]
})
export class VpPaletteComponent {

  protected palette = Object.keys(NODE_CONFIGURATION).map((key) => {
    return {
      type: key,
      color: NODE_CONFIGURATION[ key as ENodeType ].color,
      text: NODE_CONFIGURATION[ key as ENodeType ].text,
    }
  });
}
