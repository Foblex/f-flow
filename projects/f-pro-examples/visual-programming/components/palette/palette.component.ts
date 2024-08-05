import {
  ChangeDetectionStrategy, Component,
} from '@angular/core';
import { FFlowModule } from '@foblex/flow';
import { ENodeType } from '../../domain/e-node-type';
import { NODE_CONFIGURATION } from '../../domain/configuration';

@Component({
  selector: 'visual-programming-palette',
  templateUrl: './palette.component.html',
  styleUrls: [ './palette.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FFlowModule,
  ]
})
export class PaletteComponent {

  protected palette = Object.keys(NODE_CONFIGURATION).map((key) => {
    return {
      type: key,
      color: NODE_CONFIGURATION[ key as ENodeType ].color,
      text: NODE_CONFIGURATION[ key as ENodeType ].text,
    }
  });
}
