import { FConnectionComponent } from './f-connection';
import { FConnectionForCreateComponent } from './f-connection-for-create';
import { FSnapConnectionComponent } from './f-snap-connection';
import {
  FConnectionContent,
  FConnectionMarkerArrow,
  FConnectionMarkerCircle,
  FConnectionDragHandleEnd,
  FConnectionDragHandleStart,
  FConnectionGradient,
  FConnectionGradientRenderer,
  FConnectionMarker,
  FConnectionPath,
  FConnectionSelection,
  FConnectionWaypoints,
} from '../f-connection-v2';

export const F_CONNECTION_PROVIDERS = [
  FConnectionDragHandleStart,
  FConnectionDragHandleEnd,
  FConnectionPath,
  FConnectionSelection,
  FConnectionMarker,

  FConnectionComponent,
  FConnectionForCreateComponent,
  FSnapConnectionComponent,
];

export const F_CONNECTION_IMPORTS_EXPORTS = [
  FConnectionContent,
  FConnectionMarkerCircle,
  FConnectionMarkerArrow,
  FConnectionGradient,
  FConnectionGradientRenderer,
  FConnectionWaypoints,
];
