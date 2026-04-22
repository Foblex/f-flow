import {
  ActivateTocByHash,
  CalculateAbsoluteTopToContainer,
  CalculateHashFromScrollPosition,
  CalculateTableOfContent,
  ScrollToElementInContainer,
} from './features';

export const TABLE_OF_CONTENT_MODULE_PROVIDERS = [
  ActivateTocByHash,
  CalculateTableOfContent,
  ScrollToElementInContainer,
  CalculateAbsoluteTopToContainer,
  CalculateHashFromScrollPosition,
];
