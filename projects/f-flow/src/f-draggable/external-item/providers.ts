import { EXTERNAL_ITEM_PREPARATION_PROVIDERS } from './external-item-preparation';
import { EXTERNAL_ITEM_FINALIZE_PROVIDERS } from './external-item-finalize';

export const EXTERNAL_ITEM_PROVIDERS = [

  ...EXTERNAL_ITEM_FINALIZE_PROVIDERS,

  ...EXTERNAL_ITEM_PREPARATION_PROVIDERS,
];
