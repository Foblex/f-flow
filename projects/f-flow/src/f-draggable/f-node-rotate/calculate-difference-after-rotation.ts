export function calculateDifferenceAfterRotation(
  position: { x: number; y: number },
  rotation: number,
  pivot: { x: number; y: number },
): { x: number; y: number } {

  const { x: newX, y: newY } = calculatePositionAfterRotation(position, rotation, pivot);

  const dx = newX - position.x;
  const dy = newY - position.y;

  return { x: dx, y: dy };
}

export function calculatePositionAfterRotation(
  position: { x: number; y: number },
  rotation: number,
  pivot: { x: number; y: number },
): { x: number; y: number } {
  const translatedX = position.x - pivot.x;
  const translatedY = position.y - pivot.y;

  const theta = rotation * Math.PI / 180;

  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);

  const rotatedX = translatedX * cosTheta - translatedY * sinTheta;
  const rotatedY = translatedX * sinTheta + translatedY * cosTheta;

  const newX = rotatedX + pivot.x;
  const newY = rotatedY + pivot.y;

  return { x: newX, y: newY };
}

