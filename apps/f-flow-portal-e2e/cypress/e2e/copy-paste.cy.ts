describe('CopyPaste', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/copy-paste');
    cy.get('f-flow').scrollIntoView();
  });

  it('should cut selected node and restore it with paste', () => {
    cy.get('.f-node').should('have.length', 3);
    cy.contains('.f-button', 'Paste').should('be.disabled');

    cy.get('[data-f-node-id="node1"]').click({ force: true });
    cy.contains('.f-button', 'Cut').should('not.be.disabled').click({ force: true });

    cy.get('.f-node').should('have.length', 2);
    cy.contains('.f-button', 'Paste').should('not.be.disabled').click({ force: true });
    cy.get('.f-node').should('have.length', 3);
  });
});
