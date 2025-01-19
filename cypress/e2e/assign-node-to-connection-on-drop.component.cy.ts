describe('AssignNodeToConnectionOnDropComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/assign-node-to-connection-on-drop')
  })

  it('should drag node to connection and connect it', function () {
    cy.get('f-flow').scrollIntoView();

    cy.get('#connection_112').should('exist');

    cy.get('div[data-f-input-id=\'1\']').should('exist');
    cy.get('div[data-f-input-id=\'2\']').should('exist');
    cy.get('div[data-f-input-id=\'3\']').should('exist');

    cy.get('div[data-f-node-id="3"]').then(($target) => {
      const targetRect = $target[ 0 ].getBoundingClientRect();
      const endY = targetRect.y + targetRect.height / 2;

      cy.get('div[data-f-node-id="3"]')
        .trigger('mousedown', { button: 0, clientY: endY, force: true })
        .trigger('mousemove', { button: 0, clientY: endY + 140, force: true })
        .trigger('mouseup', { force: true });

      cy.get('#connection_232').should('exist');
      cy.get('#connection_113').should('exist');
    });
  });
})



