describe('Background', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/background');
    cy.get('f-flow').scrollIntoView();
    cy.wait(200);
  });

  it('should render flow with background plugin', () => {
    cy.get('f-background').should('exist');
    cy.get('f-background pattern').should('have.length.at.least', 1);
    cy.get('.f-node').should('have.length', 2);
    cy.get('.f-connection').should('have.length', 1);
    cy.get('mat-select').should('have.length', 1);
  });
});
