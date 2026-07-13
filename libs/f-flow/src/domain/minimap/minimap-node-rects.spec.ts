import {
  canvasFactory,
  configureDiTest,
  FComponentsStore,
  injectFromDi,
  nodeFactory,
  valueProvider,
} from '@foblex/flow';
import { MinimapNodeRects } from './minimap-node-rects';

describe('MinimapNodeRects', () => {
  let store: FComponentsStore;
  let rects: MinimapNodeRects;

  beforeEach(() => {
    store = new FComponentsStore();
    store.fCanvas = canvasFactory().build();

    configureDiTest({
      providers: [MinimapNodeRects, valueProvider(FComponentsStore, store)],
    });

    rects = injectFromDi(MinimapNodeRects);
  });

  function addNode(id: string, x: number, y: number, width: number, height: number, rotate = 0) {
    const node = nodeFactory().id(id).position({ x, y }).rotate(rotate).build();
    node._size = { width, height };
    store.nodes.add(node);

    return node;
  }

  it('computes flow-space rects from the model without touching the DOM', () => {
    const node = addNode('a', 100, 50, 80, 40);
    const spy = spyOn(node.hostElement, 'getBoundingClientRect').and.callThrough();

    expect(rects.rectOf(node)).toEqual(
      jasmine.objectContaining({ x: 100, y: 50, width: 80, height: 40 }),
    );
    expect(spy).not.toHaveBeenCalled();
  });

  it('produces the rotated bounding box for rotated nodes', () => {
    const node = addNode('r', 0, 0, 100, 40, 90);

    const rect = rects.rectOf(node);

    // A 100x40 node rotated 90deg around its center occupies a 40x100 box.
    expect(rect.width).toBeCloseTo(40, 6);
    expect(rect.height).toBeCloseTo(100, 6);
    expect(rect.x).toBeCloseTo(30, 6);
    expect(rect.y).toBeCloseTo(-30, 6);
  });

  it('unions all node rects into the content rect', () => {
    addNode('a', 0, 0, 100, 50);
    addNode('b', 500, 300, 100, 50);

    expect(rects.contentRect()).toEqual(
      jasmine.objectContaining({ x: 0, y: 0, width: 600, height: 350 }),
    );
  });

  it('returns null content rect without nodes', () => {
    expect(rects.contentRect()).toBeNull();
  });

  it('derives the view offset from the canvas transform', () => {
    store.transform.position = { x: -200, y: 100 };
    store.transform.scale = 2;

    expect(rects.viewOffset()).toEqual({ x: -100, y: 50 });
  });

  it('re-measures auto-sized nodes only when the resize signal fires', () => {
    const node = nodeFactory().id('auto').position({ x: 0, y: 0 }).build();
    store.nodes.add(node);
    // jsdom-less Karma host: offsetWidth of a detached div is 0 — stub layout.
    let measuredWidth = 60;
    Object.defineProperty(node.hostElement, 'offsetWidth', { get: () => measuredWidth });
    Object.defineProperty(node.hostElement, 'offsetHeight', { get: () => 20 });

    rects.ensureFresh();
    expect(rects.rectOf(node).width).toBe(60);

    measuredWidth = 90;
    rects.ensureFresh();
    // No resize signal: the cached size stays.
    expect(rects.rectOf(node).width).toBe(60);

    store.emitConnectionChanges();
    rects.ensureFresh();
    expect(rects.rectOf(node).width).toBe(90);
  });
});
