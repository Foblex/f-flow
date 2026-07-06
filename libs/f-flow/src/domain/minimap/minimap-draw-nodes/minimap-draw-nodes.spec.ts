import {
  canvasFactory,
  configureDiTest,
  FComponentsStore,
  injectFromDi,
  nodeFactory,
  valueProvider,
} from '@foblex/flow';
import { MinimapNodeRects } from '../minimap-node-rects';
import { MinimapDrawNodes } from './minimap-draw-nodes';
import { MinimapDrawNodesRequest } from './minimap-draw-nodes-request';

describe('MinimapDrawNodes', () => {
  let store: FComponentsStore;
  let execution: MinimapDrawNodes;
  let host: SVGGElement;

  beforeEach(() => {
    store = new FComponentsStore();
    store.fCanvas = canvasFactory().build();

    configureDiTest({
      providers: [MinimapDrawNodes, MinimapNodeRects, valueProvider(FComponentsStore, store)],
    });

    execution = injectFromDi(MinimapDrawNodes);
    host = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  });

  function addNode(id: string, x: number, y: number) {
    const node = nodeFactory().id(id).position({ x, y }).build();
    node._size = { width: 100, height: 50 };
    store.nodes.add(node);
    store.emitNodeChanges();

    return node;
  }

  function draw(): void {
    execution.handle(new MinimapDrawNodesRequest(host));
  }

  it('renders one rect per node in flow coordinates', () => {
    addNode('a', 10, 20);
    addNode('b', 300, 400);

    draw();

    const rects = host.querySelectorAll('rect');
    expect(rects.length).toBe(2);
    expect(rects[0].getAttribute('x')).toBe('10');
    expect(rects[0].getAttribute('y')).toBe('20');
  });

  it('reuses the same elements across passes and only moves the group on pan', () => {
    addNode('a', 10, 20);
    draw();
    const original = host.querySelector('rect');

    store.transform.position = { x: -500, y: 0 };
    draw();

    expect(host.querySelector('rect')).toBe(original);
    expect(original?.getAttribute('x')).toBe('10');
    expect(host.getAttribute('transform')).toBe('translate(-500 0)');
  });

  it('updates a rect when its node moves', () => {
    const node = addNode('a', 10, 20);
    draw();

    node._position = { x: 70, y: 20 };
    draw();

    expect(host.querySelector('rect')?.getAttribute('x')).toBe('70');
  });

  it('syncs the selection class without rebuilding', () => {
    const node = addNode('a', 10, 20);
    draw();
    const element = host.querySelector('rect');

    node.markAsSelected();
    draw();

    expect(host.querySelector('rect')).toBe(element);
    expect(element?.getAttribute('class')).toContain('f-selected');
  });

  it('removes rects for removed nodes', () => {
    const node = addNode('a', 10, 20);
    addNode('b', 300, 400);
    draw();

    store.nodes.remove(node);
    store.emitNodeChanges();
    draw();

    expect(host.querySelectorAll('rect').length).toBe(1);
  });

  it('self-heals after an external clear', () => {
    addNode('a', 10, 20);
    draw();
    host.replaceChildren();

    draw();

    expect(host.querySelectorAll('rect').length).toBe(1);
  });
});
