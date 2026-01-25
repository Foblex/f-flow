import { FConnectionComponent } from './f-connection';
import { FConnectionForCreateComponent } from './f-connection-for-create';
import { FSnapConnectionComponent } from './f-snap-connection';
import {
  FConnectionContent,
  FConnectionWaypoints,
  FConnectionDragHandleEnd,
  FConnectionDragHandleStart,
  FConnectionGradient,
  FConnectionMarker,
  FConnectionPath,
  FConnectionSelection,
} from '../f-connection-v2';

export const F_CONNECTION_PROVIDERS = [
  FConnectionDragHandleStart,
  FConnectionDragHandleEnd,
  FConnectionGradient,
  FConnectionPath,
  FConnectionSelection,
  FConnectionMarker,

  FConnectionComponent,
  FConnectionForCreateComponent,
  FSnapConnectionComponent,
];

export const F_CONNECTION_IMPORTS_EXPORTS = [FConnectionContent, FConnectionWaypoints];
