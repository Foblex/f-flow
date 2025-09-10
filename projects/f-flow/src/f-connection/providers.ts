import {
  FConnectionDragHandleEndComponent, FConnectionDragHandleStartComponent,
  FConnectionGradientComponent, FConnectionPathComponent, FConnectionSelectionComponent,
  FConnectionTextComponent,
  FConnectionTextPathDirective,
} from './common';
import { FConnectionComponent } from './f-connection';
import { FConnectionCenterDirective } from './f-connection-center';
import { FConnectionForCreateComponent } from './f-connection-for-create';
import { FMarkerDirective } from './f-marker';
import { FSnapConnectionComponent } from './f-snap-connection';

export const F_CONNECTION_PROVIDERS = [

  FConnectionTextComponent,
  FConnectionTextPathDirective,
  FConnectionDragHandleStartComponent,
  FConnectionDragHandleEndComponent,
  FConnectionGradientComponent,
  FConnectionPathComponent,
  FConnectionSelectionComponent,

  FConnectionComponent,
  FConnectionCenterDirective,
  FConnectionForCreateComponent,
  FMarkerDirective,
  FSnapConnectionComponent,
];
