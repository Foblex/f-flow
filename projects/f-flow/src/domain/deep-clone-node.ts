export function deepCloneNode<T extends (HTMLElement | SVGElement)>(node: T): T {
  const clone = node.cloneNode(true) as T;
  const descendantsWithId = clone.querySelectorAll('[id]');
  const nodeName = node.nodeName.toLowerCase();

  clone.removeAttribute('id');

  for (let i = 0; i < descendantsWithId.length; i++) {
    descendantsWithId[ i ].removeAttribute('id');
  }

  if (nodeName === 'canvas') {
    transferCanvasData(node as HTMLCanvasElement, clone as HTMLCanvasElement);
  } else if (nodeName === 'input' || nodeName === 'select' || nodeName === 'textarea') {
    transferInputData(node as HTMLInputElement, clone as HTMLInputElement);
  }

  transferData('canvas', node, clone, transferCanvasData);
  transferData('input, textarea, select', node, clone, transferInputData);
  return clone;
}

function transferData<T extends Element>(
  selector: string,
  node: HTMLElement | SVGElement,
  clone: HTMLElement | SVGElement,
  callback: (source: T, clone: T) => void,
) {
  const descendantElements = node.querySelectorAll<T>(selector);

  if (descendantElements.length) {
    const cloneElements = clone.querySelectorAll<T>(selector);

    for (let i = 0; i < descendantElements.length; i++) {
      callback(descendantElements[ i ], cloneElements[ i ]);
    }
  }
}

let cloneUniqueId = 0;

function transferInputData(
  source: Element & { value: string },
  clone: Element & { value: string; name: string; type: string },
) {
  if (clone.type !== 'file') {
    clone.value = source.value;
  }

  if (clone.type === 'radio' && clone.name) {
    clone.name = `mat-clone-${ clone.name }-${ cloneUniqueId++ }`;
  }
}

function transferCanvasData(source: HTMLCanvasElement, clone: HTMLCanvasElement) {
  const context = clone.getContext('2d');

  if (context) {
    try {
      context.drawImage(source, 0, 0);
    } catch {
    }
  }
}
