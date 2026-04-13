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

  it('should keep connections aligned with nodes after the animated reset', () => {
    cy.document().should((doc) => {
      const nodes = Array.from(doc.querySelectorAll('.f-node'));
      const connections = Array.from(doc.querySelectorAll('.f-connection-path'));

      expect(nodes).to.have.length(6);
      expect(connections).to.have.length(3);

      const leftNodeRect = nodes[0].getBoundingClientRect();
      const rightNodeRect = nodes[1].getBoundingClientRect();
      const connectionRect = connections[0].getBoundingClientRect();

      expect(connectionRect.left).to.be.greaterThan(leftNodeRect.left - 24);
      expect(connectionRect.left).to.be.lessThan(leftNodeRect.right + 24);
      expect(connectionRect.right).to.be.greaterThan(rightNodeRect.left - 24);
      expect(connectionRect.right).to.be.lessThan(rightNodeRect.right + 24);
      expect(connectionRect.top).to.be.lessThan(leftNodeRect.bottom);
      expect(connectionRect.bottom).to.be.greaterThan(leftNodeRect.top);
      expect(connectionRect.top).to.be.lessThan(rightNodeRect.bottom);
      expect(connectionRect.bottom).to.be.greaterThan(rightNodeRect.top);
    });
  });
});
