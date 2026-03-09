describe('MagneticRects', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/magnetic-rects');
    cy.get('f-flow').scrollIntoView();
    cy.wait(200);
  });

  it('should render magnetic rects plugin and keep nodes draggable', () => {
    cy.get('f-magnetic-rects').should('exist');

    cy.contains('.f-node', 'Node 1').then(($node1: JQuery<HTMLElement>) => {
      const node1Rect = $node1[0].getBoundingClientRect();
      const startX = node1Rect.left + node1Rect.width / 2;
      const startY = node1Rect.top + node1Rect.height / 2;
      const dragX = startX + 120;
      const dragY = startY + 20;

      cy.wrap($node1).trigger('mousedown', {
        button: 0,
        clientX: startX,
        clientY: startY,
        force: true,
      });

      cy.get('body')
        .trigger('mousemove', {
          clientX: startX + 5,
          clientY: startY + 5,
          force: true,
        })
        .trigger('mousemove', {
          clientX: dragX,
          clientY: dragY,
          force: true,
        });

      cy.wait(120);

      cy.get('body').trigger('pointerup', {
        clientX: dragX,
        clientY: dragY,
        force: true,
      });

      cy.wait(120);

      cy.contains('.f-node', 'Node 1').then(($node1After: JQuery<HTMLElement>) => {
        const node1AfterRect = $node1After[0].getBoundingClientRect();
        expect(Math.abs(node1AfterRect.left - node1Rect.left)).to.be.greaterThan(30);
      });
    });
  });
});
