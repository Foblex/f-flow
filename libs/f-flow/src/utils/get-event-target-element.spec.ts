import { getEventTargetElement } from './get-event-target-element';

describe('getEventTargetElement', () => {
  it('resolves a flow target through an open shadow root when the native target is outside it', () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const flow = document.createElement('f-flow');
    const target = document.createElement('button');
    flow.append(target);
    shadowRoot.append(flow);
    document.body.appendChild(host);
    const resolved: Element[] = [];

    const listener = (event: MouseEvent) => {
      expect(event.target).toBe(host);
      const element = getEventTargetElement(event, 'f-flow');
      if (element) {
        resolved.push(element);
      }
    };
    document.addEventListener('mousedown', listener, { once: true });

    target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true }));

    expect(resolved).toEqual([target]);
    host.remove();
  });

  it('keeps event.target when it already belongs to the requested boundary', () => {
    const flow = document.createElement('f-flow');
    const target = document.createElement('button');
    const pathTarget = document.createElement('span');
    flow.append(target);
    const event = new Event('test');
    Object.defineProperties(event, {
      target: { value: target },
      composedPath: { value: () => [pathTarget, target, flow, document] },
    });

    expect(getEventTargetElement(event, 'f-flow')).toBe(target);
  });

  it('falls back to event.target when composedPath is unavailable', () => {
    const target = document.createElement('div');
    const event = new Event('test');
    Object.defineProperty(event, 'target', { value: target });

    expect(getEventTargetElement(event)).toBe(target);
  });

  it('collapses nested shadow roots to an element inside the requested boundary', () => {
    const outerHost = document.createElement('div');
    const outerRoot = outerHost.attachShadow({ mode: 'open' });
    const flow = document.createElement('f-flow');
    const nestedHost = document.createElement('div');
    const nestedRoot = nestedHost.attachShadow({ mode: 'open' });
    const target = document.createElement('button');
    nestedRoot.append(target);
    flow.append(nestedHost);
    outerRoot.append(flow);
    document.body.append(outerHost);

    const listener = (event: MouseEvent) => {
      expect(getEventTargetElement(event, 'f-flow')).toBe(nestedHost);
      outerHost.remove();
    };
    document.addEventListener('mousedown', listener, { once: true });

    target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true }));
  });
});
