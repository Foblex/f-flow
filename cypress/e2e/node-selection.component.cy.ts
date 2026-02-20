describe('NodeSelectionComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/node-selection');
    cy.get('f-flow').scrollIntoView();
    cy.wait(200);
  });

  it('should select node and emit selection change event', () => {
    cy.get('[data-f-node-id="node1"]').click({ force: true });

    cy.get('.f-node.f-selected').should('have.length', 1);
    cy.get('[data-f-node-id="node1"]').should('have.class', 'f-selected');
    cy.get('.overlay').should('contain.text', 'Selection changed: node1');
  });

  it('should ignore selection on node with selection disabled', () => {
    cy.get('[data-f-node-id="node3"]').click({ force: true });

    cy.get('[data-f-node-id="node3"]').should('not.have.class', 'f-selected');
    cy.get('.f-node.f-selected').should('have.length', 0);
    cy.get('.overlay').should('not.contain.text', 'node3');
  });

  it('should select connection from toolbar action', () => {
    cy.contains('.f-button', 'Select Connection').click();

    cy.get('#connection1').should('have.class', 'f-selected');
    cy.get('.f-node.f-selected').should('have.length', 0);
  });
});
