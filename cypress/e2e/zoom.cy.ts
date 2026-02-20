describe('Zoom', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/zoom');
    cy.get('f-flow').scrollIntoView();
    cy.wait(200);
  });

  function getScale(transform: string): number {
    const match = /matrix\(([-\d.]+),/.exec(transform);

    return match ? Number.parseFloat(match[1]) : 1;
  }

  it('should zoom in and zoom out via toolbar buttons', () => {
    let initialScale = 1;
    let zoomInScale = 1;

    cy.get('f-canvas')
      .first()
      .then(($canvas: JQuery<HTMLElement>) => {
        initialScale = getScale($canvas.css('transform'));
      });

    cy.contains('.f-button', 'Zoom In').click();
    cy.wait(120);

    cy.get('f-canvas')
      .first()
      .then(($canvasAfterIn: JQuery<HTMLElement>) => {
        zoomInScale = getScale($canvasAfterIn.css('transform'));
        expect(zoomInScale).to.be.greaterThan(initialScale);
      });

    cy.contains('.f-button', 'Zoom Out').click();
    cy.wait(120);

    cy.get('f-canvas')
      .first()
      .then(($canvasAfterOut: JQuery<HTMLElement>) => {
        const zoomOutScale = getScale($canvasAfterOut.css('transform'));
        expect(zoomOutScale).to.be.lessThan(zoomInScale);
        expect(Math.abs(zoomOutScale - initialScale)).to.be.lessThan(0.2);
      });
  });
});
