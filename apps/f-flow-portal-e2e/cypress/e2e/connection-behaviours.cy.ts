describe('ConnectionBehaviours', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/connection-behaviours');
    cy.get('f-flow').scrollIntoView();
  });

  it('should keep behavior labels and update floating path on drag', () => {
    cy.get('.f-connection').should('have.length', 3);
    cy.get('.f-connection-content').should('contain.text', 'fixed');
    cy.get('.f-connection-content').should('contain.text', 'fixed_center');
    cy.get('.f-connection-content').should('contain.text', 'floating');

    cy.get('.f-connection-path')
      .eq(2)
      .invoke('attr', 'd')
      .then((beforePath) => {
        cy.get('.f-node')
          .eq(5)
          .then(($node: JQuery<HTMLElement>) => {
            const rect = $node[0].getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;

            cy.wrap($node)
              .trigger('mousedown', { button: 0, clientX: startX, clientY: startY, force: true })
              .trigger('mousemove', { clientX: startX + 5, clientY: startY + 5, force: true })
              .trigger('mousemove', {
                clientX: startX + 120,
                clientY: startY + 30,
                force: true,
              })
              .trigger('pointerup', {
                clientX: startX + 120,
                clientY: startY + 30,
                force: true,
              });
          });

        cy.get('.f-connection-path').eq(2).invoke('attr', 'd').should('not.equal', beforePath);
      });
  });
});
