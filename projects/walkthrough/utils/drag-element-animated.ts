export async function dragElementAnimated(
  cursorRef: HTMLElement,
  element: HTMLElement,
  fromRect: DOMRect,
  toRect: DOMRect,
  options?: { duration?: number }
): Promise<void> {
  const { duration = 800 } = options || {};
  const startTime = performance.now();

  const startX = fromRect.left;
  const startY = fromRect.top;
  const endX = toRect.left;
  const endY = toRect.top;

  // Генерируем небольшую случайную дугу движения
  const curveControlX = (startX + endX) / 2 + (Math.random() * 80 - 40); // отклонение по X
  const curveControlY = (startY + endY) / 2 + (Math.random() * 60 - 30); // отклонение по Y

  function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
    return (
      Math.pow(1 - t, 3) * p0 +
      3 * Math.pow(1 - t, 2) * t * p1 +
      3 * (1 - t) * Math.pow(t, 2) * p2 +
      Math.pow(t, 3) * p3
    );
  }

  return new Promise((resolve) => {
    function easeInOutSine(t: number): number {
      return -(Math.cos(Math.PI * t) - 1) / 2;
    }

    function animate(time: number) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutSine(progress);

      // Движение по кривой Безье
      const currentX = cubicBezier(eased, startX, curveControlX, curveControlX, endX);
      const currentY = cubicBezier(eased, startY, curveControlY, curveControlY, endY);

      element.style.left = `${currentX}px`;
      element.style.top = `${currentY}px`;

      cursorRef.style.left = `${currentX + element.offsetWidth / 2}px`;
      cursorRef.style.top = `${currentY + element.offsetHeight / 2}px`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(animate);
  });
}
