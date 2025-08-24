describe('Grouping — drag child group into parent and expand parent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/grouping');
    cy.get('f-flow').scrollIntoView();
  });

  it('drags [data-f-group-id="group3"] inside [data-f-group-id="group2"] and changes parent width', () => {

    cy.get('[data-f-group-id="group2"]', { timeout: 2000 })
      .should('exist')
      .then(($parent: JQuery<HTMLElement>) => {
        const startRect = $parent[0].getBoundingClientRect();
        const startWidth = startRect.width;

        cy.get('[data-f-group-id="group3"]', { timeout: 2000 })
          .should('exist')
          .then(($children: JQuery<HTMLElement>) => {
            const childRect = $children[0].getBoundingClientRect();
            const fromX = childRect.left + childRect.width / 2;
            const fromY = childRect.top + childRect.height / 2;
            const toX = fromX + 250;
            const toY = fromY + 250;

            cy.wrap($children)
              .first()
              .trigger('pointerdown', { clientX: fromX, clientY: fromY, button: 0, force: true })
              .trigger('pointermove', { clientX: fromX + 10, clientY: fromY + 10, force: true })
              .trigger('pointermove', { clientX: toX, clientY: toY, force: true })
              .wait(500)
              .trigger('pointerup',   { clientX: toX, clientY: toY, force: true });

            cy.get('[data-f-group-id="group2"]')
              .then(($parentAfter: JQuery<HTMLElement>) => {
                const afterWidth = $parentAfter[0].getBoundingClientRect().width;
                expect(afterWidth).to.not.equal(startWidth);
              });
          });
      });
  });
});
