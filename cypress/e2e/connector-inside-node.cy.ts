describe('ConnectorInsideNode', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/connector-inside-node');
    cy.get('f-flow').scrollIntoView();
  });

  it('should keep connectors connected and update route after drag', () => {
    cy.get('.f-connection').should('have.length', 4);
    cy.get('.f-node .right.f-node-output').should('have.length.greaterThan', 0);
    cy.get('.f-node .left.f-node-input').should('have.length.greaterThan', 0);

    cy.get('.f-connection-path')
      .first()
      .invoke('attr', 'd')
      .then((beforePath) => {
        cy.get('.f-node')
          .eq(1)
          .then(($node: JQuery<HTMLElement>) => {
            const rect = $node[0].getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;

            cy.wrap($node)
              .trigger('mousedown', { button: 0, clientX: startX, clientY: startY, force: true })
              .trigger('mousemove', { clientX: startX + 6, clientY: startY + 6, force: true })
              .trigger('mousemove', {
                clientX: startX + 120,
                clientY: startY + 40,
                force: true,
              })
              .trigger('pointerup', {
                clientX: startX + 120,
                clientY: startY + 40,
                force: true,
              });
          });

        cy.get('.f-connection-path').first().invoke('attr', 'd').should('not.equal', beforePath);
      });
  });
});
