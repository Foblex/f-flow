describe('ConnectionMarkers', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/connection-markers');
    cy.get('f-flow').scrollIntoView();
    cy.wait(200);
  });

  it('should render configured marker templates for connections', () => {
    cy.get('.f-connection').should('have.length', 3);
    cy.get('.connection-marker').should('have.length.at.least', 12);

    cy.get('.f-connection-path')
      .first()
      .invoke('attr', 'marker-end')
      .should('match', /url\(#.+\)/);

    cy.get('.f-connection-path')
      .first()
      .invoke('attr', 'marker-start')
      .should('match', /url\(#.+\)/);
  });
});
