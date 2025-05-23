describe('RemoveConnectionOnDropComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/remove-connection-on-drop')
  })

  it('should drag connection from input to any place and remove the connection', function () {
    cy.get('f-flow').scrollIntoView();
    cy.get('#connection_f-connection-012').should('exist');
    cy.get('.f-connection').should('have.length', 2);

    cy.get('.f-connection-drag-handle')
      .first()
      .trigger('mousedown', { button: 0, force: true })
      .trigger('mousemove', { clientY: 0, force: true })
      .trigger('mousemove', { clientY: 200, clientX: 0, force: true })
      .trigger('pointerup', { force: true });


    cy.get('#connection_f-connection-012').should('not.exist');
    cy.get('.f-connection').should('have.length', 1);
  });
})



