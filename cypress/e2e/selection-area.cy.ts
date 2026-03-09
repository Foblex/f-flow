describe('SelectionArea', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/selection-area');
    cy.get('f-flow').scrollIntoView();
    cy.wait(200);
  });

  it('should select nodes with shift + drag selection box', () => {
    cy.get('.f-node.f-selected').should('have.length', 0);
    cy.get('f-selection-area').should(($area: JQuery<HTMLElement>) => {
      expect(getComputedStyle($area[0]).display).to.equal('none');
    });

    cy.get('.f-node')
      .first()
      .then(($firstNode: JQuery<HTMLElement>) => {
        const firstRect = $firstNode[0].getBoundingClientRect();

        cy.get('.f-node')
          .eq(1)
          .then(($secondNode: JQuery<HTMLElement>) => {
            const secondRect = $secondNode[0].getBoundingClientRect();

            const startX = Math.min(firstRect.left, secondRect.left) - 20;
            const startY = Math.min(firstRect.top, secondRect.top) - 20;
            const endX = Math.max(firstRect.right, secondRect.right) + 20;
            const endY = Math.max(firstRect.bottom, secondRect.bottom) + 20;

            cy.get('f-flow').trigger('mousedown', {
              button: 0,
              clientX: startX,
              clientY: startY,
              shiftKey: true,
              force: true,
            });

            cy.get('body')
              .trigger('mousemove', {
                clientX: startX + 5,
                clientY: startY + 5,
                shiftKey: true,
                force: true,
              })
              .trigger('mousemove', {
                clientX: endX,
                clientY: endY,
                shiftKey: true,
                force: true,
              });

            cy.get('f-selection-area').should(($area: JQuery<HTMLElement>) => {
              expect(getComputedStyle($area[0]).display).to.not.equal('none');
            });

            cy.get('body').trigger('pointerup', {
              clientX: endX,
              clientY: endY,
              shiftKey: true,
              force: true,
            });
          });
      });

    cy.get('f-selection-area').should(($area: JQuery<HTMLElement>) => {
      expect(getComputedStyle($area[0]).display).to.equal('none');
    });
    cy.get('.f-node.f-selected').should('have.length', 2);
  });
});
