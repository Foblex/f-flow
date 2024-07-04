import { NODE_RESIZE_FINALIZE_PROVIDERS } from './node-resize-finalize';
import { NODE_RESIZE_PREPARATION_PROVIDERS } from './node-resize-preparation';

export const NODE_RESIZE_PROVIDERS = [

    ...NODE_RESIZE_FINALIZE_PROVIDERS,

    ...NODE_RESIZE_PREPARATION_PROVIDERS,
];
