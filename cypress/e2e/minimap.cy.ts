describe('Minimap', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/minimap');
    cy.get('f-flow').scrollIntoView();
    cy.wait(200);
  });

  it('should render minimap with viewport and node projections', () => {
    cy.get('f-minimap').should('exist');
    cy.get('.f-minimap-view', { timeout: 4000 }).should('exist');
    cy.get('.f-minimap-node', { timeout: 4000 }).should('have.length', 3);
  });
});
