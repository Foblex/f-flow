import {
  FConnectionDragHandleEndComponent,
  FConnectionDragHandleStartComponent,
  FConnectionGradientComponent,
  FConnectionPathComponent,
  FConnectionSelectionComponent,
} from './common';
import { FConnectionComponent } from './f-connection';
import { FConnectionForCreateComponent } from './f-connection-for-create';
import { FMarkerDirective } from './f-marker';
import { FSnapConnectionComponent } from './f-snap-connection';
import { FConnectionContent } from './f-connection-content';

export const F_CONNECTION_PROVIDERS = [
  FConnectionDragHandleStartComponent,
  FConnectionDragHandleEndComponent,
  FConnectionGradientComponent,
  FConnectionPathComponent,
  FConnectionSelectionComponent,

  FConnectionComponent,
  FConnectionForCreateComponent,
  FMarkerDirective,
  FSnapConnectionComponent,
];

export const F_CONNECTION_IMPORTS_EXPORTS = [FConnectionContent];
