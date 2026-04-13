describe('ConnectableSide', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/connectable-side');
    cy.get('f-flow').scrollIntoView();
  });

  it('should switch connector side labels', () => {
    cy.get('.f-connection').should('have.length', 3);

    cy.get('.f-node b')
      .first()
      .invoke('text')
      .then((beforeText) => {
        cy.contains('.f-button', 'Switch Sides').click();
        cy.get('.f-node b').first().invoke('text').should('not.equal', beforeText);
      });
  });
});
