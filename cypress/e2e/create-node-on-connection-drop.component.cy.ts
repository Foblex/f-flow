describe('CreateNodeOnConnectionDropComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/create-node-on-connection-drop');
    cy.get('f-flow').scrollIntoView();
  })

  it('should drag from output to any place and create node with connection', function () {
    cy.get('#f-connection-0', { timeout: 500 }).should('not.exist');
    cy.get('.f-node', { timeout: 500 }).should('have.length', 1);

    cy.get('div[data-f-output-id=\'f-node-output-0\']', { timeout: 500 })
      .trigger('mousedown', { button: 0, force: true })
      .trigger('mousemove', { clientX: 0, clientY: 0 })
      .trigger('mousemove', { clientX: 140, clientY: 10 })
      .trigger('pointerup', { clientX: 140, clientY: 10 });

    cy.get('#f-connection-0').should('exist');
    cy.get('.f-node').should('have.length', 2);
  });
})



