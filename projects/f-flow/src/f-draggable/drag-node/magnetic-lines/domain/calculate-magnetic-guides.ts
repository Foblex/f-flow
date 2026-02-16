import { IRect } from '@foblex/2d';
import { IMagneticGuidesResult } from './i-magnetic-guides-result';

export function calculateMagneticGuides(
  elements: IRect[],
  target: IRect,
  alignThreshold: number = 10,
): IMagneticGuidesResult {
  const tx = target.x;
  const ty = target.y;

  const tr = tx + target.width;
  const tb = ty + target.height;

  const tcx = target.gravityCenter.x;
  const tcy = target.gravityCenter.y;

  // Best candidates
  let bestXGuide: number | undefined;
  let bestXDelta: number | undefined;
  let bestXAbs = Infinity;

  let bestYGuide: number | undefined;
  let bestYDelta: number | undefined;
  let bestYAbs = Infinity;

  // Small helpers: readable + avoids repeated Math.abs calls.
  const considerX = (guide: number, delta: number): void => {
    const abs = delta < 0 ? -delta : delta;
    if (abs <= alignThreshold && abs < bestXAbs) {
      bestXAbs = abs;
      bestXGuide = guide;
      bestXDelta = delta;
    }
  };

  const considerY = (guide: number, delta: number): void => {
    const abs = delta < 0 ? -delta : delta;
    if (abs <= alignThreshold && abs < bestYAbs) {
      bestYAbs = abs;
      bestYGuide = guide;
      bestYDelta = delta;
    }
  };

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];

    // Precompute element anchors once per element
    const ex = el.x;
    const ey = el.y;

    const er = ex + el.width; // element right
    const eb = ey + el.height; // element bottom

    const ecx = el.gravityCenter.x;
    const ecy = el.gravityCenter.y;

    // X candidates
    considerX(ex, tx - ex); // target.left - element.left
    considerX(er, tx - er); // target.left - element.right
    considerX(ecx, tcx - ecx); // target.center - element.center
    considerX(ex, tr - ex); // target.right - element.left
    considerX(er, tr - er); // target.right - element.right

    // Y candidates
    considerY(ey, ty - ey); // target.top - element.top
    considerY(eb, ty - eb); // target.top - element.bottom
    considerY(ecy, tcy - ecy); // target.center - element.center
    considerY(ey, tb - ey); // target.bottom - element.top
    considerY(eb, tb - eb); // target.bottom - element.bottom
  }

  return {
    x: { guide: bestXGuide, delta: bestXDelta },
    y: { guide: bestYGuide, delta: bestYDelta },
  };
}
