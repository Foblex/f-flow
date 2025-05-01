export class MoveCursorAnimated {
  private startTime = 0;
  private fromX = 0;
  private fromY = 0;
  private toX = 0;
  private toY = 0;
  private duration = 800;

  constructor(
    private element: HTMLElement,
    private source: HTMLElement,
    private target: HTMLElement,
    private options: { duration?: number; }
  ) {}

  private easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  private calculatePositions(): void {
    const offsetX = 0;
    const offsetY = 0;
    const duration = this.options.duration || 800;

    const fromRect = this.source.getBoundingClientRect();
    const toRect = this.target.getBoundingClientRect();

    this.fromX = fromRect.left;
    this.fromY = fromRect.top;
    this.toX = toRect.left + offsetX;
    this.toY = toRect.top + offsetY;
    this.duration = duration;
  }

  public async move(): Promise<void> {
    this.calculatePositions();
    this.startTime = performance.now();

    return new Promise((resolve) => {
      const animate = (time: number) => {
        const elapsed = time - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);
        const eased = this.easeInOutQuad(progress);

        const currentX = this.fromX + (this.toX - this.fromX) * eased;
        const currentY = this.fromY + (this.toY - this.fromY) * eased;

        this.element.style.left = `${currentX}px`;
        this.element.style.top = `${currentY}px`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }
}
