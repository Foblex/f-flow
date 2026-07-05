import { RectExtensions } from '@foblex/2d';
import { findSpatialNeighbor, IFA11yNavigable } from './f-a11y-navigation';

describe('a11y spatial navigation', () => {
  const item = (id: string, x: number, y: number, width = 100, height = 50): IFA11yNavigable => ({
    id,
    rect: RectExtensions.initialize(x, y, width, height),
  });

  const origin = RectExtensions.initialize(0, 0, 100, 50);

  it('should prefer a same-row candidate over a slightly nearer off-row one', () => {
    const sameRow = item('same-row', 300, 0);
    const offRow = item('off-row', 250, 200);

    expect(findSpatialNeighbor(origin, [sameRow, offRow], 'right')?.id).toBe('same-row');
  });

  it('should prefer a near diagonal neighbor over a far straight one', () => {
    // A strict straight-sector priority would jump to the far item across the canvas.
    const nearDiagonal = item('near-diagonal', 140, 90);
    const farStraight = item('far-straight', 600, 0);

    expect(findSpatialNeighbor(origin, [nearDiagonal, farStraight], 'right')?.id).toBe(
      'near-diagonal',
    );
  });

  it('should measure by facing edges, not centers', () => {
    // A tall node whose center is far below still starts right next to the origin.
    const tall = item('tall', 150, -200, 80, 600);
    const small = item('small', 400, 0);

    expect(findSpatialNeighbor(origin, [tall, small], 'right')?.id).toBe('tall');
  });

  it('should qualify candidates by center direction only', () => {
    const below = item('below', 0, 300);

    expect(findSpatialNeighbor(origin, [below], 'up')).toBeUndefined();
    expect(findSpatialNeighbor(origin, [below], 'down')?.id).toBe('below');
    expect(findSpatialNeighbor(origin, [below], 'right')).toBeUndefined();
  });

  it('should navigate to zero-size stops such as connection midpoints', () => {
    const midpoint: IFA11yNavigable = {
      id: 'midpoint',
      rect: RectExtensions.initialize(200, 25, 0, 0),
    };
    const node = item('node', 400, 0);

    expect(findSpatialNeighbor(origin, [midpoint, node], 'right')?.id).toBe('midpoint');
  });

  it('should prefer the remembered source when navigating back', () => {
    const near = item('near', 300, 0);
    const far = item('far', 600, 0);

    expect(findSpatialNeighbor(origin, [near, far], 'right', 'far')?.id).toBe('far');
    expect(findSpatialNeighbor(origin, [near, far], 'right')?.id).toBe('near');
  });

  it('should ignore the remembered source when it does not lie in the direction', () => {
    const near = item('near', 300, 0);
    const above = item('above', 0, -300);

    expect(findSpatialNeighbor(origin, [near, above], 'right', 'above')?.id).toBe('near');
  });

  it('should break score ties by center distance', () => {
    // Both overlap the origin row (zero orthogonal gap) with the same facing-edge gap.
    const shallow = item('shallow', 200, 0, 100, 50);
    const deep = item('deep', 200, -200, 100, 500);

    expect(findSpatialNeighbor(origin, [shallow, deep], 'right')?.id).toBe('shallow');
  });
});
