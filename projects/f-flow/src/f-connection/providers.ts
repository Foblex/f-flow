import {
  FConnectionDragHandleComponent,
  FConnectionGradientComponent, FConnectionPathComponent, FConnectionSelectionComponent,
  FConnectionTextComponent,
  FConnectionTextPathDirective
} from './common';
import { FConnectionComponent } from './f-connection';
import { FConnectionCenterDirective } from './f-connection-center';
import { FConnectionForCreateComponent } from './f-connection-for-create';
import { FMarkerDirective } from './f-marker';

export const F_CONNECTION_PROVIDERS = [

  FConnectionTextComponent,
  FConnectionTextPathDirective,
  FConnectionDragHandleComponent,
  FConnectionGradientComponent,
  FConnectionPathComponent,
  FConnectionSelectionComponent,

  FConnectionComponent,
  FConnectionCenterDirective,
  FConnectionForCreateComponent,
  FMarkerDirective
];
