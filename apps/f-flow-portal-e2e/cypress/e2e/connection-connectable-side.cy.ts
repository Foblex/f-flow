describe('ConnectionConnectableSide', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/connection-connectable-side');
    cy.get('f-flow').scrollIntoView();
  });

  it('should switch side labels in connection content', () => {
    cy.get('.f-connection').should('have.length', 3);

    cy.get('.f-connection-content')
      .first()
      .invoke('text')
      .then((beforeText) => {
        cy.contains('.f-button', 'Switch Sides').click();
        cy.get('.f-connection-content').first().invoke('text').should('not.equal', beforeText);
      });
  });
});
