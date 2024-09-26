describe('DragToReassignComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/drag-to-reassign')
  })

  it('should drag from input to anoyher input and reassign the connection', function() {
    cy.get('#connection_f-connection-012').should('exist');

    cy.get('.f-connection-drag-handle')
      .trigger('mousedown', { button: 0, force: true })
      .trigger('mousemove', { clientX: 0, clientY: 0 })
      .trigger('mousemove', { clientX: 20, clientY: 10 })
      .get('div[data-f-input-id=\'f-node-input-1\']')
      .trigger('mousemove', { clientX: 20, clientY: 10 })
      .trigger('mouseup');

    cy.get('#connection_f-connection-012').should('not.exist');
    cy.get('#connection_for_selection_f-connection-11f-node-input-1').should('exist');
  });
})



