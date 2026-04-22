describe('ConnectionTypes', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/connection-types');
    cy.get('f-flow').scrollIntoView();
  });

  it('should render all built-in connection types', () => {
    cy.get('f-connection[data-f-connection-type="straight"]').should('have.length', 1);
    cy.get('f-connection[data-f-connection-type="segment"]').should('have.length', 1);
    cy.get('f-connection[data-f-connection-type="bezier"]').should('have.length', 1);
    cy.get('f-connection[data-f-connection-type="adaptive-curve"]').should('have.length', 1);
  });
});
