describe('NodeSelection', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/node-selection');
    cy.get('f-flow').scrollIntoView();
    cy.wait(200);
  });

  it('should select node and then select connection from toolbar', () => {
    cy.get('.f-node').first().click({ force: true });

    cy.get('.f-node.f-selected').should('have.length', 1);
    // FEventsPanelComponent renders each entry as `<name> <value>` columns.
    // The example logs `name: 'selectionChange'` with `value: 'node1'`, so the
    // panel must contain both substrings after the click.
    cy.get('f-events-panel').should('contain.text', 'selectionChange');
    cy.get('f-events-panel').should('contain.text', 'node1');

    cy.contains('.f-node', 'Disabled selection').click({ force: true });
    cy.contains('.f-node', 'Disabled selection').should('not.have.class', 'f-selected');
    cy.get('.f-node.f-selected').should('have.length', 0);

    cy.contains('button', 'Select Connection').click({ force: true });
    cy.get('.f-connection').first().should('have.class', 'f-selected');
    cy.get('.f-node.f-selected').should('have.length', 0);
  });
});
