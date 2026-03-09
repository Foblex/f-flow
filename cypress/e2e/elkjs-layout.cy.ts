describe('ElkjsLayout', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/elkjs-layout');
    cy.get('f-flow').scrollIntoView();
  });

  it('should reorient outputs after direction switch', () => {
    cy.get('.f-node', { timeout: 15000 }).should('have.length', 8);
    cy.get('.f-node-output').first().should('have.class', 'bottom');

    cy.contains('.f-button', 'Horizontal').click({ force: true });
    cy.get('.f-node-output', { timeout: 15000 }).first().should('have.class', 'right');

    cy.contains('.f-button', 'Vertical').click({ force: true });
    cy.get('.f-node-output', { timeout: 15000 }).first().should('have.class', 'bottom');
  });
});
