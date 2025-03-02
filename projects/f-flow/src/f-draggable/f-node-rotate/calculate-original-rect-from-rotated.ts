import { IRoundedRect, RoundedRect } from '@foblex/2d';

// export function calculateOriginalRectFromRotated(rect: IRoundedRect, rotate: number) {
//   const size = getOriginalSize(rect.width, rect.height, rotate);
//   return fromCenter(rect, size.width, size.height);
// }

// function getOriginalSize(rotatedWidth: number, rotatedHeight: number, angle: number): { width: number, height: number } {
//   const rad = (angle * Math.PI) / 180;
//   const factor = Math.cos(rad) + Math.sin(rad);
//   return {
//     width: rotatedWidth / factor,
//     height: rotatedHeight / factor
//   };
// }
//
// function fromCenter(rect: IRoundedRect, width: number, height: number): IRoundedRect {
//   return new RoundedRect(
//     rect.gravityCenter.x - width / 2,
//     rect.gravityCenter.y - height / 2,
//     width,
//     height,
//     rect.radius1,
//     rect.radius2,
//     rect.radius3,
//     rect.radius4
//   );
// }
