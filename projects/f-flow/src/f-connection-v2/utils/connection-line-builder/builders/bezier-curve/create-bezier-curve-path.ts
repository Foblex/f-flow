import { IPoint } from '@foblex/2d';

export function createBezierCurvePath(points: IPoint[]): string {
  return `M ${points[0].x} ${points[0].y} C ${points[1].x} ${points[1].y}, ${points[2].x} ${points[2].y}, ${points[3].x + 0.0002} ${points[3].y + 0.0002}`;
}

// export function createBezierCurvePath(points: IPoint[], tension = 1): string {
//   if (!points || points.length < 2) return '';
//
//   // 2 точки — это просто линия (иначе "кривая" бессмысленна)
//   if (points.length === 2) {
//     const [p0, p1] = points;
//
//     return `M ${p0.x} ${p0.y} L ${p1.x + 0.0002} ${p1.y + 0.0002}`;
//   }
//
//   let d = `M ${points[0].x} ${points[0].y}`;
//   const t = tension;
//
//   for (let i = 0; i < points.length - 1; i++) {
//     const p0 = points[i - 1] ?? points[i];
//     const p1 = points[i];
//     const p2 = points[i + 1];
//     const p3 = points[i + 2] ?? points[i + 1];
//
//     // control points for segment p1 -> p2
//     const c1: IPoint = {
//       x: p1.x + ((p2.x - p0.x) / 6) * t,
//       y: p1.y + ((p2.y - p0.y) / 6) * t,
//     };
//
//     const c2: IPoint = {
//       x: p2.x - ((p3.x - p1.x) / 6) * t,
//       y: p2.y - ((p3.y - p1.y) / 6) * t,
//     };
//
//     const isLast = i === points.length - 2;
//     const endX = isLast ? p2.x + 0.0002 : p2.x;
//     const endY = isLast ? p2.y + 0.0002 : p2.y;
//
//     d += ` C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${endX} ${endY}`;
//   }
//
//   return d;
// }
