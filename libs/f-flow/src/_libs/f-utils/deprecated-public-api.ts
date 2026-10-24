/**
 * Deprecated public re-exports of the vendored utils.
 *
 * The helpers are internal infrastructure of `@foblex/flow`. These aliases exist only so
 * applications migrated from the standalone `@foblex/utils` package keep compiling. They
 * are general-purpose helpers, not flow APIs, and will be removed from the public API in
 * v20 — applications that still need one should depend on `@foblex/utils` from npm
 * directly (the package stays published).
 *
 * The library's own code imports from the sibling modules directly, so nothing internal
 * is marked deprecated by this file.
 */
import { flatMap as _flatMap } from './array';
import {
  deepCloneNode as _deepCloneNode,
  disableDragInteractions as _disableDragInteractions,
  extendStyles as _extendStyles,
  getDataAttrValueFromClosestElementWithClass as _getDataAttrValueFromClosestElementWithClass,
  getOrCreateRootNodeForViewRef as _getOrCreateRootNodeForViewRef,
  isClosestElementHasClass as _isClosestElementHasClass,
  normalizeDomElementId as _normalizeDomElementId,
} from './dom';
import {
  MouseEventExtensions as _MouseEventExtensions,
  IFakeMouseEvent as _IFakeMouseEvent,
} from './event';
import { generateGuid as _generateGuid } from './guid';
import { deepClone as _deepClone } from './object';
import {
  BooleanInput as _BooleanInput,
  castToBoolean as _castToBoolean,
  castToEnum as _castToEnum,
  castToNumber as _castToNumber,
  NumberInput as _NumberInput,
  isNumber as _isNumber,
} from './type-casting';

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20. Depend on
 * `@foblex/utils` directly if you still need this helper.
 */
export const flatMap: typeof _flatMap = _flatMap;

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20. Depend on
 * `@foblex/utils` directly if you still need this helper.
 */
export const deepCloneNode: typeof _deepCloneNode = _deepCloneNode;

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20. Depend on
 * `@foblex/utils` directly if you still need this helper.
 */
export const disableDragInteractions: typeof _disableDragInteractions = _disableDragInteractions;

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20. Depend on
 * `@foblex/utils` directly if you still need this helper.
 */
export const extendStyles: typeof _extendStyles = _extendStyles;

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20. Depend on
 * `@foblex/utils` directly if you still need this helper.
 */
export const getDataAttrValueFromClosestElementWithClass: typeof _getDataAttrValueFromClosestElementWithClass =
  _getDataAttrValueFromClosestElementWithClass;

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20. Depend on
 * `@foblex/utils` directly if you still need this helper.
 */
export const getOrCreateRootNodeForViewRef: typeof _getOrCreateRootNodeForViewRef =
  _getOrCreateRootNodeForViewRef;

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20. Depend on
 * `@foblex/utils` directly if you still need this helper.
 */
export const isClosestElementHasClass: typeof _isClosestElementHasClass = _isClosestElementHasClass;

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20. Depend on
 * `@foblex/utils` directly if you still need this helper.
 */
export const normalizeDomElementId: typeof _normalizeDomElementId = _normalizeDomElementId;

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20. Depend on
 * `@foblex/utils` directly if you still need this helper.
 */
export const MouseEventExtensions: typeof _MouseEventExtensions = _MouseEventExtensions;
/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20.
 */
export type MouseEventExtensions = _MouseEventExtensions;

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20.
 */
export type IFakeMouseEvent = _IFakeMouseEvent;

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20. Depend on
 * `@foblex/utils` directly if you still need this helper.
 */
export const generateGuid: typeof _generateGuid = _generateGuid;

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20. Depend on
 * `@foblex/utils` directly if you still need this helper.
 */
export const deepClone: typeof _deepClone = _deepClone;

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20.
 */
export type BooleanInput = _BooleanInput;

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20. Depend on
 * `@foblex/utils` directly if you still need this helper.
 */
export const castToBoolean: typeof _castToBoolean = _castToBoolean;

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20. Depend on
 * `@foblex/utils` directly if you still need this helper.
 */
export const castToEnum: typeof _castToEnum = _castToEnum;

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20. Depend on
 * `@foblex/utils` directly if you still need this helper.
 */
export const castToNumber: typeof _castToNumber = _castToNumber;

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20.
 */
export type NumberInput = _NumberInput;

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20. Depend on
 * `@foblex/utils` directly if you still need this helper.
 */
export const isNumber: typeof _isNumber = _isNumber;
