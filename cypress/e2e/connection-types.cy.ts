describe('ConnectionTypes', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/connection-types');
    cy.get('f-flow').scrollIntoView();
  });

  it('should render all built-in connection types', () => {
    cy.get('f-connection[ng-reflect-f-type="straight"]').should('have.length', 1);
    cy.get('f-connection[ng-reflect-f-type="segment"]').should('have.length', 1);
    cy.get('f-connection[ng-reflect-f-type="bezier"]').should('have.length', 1);
    cy.get('f-connection[ng-reflect-f-type="adaptive-curve"]').should('have.length', 1);
  });
});
