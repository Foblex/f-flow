describe('ConnectionGradients', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/connection-gradients');
    cy.get('f-flow').scrollIntoView();
  });

  it('should apply projected gradient only to the opted-in connection', () => {
    cy.get('.f-connection').should('have.length', 2);
    cy.get('.f-connection').first().should('have.class', 'gradient-color');
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
            cy.get('mat-select').first().click({ force: true });
            cy.contains('mat-option', 'Sky').click({ force: true });

            cy.get('mat-select').eq(1).click({ force: true });
            cy.contains('mat-option', 'Amber').click({ force: true });

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
