describe('DragToReassignComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/drag-to-reassign');
    cy.get('f-flow').scrollIntoView();
  })

  it('should drag from input to another input and reassign the connection', function () {
    cy.get('#connection_113').should('exist');

    cy.get('div[data-f-input-id="3"]').should('exist');
    cy.get('div[data-f-input-id="4"]').should('exist');

    cy.get('.f-connection-drag-handle').first().then(($handle) => {
      const handleRect = $handle[0].getBoundingClientRect();
      const startY = handleRect.top + handleRect.height / 2;
      const startX = handleRect.left + handleRect.width / 2;

      cy.get('div[data-f-input-id="4"]').first().then(($input2) => {
        const input2Rect = $input2[ 0 ].getBoundingClientRect();
        const endY = input2Rect.top + input2Rect.height / 2;
        const endX = input2Rect.left + input2Rect.width / 2;

        cy.get('.f-connection-drag-handle')
          .trigger('mousedown', { button: 0, clientY: startY, clientX: startX, force: true })
          .trigger('mousemove', { clientY: endY, clientX: endX, force: true })
          .trigger('pointerup', { clientY: endY, clientX: endX, force: true });

        cy.get('#connection_113').should('not.exist');
        cy.get('#connection_114').should('exist');
      });
    });
  });
})



