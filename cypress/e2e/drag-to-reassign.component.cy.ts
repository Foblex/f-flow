describe('DragToReassignComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/drag-to-reassign')
  })

  it('should drag from input to anoyher input and reassign the connection', function () {
    cy.get('f-flow').scrollIntoView();

    cy.get('#connection_f-connection-01input-1').should('exist');
    cy.get('div[data-f-input-id=\'input-1\']').should('exist');
    cy.get('div[data-f-input-id=\'input-2\']').should('exist');

    cy.get('div[data-f-input-id="input-2"]').then(($target) => {
      const targetRect = $target[ 0 ].getBoundingClientRect();
      const endY = targetRect.y + targetRect.height / 2;

      cy.get('.f-connection-drag-handle')
        .trigger('mousedown', { button: 0, force: true })
        .trigger('mousemove', { clientY: 0, force: true })
        .get('div[data-f-input-id=\'input-2\']')
        .trigger('mousemove', { clientY: endY, force: true })
        .trigger('mouseup', { force: true });

      cy.get('#connection_f-connection-01input-1').should('not.exist');
      cy.get('#connection_for_selection_f-connection-11input-2').should('exist');
    });
  });
})



