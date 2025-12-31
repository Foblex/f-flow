import { NORMALIZED_MAX, NORMALIZED_MIN, PINCH_NORMALIZATION_RATIO } from '../constants';

export function normalizePinchStep(delta: number, step: number): number {
  const intensity = Math.abs(delta) * PINCH_NORMALIZATION_RATIO;

  return step * normalizeIntensity(intensity);
}

function normalizeIntensity(intensity: number): number {
  return Math.max(NORMALIZED_MIN, Math.min(intensity, NORMALIZED_MAX));
}
