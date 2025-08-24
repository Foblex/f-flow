describe('DragToGroupComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/drag-to-group');
    cy.get('f-flow').scrollIntoView();
  });

  it('should drag node into group and trigger onDropToGroup', () => {
    cy.get('.f-node.f-drag-handle', { timeout: 2000 }).then(($node: JQuery<HTMLElement>) => {
      const nodeRect = $node[0].getBoundingClientRect();

      cy.get('.f-group.f-drag-handle', { timeout: 2000 }).then(($group: JQuery<HTMLElement>) => {
        const groupRect = $group[0].getBoundingClientRect();

        const fromX = nodeRect.left + nodeRect.width / 2;
        const fromY = nodeRect.top + nodeRect.height / 2;
        const toX = groupRect.left + groupRect.width / 2;
        const toY = groupRect.top + groupRect.height / 2;

        cy.wrap($node)
          .first()
          .trigger('mousedown', { clientX: fromX, clientY: fromY, button: 0, force: true })
          .trigger('mousemove', { clientX: fromX + 10, clientY: fromY + 10, force: true })
          .trigger('mousemove', { clientX: toX, clientY: toY, force: true })
          .wait(500)
          .trigger('pointerup', { clientX: toX, clientY: toY, force: true });

        cy.wrap($node)
          .first()
          .should('have.attr', 'ng-reflect-f-parent-id', 'g1');
      });
    });
  });
});
