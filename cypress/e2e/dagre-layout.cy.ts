describe('DagreLayout', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/dagre-layout');
    cy.get('f-flow').scrollIntoView();
  });

  it('should switch connector orientation between vertical and horizontal layout', () => {
    cy.get('.f-node', { timeout: 10000 }).should('have.length', 10);
    cy.get('.f-node-output').first().should('have.class', 'bottom');

    cy.contains('.f-button', 'Horizontal').click({ force: true });
    cy.get('.f-node-output').first().should('have.class', 'right');

    cy.contains('.f-button', 'Vertical').click({ force: true });
    cy.get('.f-node-output').first().should('have.class', 'bottom');
  });
});
