import { getDeepElementsFromPoint } from './get-deep-elements-from-point';

describe('getDeepElementsFromPoint', () => {
  it('preserves native hit-test order when there is no shadow root', () => {
    const first = document.createElement('button');
    const second = document.createElement('div');
    spyOn(document, 'elementsFromPoint').and.returnValue([first, second]);

    expect(getDeepElementsFromPoint(document, 10, 10)).toEqual([first, second]);
  });

  it('expands an open shadow host before returning the host', () => {
    const host = document.createElement('div');
    host.style.cssText = `
      position: fixed;
      inset: 0 auto auto 0;
      width: 100px;
      height: 100px;
      z-index: 2147483647;
    `;
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const target = document.createElement('button');
    target.style.cssText = 'display: block; width: 100px; height: 100px;';
    shadowRoot.append(target);
    document.body.append(host);

    const elements = getDeepElementsFromPoint(document, 10, 10);

    expect(elements[0]).toBe(target);
    expect(elements).toContain(host);

    host.remove();
  });
});
