describe('DragStartEndEvents', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/drag-start-end-events');
    cy.get('f-flow').scrollIntoView();
  });

  it('should append move-node and drag-ended events to log', () => {
    cy.get('.overlay').should('contain.text', 'Event list');

    cy.get('.f-node')
      .first()
      .then(($node: JQuery<HTMLElement>) => {
        const rect = $node[0].getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        cy.wrap($node)
          .trigger('mousedown', { button: 0, clientX: startX, clientY: startY, force: true })
          .trigger('mousemove', { clientX: startX + 6, clientY: startY + 6, force: true })
          .trigger('mousemove', { clientX: startX + 80, clientY: startY + 30, force: true })
          .trigger('pointerup', { clientX: startX + 80, clientY: startY + 30, force: true });
      });

    cy.get('.overlay').should('contain.text', 'move-node');
    cy.get('.overlay').should('contain.text', 'drag-ended');
  });
});
