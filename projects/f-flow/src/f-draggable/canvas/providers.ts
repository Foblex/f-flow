import { CANVAS_MOVE_PREPARATION_PROVIDERS } from './canvas-move-preparation';
import { CANVAS_MOVE_FINALIZE_PROVIDERS } from './canvas-move-finalize';

export const CANVAS_PROVIDERS = [

  ...CANVAS_MOVE_FINALIZE_PROVIDERS,

  ...CANVAS_MOVE_PREPARATION_PROVIDERS,
];
