describe('ConnectionGradients', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/connection-gradients');
    cy.get('f-flow').scrollIntoView();
  });

  it('should apply different connection gradients', () => {
    cy.get('.f-connection').should('have.length', 2);
    cy.get('.f-connection').first().should('have.class', 'gradient-color');

    cy.get('.f-connection')
      .eq(0)
      .find('stop')
      .first()
      .invoke('attr', 'stop-color')
      .then((firstColor) => {
        cy.get('.f-connection')
          .eq(1)
          .find('stop')
          .first()
          .invoke('attr', 'stop-color')
          .should('not.equal', firstColor);
      });
  });
});
