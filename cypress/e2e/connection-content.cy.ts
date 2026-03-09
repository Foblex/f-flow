describe('ConnectionContent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/connection-content');
    cy.get('f-flow').scrollIntoView();
    cy.wait(200);
  });

  it('should render content on each connection and keep it after controls change', () => {
    cy.get('.f-connection-content').should('have.length', 4).and('contain.text', 'Any Content');
    cy.get('mat-select').should('have.length', 3);

    cy.get('mat-select').first().click({ force: true });
    cy.contains('mat-option', '75%').click({ force: true });

    cy.get('.f-connection-content').should('have.length', 4).and('contain.text', 'Any Content');
  });
});
