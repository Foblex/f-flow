describe('ConnectionGradients', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/connection-gradients');
    cy.get('f-flow').scrollIntoView();
  });

  it('should apply projected gradient only to the opted-in connection', () => {
    cy.get('.f-connection').should('have.length', 2);
    cy.get('.f-connection').first().find('linearGradient').should('have.length', 1);
    cy.get('.f-connection').first().find('stop').should('have.length', 2);

    cy.get('.f-connection').eq(1).find('linearGradient').should('have.length', 0);
    cy.get('.f-connection').eq(1).find('stop').should('have.length', 0);
  });

  it('should update the projected gradient colors from toolbar controls', () => {
    cy.get('.f-connection')
      .first()
      .find('stop')
      .first()
      .invoke('attr', 'stop-color')
      .then((initialStartColor) => {
        cy.get('.f-connection')
          .first()
          .find('stop')
          .eq(1)
          .invoke('attr', 'stop-color')
          .then((initialEndColor) => {
            cy.contains('f-select', 'Gradient Start').find('select').select('Sky', { force: true });

            cy.contains('f-select', 'Gradient End').find('select').select('Amber', { force: true });

            cy.get('.f-connection')
              .first()
              .find('stop')
              .first()
              .invoke('attr', 'stop-color')
              .should('eq', '#0ea5e9')
              .and('not.equal', initialStartColor);

            cy.get('.f-connection')
              .first()
              .find('stop')
              .eq(1)
              .invoke('attr', 'stop-color')
              .should('eq', '#f59e0b')
              .and('not.equal', initialEndColor);
          });
      });
  });
});
