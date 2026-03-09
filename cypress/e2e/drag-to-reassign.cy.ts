describe('DragToReassign', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/drag-to-reassign');
    cy.get('f-flow').scrollIntoView();
  });

  it('should reassign connection target from input 3 to input 4', () => {
    cy.get('.f-connection').should('have.length', 1);
    cy.get('[data-f-input-id="3"]').should('have.class', 'f-node-input-connected');
    cy.get('[data-f-input-id="4"]').should('not.have.class', 'f-node-input-connected');

    cy.get('.f-connection-drag-handle')
      .should('have.length', 1)
      .first()
      .then(($handle: JQuery<HTMLElement>) => {
        const handleRect = $handle[0].getBoundingClientRect();
        const startX = handleRect.left + handleRect.width / 2;
        const startY = handleRect.top + handleRect.height / 2;

        cy.get('[data-f-input-id="4"]')
          .first()
          .then(($targetInput: JQuery<HTMLElement>) => {
            const targetRect = $targetInput[0].getBoundingClientRect();
            const endX = targetRect.left + targetRect.width / 2;
            const endY = targetRect.top + targetRect.height / 2;

            cy.wrap($handle).trigger('mousedown', {
              button: 0,
              clientX: startX,
              clientY: startY,
              force: true,
            });

            cy.get('body')
              .trigger('mousemove', {
                clientX: startX + 2,
                clientY: startY + 2,
                force: true,
              })
              .trigger('mousemove', {
                clientX: endX,
                clientY: endY,
                force: true,
              })
              .trigger('pointerup', {
                clientX: endX,
                clientY: endY,
                force: true,
              });
          });
      });

    cy.get('[data-f-input-id="3"]', { timeout: 2000 }).should(
      'not.have.class',
      'f-node-input-connected',
    );
    cy.get('[data-f-input-id="4"]').should('have.class', 'f-node-input-connected');
    cy.get('.f-connection').should('have.length', 1);
  });
});
