describe('Overview', () => {
  it('should open custom-nodes example from overview page', () => {
    cy.visit('http://localhost:4200/examples/overview');

    cy.contains('h1', 'Examples').should('exist');
    cy.get('a[href="/examples/custom-nodes"]').first().click({ force: true });

    cy.location('pathname').should('eq', '/examples/custom-nodes');
    cy.get('f-flow').should('exist');
  });
});
