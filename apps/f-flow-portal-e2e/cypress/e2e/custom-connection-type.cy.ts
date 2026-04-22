describe('CustomConnectionType', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/custom-connection-type');
    cy.get('f-flow').scrollIntoView();
  });

  it('should render custom builders', () => {
    cy.get('f-connection').should('have.length', 2);
    cy.get('f-connection[data-f-connection-type="offset_straight"]').should('have.length', 1);
    cy.get('f-connection[data-f-connection-type="circle"]').should('have.length', 1);
  });
});
