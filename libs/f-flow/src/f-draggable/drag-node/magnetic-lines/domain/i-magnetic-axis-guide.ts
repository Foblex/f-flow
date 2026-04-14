export interface IMagneticAxisGuide {
  /** Guide coordinate (x or y) that we align to */
  guide?: number;

  /** Signed delta to apply to the dragged rect to align with the guide */
  delta?: number;
}
