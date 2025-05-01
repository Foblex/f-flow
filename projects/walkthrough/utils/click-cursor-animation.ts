export async function clickCursorAnimation(
  cursorRef: HTMLElement,
  options?: { scale?: number; duration?: number }
): Promise<void> {
  const { scale = 0.8, duration = 150 } = options || {};

  return new Promise((resolve) => {
    cursorRef.style.transition = `transform ${duration / 2}ms ease`;

    cursorRef.style.transform = `scale(${scale})`;

    setTimeout(() => {
      cursorRef.style.transform = 'scale(1)';
      setTimeout(() => {
        cursorRef.style.transition = ''; // убираем transition после анимации
        resolve();
      }, duration / 2);
    }, duration / 2);
  });
}
