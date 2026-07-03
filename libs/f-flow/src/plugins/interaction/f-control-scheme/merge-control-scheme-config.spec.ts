import { mergeControlSchemeConfig } from './merge-control-scheme-config';
import {
  F_DEFAULT_CONTROL_SCHEME,
  F_DRAG_SELECT_CONTROL_SCHEME,
  F_SCROLL_PAN_CONTROL_SCHEME,
} from './constants';

describe('mergeControlSchemeConfig', () => {
  it('should resolve to the default scheme when no config is given', () => {
    expect(mergeControlSchemeConfig(undefined)).toEqual(F_DEFAULT_CONTROL_SCHEME);
  });

  it('should fill missing gestures from the default scheme', () => {
    const scheme = mergeControlSchemeConfig({ scrollPan: true });

    expect(scheme.scrollPan).toBeTrue();
    expect(scheme.nodeMove).toBe(F_DEFAULT_CONTROL_SCHEME.nodeMove);
    expect(scheme.canvasMove).toBe(F_DEFAULT_CONTROL_SCHEME.canvasMove);
    expect(scheme.selection).toBe(F_DEFAULT_CONTROL_SCHEME.selection);
  });

  it('should keep a full preset unchanged', () => {
    expect(mergeControlSchemeConfig(F_SCROLL_PAN_CONTROL_SCHEME)).toEqual(
      F_SCROLL_PAN_CONTROL_SCHEME,
    );
  });

  it('should route the wheel to pan only in the scroll-pan preset', () => {
    expect(F_DEFAULT_CONTROL_SCHEME.scrollPan).toBeFalse();
    expect(F_SCROLL_PAN_CONTROL_SCHEME.scrollPan).toBeTrue();
    expect(F_DRAG_SELECT_CONTROL_SCHEME.scrollPan).toBeFalse();
  });

  it('should keep the middle button inert in the default scheme and claim it in the others', () => {
    const middleDown = new MouseEvent('mousedown', { button: 1, buttons: 4 });

    expect(F_DEFAULT_CONTROL_SCHEME.canvasMove(middleDown)).toBeFalse();
    expect(F_SCROLL_PAN_CONTROL_SCHEME.canvasMove(middleDown)).toBeTrue();
    expect(F_DRAG_SELECT_CONTROL_SCHEME.canvasMove(middleDown)).toBeTrue();
  });
});
